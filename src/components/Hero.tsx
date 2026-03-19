import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, Users, Shield, CheckCircle, Newspaper } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import heroImage from "@/assets/hero-collaboration.jpg";

interface NewsItem {
  id: string;
  title: string;
}

export const Hero = () => {
  const { t } = useLanguage();
  const [latestNews, setLatestNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    const fetchNews = async () => {
      const { data } = await supabase
        .from("news")
        .select("id, title")
        .eq("status", "published")
        .order("published_at", { ascending: false })
        .limit(3);
      if (data) setLatestNews(data);
    };
    fetchNews();
  }, []);

  const highlights = [
    t('hero.highlight1'),
    t('hero.highlight2'),
    t('hero.highlight3'),
    t('hero.highlight4'),
  ];

  return (
    <section className="relative min-h-[85vh] sm:min-h-[90vh] lg:min-h-screen flex items-center pt-16 sm:pt-20 pb-8 sm:pb-12 overflow-hidden bg-primary">
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-4 sm:space-y-6 lg:space-y-8 text-primary-foreground text-left">
            {/* News Ticker */}
            {latestNews.length > 0 && (
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                <div className="flex items-center gap-2 mb-1">
                  <Newspaper className="h-4 w-4 text-accent flex-shrink-0" />
                  <span className="text-xs font-semibold text-accent uppercase">Actualités</span>
                </div>
                <div className="space-y-1">
                  {latestNews.map((n) => (
                    <Link key={n.id} to={`/news/${n.id}`} className="block text-sm text-white/90 hover:text-accent transition-colors truncate">
                      → {n.title}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Title */}
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-white">
                Plateforme Panafricaine
              </h1>
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-accent leading-snug">
                de Structuration et d'Orientation de Projets
              </h2>
            </div>
            
            <p className="text-sm sm:text-base lg:text-lg text-white/90 leading-relaxed max-w-xl">
              {t('hero.description')}
            </p>

            {/* Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 max-w-xl">
              {highlights.map((item, index) => (
                <div key={index} className="flex items-center gap-2 text-white/90">
                  <CheckCircle className="h-5 w-5 text-accent flex-shrink-0" />
                  <span className="text-sm sm:text-base">{item}</span>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 sm:gap-8 py-4 sm:py-6 border-t border-b border-white/20">
              <div className="text-left">
                <div className="flex items-center gap-1 sm:gap-2 mb-1">
                  <TrendingUp className="h-5 w-5 text-accent" />
                  <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">105+</span>
                </div>
                <p className="text-xs sm:text-sm text-white/80">{t('hero.projectsStructured')}</p>
              </div>
              <div className="text-center lg:text-left">
                <div className="flex items-center gap-2 justify-center lg:justify-start mb-1">
                  <Users className="h-5 w-5 text-accent" />
                  <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">65+</span>
                </div>
                <p className="text-xs sm:text-sm text-white/80">{t('hero.activeMembers')}</p>
              </div>
              <div className="text-center lg:text-left">
                <div className="flex items-center gap-2 justify-center lg:justify-start mb-1">
                  <Shield className="h-5 w-5 text-accent" />
                  <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">5</span>
                </div>
                <p className="text-xs sm:text-sm text-white/80">{t('hero.countriesCovered')}</p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
              <Link to="/submit-project" className="w-full sm:w-auto">
                <Button size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
                  {t('hero.submitProject')}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/projects" className="w-full sm:w-auto">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="w-full bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/50"
                >
                  {t('hero.discoverProjects')}
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative hidden lg:flex justify-center">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={heroImage}
                alt="Entrepreneurs africains collaborant sur MIPROJET"
                className="w-full h-auto object-cover"
                loading="eager"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl animate-fade-in">
              <p className="text-sm text-muted-foreground">{t('hero.qualityLabel')}</p>
              <p className="text-2xl font-bold text-primary">Score A</p>
            </div>
            <div className="absolute -top-6 -right-6 bg-white p-4 rounded-xl shadow-xl animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <p className="text-sm text-muted-foreground">{t('hero.projectsAccompanied')}</p>
              <p className="text-2xl font-bold text-secondary">1,2 Mds FCFA</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
