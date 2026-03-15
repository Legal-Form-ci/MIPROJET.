import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { supabase } from "@/integrations/supabase/client";
import { LeadCaptureForm } from "@/components/LeadCaptureForm";
import { 
  ArrowLeft, Calendar, MapPin, Banknote, Mail, Phone,
  ExternalLink, Loader2, Crown, Lock, Users, Clock, Share2
} from "lucide-react";
import { SocialSharePopup } from "@/components/SocialSharePopup";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface Opportunity {
  id: string;
  title: string;
  description: string | null;
  content: string;
  opportunity_type: string;
  category: string;
  image_url: string | null;
  deadline: string | null;
  location: string | null;
  eligibility: string | null;
  amount_min: number | null;
  amount_max: number | null;
  currency: string;
  external_link: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  is_featured: boolean;
  is_premium: boolean;
  views_count: number;
  published_at: string | null;
}

const OpportunityDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { hasActiveSubscription, loading: subLoading } = useSubscription();
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const [showShare, setShowShare] = useState(false);

  useEffect(() => {
    if (opportunity) {
      document.title = `${opportunity.title} | MIPROJET`;
      const setMeta = (attr: string, key: string, content: string) => {
        let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
        if (!el) { el = document.createElement("meta"); el.setAttribute(attr, key); document.head.appendChild(el); }
        el.content = content;
      };
      const desc = opportunity.description || opportunity.content?.substring(0, 160) || "";
      const img = opportunity.image_url || window.location.origin + "/favicon.png";
      setMeta("property", "og:title", opportunity.title);
      setMeta("property", "og:description", desc);
      setMeta("property", "og:image", img);
      setMeta("property", "og:url", window.location.href);
      setMeta("property", "og:type", "article");
      setMeta("name", "twitter:card", "summary_large_image");
      setMeta("name", "twitter:title", opportunity.title);
      setMeta("name", "twitter:description", desc);
      setMeta("name", "twitter:image", img);
    }
  }, [opportunity]);

  useEffect(() => {
    if (id) fetchOpportunity();
  }, [id]);

  const fetchOpportunity = async () => {
    if (!id) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('opportunities')
      .select('*')
      .eq('id', id)
      .eq('status', 'published')
      .single();

    if (!error && data) {
      setOpportunity(data as any);
      // Increment view count
      await supabase.from('opportunities').update({ views_count: ((data as any).views_count || 0) + 1 }).eq('id', id);
    }
    setLoading(false);
  };

  // Determine access level
  const isPremium = opportunity?.is_premium;
  const canSeeStrategicInfo = isPremium
    ? (user && hasActiveSubscription)
    : hasAccess; // Free opps need lead capture for strategic info

  if (loading || authLoading || subLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  // Premium opp without subscription
  if (isPremium && (!user || !hasActiveSubscription)) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 pt-24 pb-16 text-center">
          <div className="max-w-md mx-auto">
            <div className="p-4 bg-amber-500/10 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <Crown className="h-10 w-10 text-amber-500" />
            </div>
            <h1 className="text-2xl font-bold mb-4">Opportunité Premium</h1>
            <p className="text-muted-foreground mb-6">
              Cette opportunité est réservée aux abonnés MIPROJET. Abonnez-vous pour accéder au contenu complet.
            </p>
            <div className="space-y-3">
              {!user && (
                <Button onClick={() => navigate('/auth?redirect=/opportunities/' + id)} variant="outline" className="w-full">
                  Se connecter
                </Button>
              )}
              <Button onClick={() => navigate('/subscription')} className="w-full">
                <Crown className="h-4 w-4 mr-2" /> S'abonner
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!opportunity) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 pt-24 pb-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Opportunité non trouvée</h1>
          <Button onClick={() => navigate('/opportunities')}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Retour
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={() => navigate('/opportunities')}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Retour aux opportunités
          </Button>
          <Button variant="ghost" onClick={() => setShowShare(true)} className="gap-2">
            <Share2 className="h-4 w-4" /> Partager
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {opportunity.image_url && (
              <div className="relative h-64 md:h-80 overflow-hidden rounded-lg">
                <img src={opportunity.image_url} alt={opportunity.title} className="w-full h-full object-cover" />
                <div className="absolute top-4 right-4 flex gap-2">
                  {opportunity.is_featured && <Badge className="bg-primary"><Crown className="h-3 w-3 mr-1" />À la une</Badge>}
                  {isPremium ? (
                    <Badge className="bg-amber-500 text-white">Premium</Badge>
                  ) : (
                    <Badge className="bg-success text-white">Gratuit</Badge>
                  )}
                </div>
              </div>
            )}

            <div>
              <Badge variant="outline" className="mb-3">{opportunity.opportunity_type}</Badge>
              <h1 className="text-3xl font-bold mb-4">{opportunity.title}</h1>
              {opportunity.description && (
                <p className="text-lg text-muted-foreground mb-6">{opportunity.description}</p>
              )}
            </div>

            <Card>
              <CardContent className="p-6 prose prose-neutral dark:prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: opportunity.content.replace(/\n/g, '<br/>') }} />
              </CardContent>
            </Card>

            {opportunity.eligibility && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Users className="h-5 w-5" /> Critères d'éligibilité
                  </h3>
                  <p className="text-muted-foreground whitespace-pre-line">{opportunity.eligibility}</p>
                </CardContent>
              </Card>
            )}

            {/* Strategic Info - Gated */}
            {!canSeeStrategicInfo && !isPremium && (
              <Card className="border-dashed border-2 border-primary/30 bg-primary/5">
                <CardContent className="p-8 text-center">
                  <Lock className="h-10 w-10 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Informations stratégiques</h3>
                  <p className="text-muted-foreground mb-6">
                    Pour accéder au lien de candidature et aux informations stratégiques de l'émetteur,
                    veuillez remplir le formulaire ci-dessous.
                  </p>
                  <Button onClick={() => setShowLeadForm(true)} size="lg">
                    Voir les informations pour postuler
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="font-semibold">Informations clés</h3>
                
                {opportunity.deadline && (
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Date limite</p>
                      <p className="font-medium">{format(new Date(opportunity.deadline), 'dd MMMM yyyy', { locale: fr })}</p>
                    </div>
                  </div>
                )}

                {opportunity.location && (
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Localisation</p>
                      <p className="font-medium">{opportunity.location}</p>
                    </div>
                  </div>
                )}

                {(opportunity.amount_min || opportunity.amount_max) && (
                  <div className="flex items-center gap-3">
                    <Banknote className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Montant</p>
                      <p className="font-medium">
                        {opportunity.amount_min && opportunity.amount_max 
                          ? `${opportunity.amount_min.toLocaleString()} - ${opportunity.amount_max.toLocaleString()} ${opportunity.currency}`
                          : opportunity.amount_max 
                            ? `Jusqu'à ${opportunity.amount_max.toLocaleString()} ${opportunity.currency}`
                            : `À partir de ${opportunity.amount_min?.toLocaleString()} ${opportunity.currency}`
                        }
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Vues</p>
                    <p className="font-medium">{opportunity.views_count} consultations</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact & Strategic - only if access granted */}
            {canSeeStrategicInfo && (opportunity.contact_email || opportunity.contact_phone || opportunity.external_link) && (
              <Card>
                <CardContent className="p-6 space-y-4">
                  <h3 className="font-semibold">Contact & Candidature</h3>
                  
                  {opportunity.contact_email && (
                    <a href={`mailto:${opportunity.contact_email}`} className="flex items-center gap-3 text-primary hover:underline">
                      <Mail className="h-5 w-5" /> {opportunity.contact_email}
                    </a>
                  )}

                  {opportunity.contact_phone && (
                    <a href={`tel:${opportunity.contact_phone}`} className="flex items-center gap-3 text-primary hover:underline">
                      <Phone className="h-5 w-5" /> {opportunity.contact_phone}
                    </a>
                  )}

                  {opportunity.external_link && (
                    <Button asChild className="w-full">
                      <a href={opportunity.external_link} target="_blank" rel="noopener noreferrer">
                        Postuler / En savoir plus
                        <ExternalLink className="h-4 w-4 ml-2" />
                      </a>
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
      <Footer />

      <LeadCaptureForm
        open={showLeadForm}
        onClose={() => setShowLeadForm(false)}
        onSuccess={() => { setShowLeadForm(false); setHasAccess(true); }}
        leadSource="opportunity"
        sourceId={opportunity?.id}
        title="Accéder aux informations de candidature"
        description="Renseignez vos coordonnées pour voir le lien de candidature et les informations stratégiques"
      />

      {opportunity && (
        <SocialSharePopup
          open={showShare}
          onClose={() => setShowShare(false)}
          url={`${window.location.origin}/opportunities/${opportunity.id}`}
          title={opportunity.title}
          description={opportunity.description || opportunity.content.substring(0, 150)}
          imageUrl={opportunity.image_url || undefined}
        />
      )}
    </div>
  );
};

export default OpportunityDetail;
