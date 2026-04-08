import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import miprojetPlusLogo from "@/assets/miprojet-plus-logo.jpg";
import {
  BarChart3, FileText, TrendingUp, Users, Award, Settings,
  LogOut, Plus, ChevronRight, Home, Bell, Loader2, Menu, X
} from "lucide-react";

interface Profile {
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  company_name: string | null;
}

interface ProjectWithScore {
  id: string;
  title: string;
  sector: string | null;
  status: string | null;
  score?: number | null;
  niveau?: string | null;
}

const MiProjetPlusApp = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [projects, setProjects] = useState<ProjectWithScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/miprojet-plus");
    }
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      const [profileRes, projectsRes] = await Promise.all([
        supabase.from("profiles").select("first_name, last_name, email, company_name").eq("id", user.id).single(),
        supabase.from("projects").select("id, title, sector, status").eq("owner_id", user.id).order("created_at", { ascending: false }),
      ]);

      if (profileRes.data) setProfile(profileRes.data);

      if (projectsRes.data) {
        // Fetch scores for each project
        const projectsWithScores = await Promise.all(
          projectsRes.data.map(async (p) => {
            const { data: eval_ } = await supabase
              .from("project_evaluations")
              .select("score_global, niveau")
              .eq("project_id", p.id)
              .eq("is_active", true)
              .order("created_at", { ascending: false })
              .limit(1)
              .maybeSingle();
            return { ...p, score: eval_?.score_global, niveau: eval_?.niveau };
          })
        );
        setProjects(projectsWithScores);
      }

      setLoading(false);
    };

    fetchData();
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/miprojet-plus");
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <img src={miprojetPlusLogo} alt="MiProjet+" className="h-16 w-16 rounded-2xl mx-auto mb-4 animate-pulse" />
          <Loader2 className="h-6 w-6 animate-spin mx-auto text-emerald-600" />
        </div>
      </div>
    );
  }

  if (!user) return null;

  const getScoreColor = (score: number | null | undefined) => {
    if (!score) return "text-muted-foreground";
    if (score >= 80) return "text-emerald-600";
    if (score >= 60) return "text-blue-600";
    if (score >= 40) return "text-amber-600";
    return "text-rose-600";
  };

  const getScoreBadge = (niveau: string | null | undefined) => {
    if (!niveau) return null;
    const map: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      financable: { label: "Finançable", variant: "default" },
      prometteur: { label: "Prometteur", variant: "secondary" },
      fragile: { label: "Fragile", variant: "outline" },
      non_financable: { label: "Non finançable", variant: "destructive" },
    };
    const info = map[niveau] || { label: niveau, variant: "outline" as const };
    return <Badge variant={info.variant}>{info.label}</Badge>;
  };

  const navItems = [
    { id: "dashboard", icon: Home, label: "Tableau de bord" },
    { id: "projects", icon: FileText, label: "Mes projets" },
    { id: "scoring", icon: BarChart3, label: "MIPROJET Score" },
    { id: "finances", icon: TrendingUp, label: "Suivi financier" },
    { id: "certification", icon: Award, label: "Certification" },
    { id: "network", icon: Users, label: "Réseau financeurs" },
  ];

  const renderDashboard = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Bonjour, {profile?.first_name || "Promoteur"} 👋
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Bienvenue sur MiProjet+ – Votre espace de structuration
        </p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Projets", value: projects.length, icon: FileText, color: "bg-emerald-50 text-emerald-700" },
          { label: "Score moyen", value: projects.filter(p => p.score).length > 0 ? Math.round(projects.filter(p => p.score).reduce((a, p) => a + (p.score || 0), 0) / projects.filter(p => p.score).length) : "—", icon: BarChart3, color: "bg-blue-50 text-blue-700" },
          { label: "Certifiés", value: projects.filter(p => p.niveau === "financable").length, icon: Award, color: "bg-amber-50 text-amber-700" },
          { label: "En cours", value: projects.filter(p => p.status === "active" || p.status === "pending").length, icon: TrendingUp, color: "bg-purple-50 text-purple-700" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label} className="border-0 shadow-sm">
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`p-2 rounded-xl ${s.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Projects list */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg">Mes projets / activités</CardTitle>
          <Link to="/submit-project">
            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="h-4 w-4 mr-1" /> Nouveau
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {projects.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">Aucun projet encore</p>
              <Link to="/submit-project">
                <Button className="mt-4 bg-emerald-600 hover:bg-emerald-700">
                  Soumettre un projet
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {projects.map((p) => (
                <div key={p.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm truncate">{p.title}</p>
                    <p className="text-xs text-muted-foreground">{p.sector || "Secteur non défini"}</p>
                  </div>
                  <div className="flex items-center gap-3 ml-3 shrink-0">
                    {p.score ? (
                      <span className={`text-lg font-bold ${getScoreColor(p.score)}`}>{p.score}/100</span>
                    ) : (
                      <span className="text-xs text-muted-foreground">Non évalué</span>
                    )}
                    {getScoreBadge(p.niveau)}
                    <Link to={`/project-evaluation/${p.id}`}>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Methodology steps */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Méthodologie MIPROJET+</CardTitle>
          <CardDescription>Suivez les étapes pour rendre votre activité finançable</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { step: 1, title: "Diagnostic", desc: "Identification et analyse", done: projects.length > 0 },
              { step: 2, title: "Organisation", desc: "Outils et processus", done: false },
              { step: 3, title: "Structuration", desc: "Suivi financier", done: false },
              { step: 4, title: "Stabilisation", desc: "Performance", done: false },
              { step: 5, title: "Crédibilité", desc: "Image professionnelle", done: false },
              { step: 6, title: "Financement", desc: "Mise en relation", done: false },
            ].map((s) => (
              <div key={s.step} className={`p-3 rounded-xl border ${s.done ? "border-emerald-200 bg-emerald-50" : "border-gray-200"}`}>
                <div className="flex items-center gap-2 mb-1">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${s.done ? "bg-emerald-600 text-white" : "bg-gray-200 text-gray-500"}`}>
                    {s.step}
                  </div>
                  <span className="font-medium text-sm">{s.title}</span>
                </div>
                <p className="text-xs text-muted-foreground ml-8">{s.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderComingSoon = (title: string) => (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <BarChart3 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        <p className="text-muted-foreground mt-2">Cette fonctionnalité sera bientôt disponible</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-3">
            <button className="lg:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <img src={miprojetPlusLogo} alt="MiProjet+" className="h-8 w-8 rounded-lg" />
            <span className="font-bold text-emerald-800 hidden sm:inline">MiProjet+</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-muted-foreground">
              <LogOut className="h-4 w-4 mr-1" /> <span className="hidden sm:inline">Déconnexion</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar - desktop */}
        <aside className={`
          ${mobileMenuOpen ? "block" : "hidden"} lg:block
          fixed lg:sticky top-14 left-0 z-40
          w-60 h-[calc(100vh-3.5rem)] bg-white border-r border-gray-200
          overflow-y-auto
        `}>
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                    activeTab === item.id
                      ? "bg-emerald-50 text-emerald-700 font-medium"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="p-3 mt-4 border-t border-gray-100">
            <a href="/" className="flex items-center gap-2 text-xs text-muted-foreground hover:text-emerald-600 px-3 py-2">
              ← Retour à MIPROJET
            </a>
          </div>
        </aside>

        {/* Overlay for mobile sidebar */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 bg-black/20 z-30 lg:hidden" onClick={() => setMobileMenuOpen(false)} />
        )}

        {/* Main content */}
        <main className="flex-1 p-4 lg:p-6 min-w-0">
          <div className="max-w-5xl mx-auto">
            {activeTab === "dashboard" && renderDashboard()}
            {activeTab === "projects" && renderDashboard()}
            {activeTab === "scoring" && renderComingSoon("MIPROJET Score")}
            {activeTab === "finances" && renderComingSoon("Suivi Financier")}
            {activeTab === "certification" && renderComingSoon("Certification")}
            {activeTab === "network" && renderComingSoon("Réseau Financeurs")}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MiProjetPlusApp;
