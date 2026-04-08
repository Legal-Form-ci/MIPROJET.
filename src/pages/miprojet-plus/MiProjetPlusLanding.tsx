import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import miprojetPlusLogo from "@/assets/miprojet-plus-logo.jpg";
import {
  BarChart3, Shield, TrendingUp, Users, FileCheck, Smartphone,
  ArrowRight, CheckCircle, Eye, EyeOff, Loader2
} from "lucide-react";

const features = [
  { icon: BarChart3, title: "MIPROJET SCORE", desc: "Évaluation sur 100 points de votre activité ou projet" },
  { icon: TrendingUp, title: "Suivi financier", desc: "Recettes, dépenses, bénéfices en temps réel" },
  { icon: FileCheck, title: "Certification", desc: "Rapports certifiés reconnus par les financeurs" },
  { icon: Users, title: "Mise en relation", desc: "Connexion avec banques, microfinances et investisseurs" },
  { icon: Shield, title: "Structuration", desc: "Transformation de votre activité en entreprise solvable" },
  { icon: Smartphone, title: "Mode offline", desc: "Utilisez l'app sans connexion internet" },
];

const steps = [
  { num: "01", title: "Inscription", desc: "Créez votre profil promoteur" },
  { num: "02", title: "Collecte", desc: "Saisissez vos données d'activité ou projet" },
  { num: "03", title: "Diagnostic", desc: "Obtenez votre MIPROJET SCORE sur 100" },
  { num: "04", title: "Structuration", desc: "Améliorez votre dossier avec notre accompagnement" },
  { num: "05", title: "Financement", desc: "Accédez aux financeurs partenaires" },
];

