import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Eye, Search, ArrowRight, Clock, ArrowLeft, ImageOff, Share2 } from "lucide-react";
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
    { value: "expansion", label: "Expansion" },
    { value: "financement", label: "Financement" },
    { value: "formation", label: "Formation" },
  ];

  const defaultImages = [
    "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&h=500&fit=crop",
    "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=500&fit=crop",
    "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=500&fit=crop"
  ];

  useEffect(() => {
    document.title = `${t('news.pageTitle')} | MIPROJET`;
    fetchNews();
  }, []);

  useEffect(() => {
    if (id && news.length > 0) {
      const found = news.find(n => n.id === id);
      if (found) {
        setSelectedNews(found);
        document.title = `${found.title} | MIPROJET`;
        supabase.from('news').update({ views_count: (found.views_count || 0) + 1 }).eq('id', id);
      }
    } else if (!id) {
      setSelectedNews(null);
    }
  }, [id, news]);

  const fetchNews = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(50);

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

  const renderContent = (content: string) => {
    if (content.includes('<p>') || content.includes('<h2>') || content.includes('<strong>')) {
      return (
        <div 
          className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-li:text-muted-foreground"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      );
    }
    return (
      <div className="space-y-4 text-muted-foreground leading-relaxed">
        {content.split('\n\n').map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>
    );
  };

  // ARTICLE DETAIL PAGE (inline, no popup)
  if (selectedNews) {
    const imageUrl = selectedNews.image_url || defaultImages[0];
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navigation />
        <main className="flex-1 pt-20">
          {/* Hero Image */}
          <div className="relative w-full h-[40vh] md:h-[50vh] overflow-hidden">
            <img
              src={imageUrl}
              alt={selectedNews.title}
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).src = defaultImages[0]; }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 container mx-auto">
              <Badge className="bg-primary text-primary-foreground mb-3">
                {categories.find(c => c.value === selectedNews.category)?.label || selectedNews.category}
              </Badge>
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white leading-tight max-w-4xl">
                {selectedNews.title}
              </h1>
            </div>
          </div>

          {/* Article Content */}
          <div className="container mx-auto px-4 py-8 md:py-12">
            <div className="max-w-3xl mx-auto">
              {/* Meta */}
              <div className="flex flex-wrap items-center gap-4 mb-8 pb-4 border-b border-border text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {selectedNews.published_at && format(new Date(selectedNews.published_at), 'PPP', { locale: getLocale() })}
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  {selectedNews.views_count} vues
                </div>
              </div>

              {/* Excerpt */}
              {selectedNews.excerpt && (
                <p className="text-lg md:text-xl text-muted-foreground italic mb-8 leading-relaxed border-l-4 border-primary pl-4">
                  {selectedNews.excerpt}
                </p>
              )}

              {/* Content */}
              {renderContent(selectedNews.content)}

              {/* Actions */}
              <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <Button variant="outline" onClick={() => navigate('/news')}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour aux actualités
                </Button>
                <Button variant="ghost" onClick={() => setShowShare(true)} className="gap-2">
                  <Share2 className="h-4 w-4" /> Partager
                </Button>
              </div>
            </div>
          </div>
        </main>

        <SocialSharePopup
          open={showShare}
          onClose={() => setShowShare(false)}
          url={`${window.location.origin}/news/${selectedNews.id}`}
          title={selectedNews.title}
          description={selectedNews.excerpt || selectedNews.content.substring(0, 150)}
          imageUrl={selectedNews.image_url || undefined}
          shareType="news"
          shareId={selectedNews.id}
          cta="Lire l'article complet sur MIPROJET"
        />

        <Footer />
      </div>
    );
  }

  // NEWS LIST PAGE
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      
      <main className="flex-1 pt-20">
        {/* Header */}
        <section className="bg-gradient-to-r from-primary via-primary to-primary/90 py-12 md:py-16 text-primary-foreground relative overflow-hidden">
          <div className="absolute top-0 left-0 w-32 h-32 bg-secondary/20 rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-secondary/10 rounded-full translate-x-1/4 translate-y-1/4" />
          
          <div className="container mx-auto px-4 text-left relative z-10">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3">
              Actualités & Blog
            </h1>
            <p className="text-base md:text-lg text-primary-foreground/90 max-w-2xl">
              {t('news.pageSubtitle')}
            </p>
          </div>
        </section>

        {/* Filters */}
        <section className="py-6 border-b border-border bg-card">
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
        <section className="py-10 md:py-12">
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
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {filteredNews.map((item, index) => {
                  const imageUrl = item.image_url || defaultImages[index % defaultImages.length];
                  
                  return (
                    <article 
                      key={item.id} 
                      onClick={() => navigate(`/news/${item.id}`)}
                      className="group relative bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer hover:-translate-y-2 border border-border"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10" />
                      <div className="absolute top-0 left-0 w-2/3 h-1 bg-gradient-to-r from-primary to-primary/50 z-20" />
                      <div className="absolute bottom-0 right-0 w-2/3 h-1 bg-gradient-to-l from-secondary to-secondary/50 z-20" />
                      
                      <div className="aspect-video overflow-hidden relative">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={item.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            onError={(e) => { (e.target as HTMLImageElement).src = defaultImages[index % defaultImages.length]; }}
                          />
                        ) : (
                          <div className="w-full h-full bg-muted flex items-center justify-center">
                            <ImageOff className="h-12 w-12 text-muted-foreground/40" />
                          </div>
                        )}
                        <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
                          <Badge className="bg-primary text-primary-foreground shadow-lg text-xs">
                            {categories.find(c => c.value === item.category)?.label || item.category}
                          </Badge>
                          <div className="flex items-center gap-1 text-xs bg-black/50 text-white px-2 py-1 rounded-full">
                            <Eye className="h-3 w-3" />
                            {item.views_count}
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-5">
                        <h3 className="font-bold text-lg text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors text-left">
                          {item.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-3 mb-4 text-left">
                          {item.excerpt || item.content.substring(0, 150)}...
                        </p>
                        
                        <div className="flex items-center justify-between pt-3 border-t border-border">
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

      <Footer />
    </div>
  );
};

export default News;
