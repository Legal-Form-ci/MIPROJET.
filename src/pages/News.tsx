import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar, Eye, Search, ArrowRight, Clock, ArrowLeft, X, ImageOff, Share2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/i18n/LanguageContext";
import { formatDistanceToNow, format } from "date-fns";
import { fr, enUS, ar, zhCN, es, de } from "date-fns/locale";
import { SocialSharePopup } from "@/components/SocialSharePopup";

interface NewsItem {
  id: string;
  title: string;
  excerpt: string | null;
  content: string;
  image_url: string | null;
  category: string;
  published_at: string | null;
  views_count: number;
  created_at: string;
}

const News = () => {
  const { t, language } = useLanguage();
  const { id } = useParams();
  const navigate = useNavigate();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showShare, setShowShare] = useState(false);

  const getLocale = () => {
    switch (language) {
      case 'en': return enUS;
      case 'ar': return ar;
      case 'zh': return zhCN;
      case 'es': return es;
      case 'de': return de;
      default: return fr;
    }
  };

  const categories = [
    { value: "all", label: t('news.allCategories') || "Toutes les catégories" },
    { value: "general", label: t('news.categoryGeneral') || "Général" },
    { value: "events", label: t('news.categoryEvents') || "Événements" },
    { value: "projects", label: t('news.categoryProjects') || "Projets" },
    { value: "partnerships", label: t('news.categoryPartnerships') || "Partenariats" },
    { value: "training", label: t('news.categoryTraining') || "Formations" },
  ];

  const defaultImages = [
    "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&h=500&fit=crop",
    "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=500&fit=crop",
    "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=500&fit=crop"
  ];

  useEffect(() => {
    document.title = `${t('news.pageTitle')} | MIPROJET`;
    const setMeta = (attr: string, key: string, content: string) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
      if (!el) { el = document.createElement("meta"); el.setAttribute(attr, key); document.head.appendChild(el); }
      el.content = content;
    };
    setMeta("name", "description", "Suivez les dernières actualités de MIPROJET : événements, partenariats, formations et opportunités en Afrique.");
    setMeta("property", "og:title", t('news.pageTitle'));
    setMeta("property", "og:description", "Suivez les dernières actualités de MIPROJET");
    setMeta("property", "og:type", "website");
    setMeta("property", "og:image", window.location.origin + "/favicon.png");
    setMeta("name", "twitter:card", "summary_large_image");
    fetchNews();
  }, []);

  useEffect(() => {
    if (id && news.length > 0) {
      const found = news.find(n => n.id === id);
      if (found) {
        setSelectedNews(found);
        // Update OG tags for social sharing
        document.title = `${found.title} | MIPROJET`;
        const setMeta = (attr: string, key: string, content: string) => {
          let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
          if (!el) { el = document.createElement("meta"); el.setAttribute(attr, key); document.head.appendChild(el); }
          el.content = content;
        };
        setMeta("property", "og:title", found.title);
        setMeta("property", "og:description", found.excerpt || found.content.substring(0, 160));
        setMeta("property", "og:image", found.image_url || window.location.origin + "/favicon.png");
        setMeta("property", "og:url", window.location.href);
        setMeta("property", "og:type", "article");
        setMeta("name", "twitter:card", "summary_large_image");
        setMeta("name", "twitter:title", found.title);
        setMeta("name", "twitter:description", found.excerpt || found.content.substring(0, 160));
        setMeta("name", "twitter:image", found.image_url || window.location.origin + "/favicon.png");
        supabase.from('news').update({ views_count: (found.views_count || 0) + 1 }).eq('id', id);
      }
    }
  }, [id, news]);

  const fetchNews = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(25);

    if (!error && data) {
      setNews(data);
    }
    setLoading(false);
  };

  const filteredNews = news.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const openNewsDetail = (item: NewsItem) => {
    setSelectedNews(item);
    navigate(`/news/${item.id}`);
    // Increment view count
    supabase.from('news').update({ views_count: (item.views_count || 0) + 1 }).eq('id', item.id);
  };

  const closeNewsDetail = () => {
    setSelectedNews(null);
    navigate('/news');
  };

  // Render content - convert simple formatting to styled text
  const renderContent = (content: string) => {
    // If content contains HTML tags, render as HTML
    if (content.includes('<p>') || content.includes('<h2>') || content.includes('<strong>')) {
      return (
        <div 
          className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-li:text-muted-foreground"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      );
    }
    
    // Otherwise render as plain paragraphs
    return (
      <div className="space-y-4 text-muted-foreground leading-relaxed">
        {content.split('\n\n').map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      
      <main className="flex-1 pt-20">
        {/* Header */}
        <section className="bg-gradient-to-r from-primary via-primary to-primary/90 py-16 text-primary-foreground relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-secondary/20 rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-secondary/10 rounded-full translate-x-1/4 translate-y-1/4" />
          
          <div className="container mx-auto px-4 text-center relative z-10">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              {t('news.pageTitle')}
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/90 max-w-2xl mx-auto">
              {t('news.pageSubtitle')}
            </p>
          </div>
        </section>

        {/* Filters */}
        <section className="py-8 border-b border-border bg-card">
          <div className="container mx-auto px-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t('news.searchPlaceholder') || "Rechercher..."}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        {/* News Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : filteredNews.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-muted-foreground text-lg">
                  {t('news.noNews') || 'Aucune actualité disponible pour le moment'}
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredNews.map((item, index) => {
                  const imageUrl = item.image_url || defaultImages[index % defaultImages.length];
                  
                  return (
                    <article 
                      key={item.id} 
                      onClick={() => openNewsDetail(item)}
                      className="group relative bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer hover:-translate-y-2 border border-border"
                    >
                      {/* Gradient Accent */}
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10" />
                      
                      {/* Top accent - Blue */}
                      <div className="absolute top-0 left-0 w-2/3 h-1 bg-gradient-to-r from-primary to-primary/50 z-20" />
                      
                      {/* Bottom accent - Green */}
                      <div className="absolute bottom-0 right-0 w-2/3 h-1 bg-gradient-to-l from-secondary to-secondary/50 z-20" />
                      
                      {/* Image */}
                      <div className="aspect-video overflow-hidden relative">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={item.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = defaultImages[index % defaultImages.length];
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-muted flex items-center justify-center">
                            <ImageOff className="h-12 w-12 text-muted-foreground/40" />
                          </div>
                        )}
                        
                        {/* Category & Views overlay */}
                        <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                          <Badge className="bg-primary text-primary-foreground shadow-lg">
                            {categories.find(c => c.value === item.category)?.label || item.category}
                          </Badge>
                          <div className="flex items-center gap-1 text-xs bg-black/50 text-white px-2 py-1 rounded-full">
                            <Eye className="h-3 w-3" />
                            {item.views_count}
                          </div>
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="p-6">
                        <h3 className="font-bold text-xl text-foreground line-clamp-2 mb-3 group-hover:text-primary transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                          {item.excerpt || item.content.substring(0, 150)}...
                        </p>
                        
                        {/* Footer */}
                        <div className="flex items-center justify-between pt-4 border-t border-border">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="h-3.5 w-3.5" />
                            {item.published_at && formatDistanceToNow(new Date(item.published_at), {
                              addSuffix: true,
                              locale: getLocale(),
                            })}
                          </div>
                          <span className="text-primary text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                            {t('common.readMore') || 'Lire'}
                            <ArrowRight className="h-4 w-4" />
                          </span>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>

      {/* News Detail Modal */}
      <Dialog open={!!selectedNews} onOpenChange={(open) => !open && closeNewsDetail()}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
          {selectedNews && (
            <>
              {/* Header Image */}
              <div className="relative aspect-video w-full">
                <img
                  src={selectedNews.image_url || defaultImages[0]}
                  alt={selectedNews.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = defaultImages[0];
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                
                {/* Close button */}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white"
                  onClick={closeNewsDetail}
                >
                  <X className="h-5 w-5" />
                </Button>
                
                {/* Title overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <Badge className="bg-primary text-primary-foreground mb-3">
                    {categories.find(c => c.value === selectedNews.category)?.label || selectedNews.category}
                  </Badge>
                  <h2 className="text-2xl md:text-3xl font-bold text-white">
                    {selectedNews.title}
                  </h2>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-6 md:p-8">
                {/* Meta */}
                <div className="flex flex-wrap items-center gap-4 mb-6 pb-4 border-b border-border text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {selectedNews.published_at && format(new Date(selectedNews.published_at), 'PPP', { locale: getLocale() })}
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    {selectedNews.views_count} vues
                  </div>
                </div>
                
                {/* Article content */}
                {renderContent(selectedNews.content)}
                
                {/* Back button & Share */}
                <div className="mt-8 pt-6 border-t border-border flex items-center justify-between">
                  <Button variant="outline" onClick={closeNewsDetail}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Retour aux actualités
                  </Button>
                  <Button variant="ghost" onClick={() => setShowShare(true)} className="gap-2">
                    <Share2 className="h-4 w-4" /> Partager
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {selectedNews && (
        <SocialSharePopup
          open={showShare}
          onClose={() => setShowShare(false)}
          url={`${window.location.origin}/news/${selectedNews.id}`}
          title={selectedNews.title}
          description={selectedNews.excerpt || selectedNews.content.substring(0, 150)}
          imageUrl={selectedNews.image_url || undefined}
        />
      )}

      <Footer />
    </div>
  );
};

export default News;