const MiProjetPlusLanding = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // If user is already logged in, redirect to app
  if (user) {
    navigate("/miprojet-plus/app");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate("/miprojet-plus/app");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { first_name: firstName },
            emailRedirectTo: window.location.origin + "/miprojet-plus/app",
          },
        });
        if (error) throw error;
        toast({
          title: "Inscription réussie",
          description: "Vérifiez votre email pour confirmer votre compte.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-950 text-white">
      {/* Header */}
      <header className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={miprojetPlusLogo} alt="MiProjet+" className="h-10 w-10 rounded-xl" />
          <span className="text-xl font-bold">MiProjet+</span>
        </div>
        <a href="/" className="text-emerald-300 hover:text-white text-sm transition-colors">
          ← Retour à MIPROJET
        </a>
      </header>

      {/* Hero + Login */}
      <section className="container mx-auto px-4 py-8 lg:py-16">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start">
          {/* Left: Value proposition */}
          <div className="space-y-6">
            <div>
              <span className="inline-block px-3 py-1 bg-emerald-700/50 rounded-full text-emerald-200 text-xs font-medium mb-4">
                Application de structuration
              </span>
              <h1 className="text-3xl lg:text-5xl font-bold leading-tight">
                Transformez votre activité en{" "}
                <span className="text-emerald-300">entreprise finançable</span>
              </h1>
              <p className="text-emerald-200 mt-4 text-base lg:text-lg leading-relaxed max-w-xl">
                MiProjet+ structure vos micro-activités, PME et startups pour les rendre
                solvables et éligibles au financement. Score de maturité, suivi financier,
                certification et mise en relation avec les financeurs.
              </p>
            </div>

            {/* Mini stats */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { value: "100", label: "Score sur 100" },
                { value: "5", label: "Axes d'évaluation" },
                { value: "6", label: "Étapes clés" },
              ].map((s) => (
                <div key={s.label} className="text-center p-3 bg-white/5 rounded-xl backdrop-blur-sm">
                  <div className="text-2xl font-bold text-emerald-300">{s.value}</div>
                  <div className="text-xs text-emerald-400">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Steps */}
            <div className="space-y-3 hidden lg:block">
              {steps.map((step) => (
                <div key={step.num} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-600/50 flex items-center justify-center text-xs font-bold shrink-0">
                    {step.num}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{step.title}</p>
                    <p className="text-emerald-300 text-xs">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Login/Register form */}
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
            <CardContent className="p-6 lg:p-8">
              <div className="text-center mb-6">
                <img src={miprojetPlusLogo} alt="MiProjet+" className="h-16 w-16 rounded-2xl mx-auto mb-3" />
                <h2 className="text-xl font-bold text-white">
                  {isLogin ? "Connexion à MiProjet+" : "Créer un compte MiProjet+"}
                </h2>
                <p className="text-emerald-300 text-sm mt-1">
                  {isLogin ? "Accédez à votre espace de structuration" : "Commencez à structurer votre activité"}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div className="space-y-1.5">
                    <Label className="text-emerald-100 text-sm">Prénom</Label>
                    <Input
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Votre prénom"
                      className="bg-white/10 border-white/20 text-white placeholder:text-emerald-400/50 focus:border-emerald-400"
                      required
                    />
                  </div>
                )}

                <div className="space-y-1.5">
                  <Label className="text-emerald-100 text-sm">Email</Label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre@email.com"
                    className="bg-white/10 border-white/20 text-white placeholder:text-emerald-400/50 focus:border-emerald-400"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-emerald-100 text-sm">Mot de passe</Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="bg-white/10 border-white/20 text-white placeholder:text-emerald-400/50 focus:border-emerald-400 pr-10"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-300"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-semibold h-11"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      {isLogin ? "Se connecter" : "Créer mon compte"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-4 text-center">
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-emerald-300 hover:text-white text-sm transition-colors"
                >
                  {isLogin ? "Pas encore de compte ? Inscrivez-vous" : "Déjà un compte ? Connectez-vous"}
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features grid */}
      <section className="container mx-auto px-4 py-12 lg:py-16">
        <h2 className="text-2xl font-bold text-center mb-8">
          Tout ce dont vous avez besoin pour <span className="text-emerald-300">réussir</span>
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="p-4 bg-white/5 rounded-xl backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
                <Icon className="h-8 w-8 text-emerald-400 mb-3" />
                <h3 className="font-semibold text-sm mb-1">{f.title}</h3>
                <p className="text-emerald-300 text-xs leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Score explanation */}
      <section className="container mx-auto px-4 py-12 lg:py-16">
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 lg:p-10 border border-white/10">
          <h2 className="text-2xl font-bold mb-6">MIPROJET SCORE – Évaluation sur 100</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { axis: "Juridique & Gouvernance", pts: 15, color: "bg-blue-500" },
              { axis: "Financier", pts: 25, color: "bg-emerald-500" },
              { axis: "Technique & Opérationnel", pts: 20, color: "bg-amber-500" },
              { axis: "Marché & Modèle", pts: 20, color: "bg-purple-500" },
              { axis: "Impact & Durabilité", pts: 20, color: "bg-rose-500" },
            ].map((a) => (
              <div key={a.axis} className="text-center p-4 bg-white/5 rounded-xl">
                <div className={`w-12 h-12 rounded-full ${a.color} mx-auto mb-2 flex items-center justify-center text-lg font-bold`}>
                  {a.pts}
                </div>
                <p className="text-xs font-medium text-emerald-200">{a.axis}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
            {[
              { range: "80-100", label: "Finançable", color: "text-emerald-400" },
              { range: "60-79", label: "Prometteur", color: "text-blue-400" },
              { range: "40-59", label: "Fragile", color: "text-amber-400" },
              { range: "< 40", label: "Non finançable", color: "text-rose-400" },
            ].map((l) => (
              <div key={l.range} className="flex items-center gap-2 text-sm">
                <CheckCircle className={`h-4 w-4 ${l.color}`} />
                <span className={l.color}>{l.range} : {l.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t border-white/10 text-center">
        <p className="text-emerald-400 text-sm">
          © {new Date().getFullYear()} MiProjet+ par MIPROJET – Plateforme de structuration et d'inclusion financière
        </p>
      </footer>
    </div>
  );
};

export default MiProjetPlusLanding;
