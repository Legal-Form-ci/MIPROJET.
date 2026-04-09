import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, CheckCircle, BarChart3, Loader2 } from "lucide-react";

interface Question {
  id: string;
  axis: string;
  question: string;
  options: { label: string; value: number }[];
  maxPoints: number;
}

const AXES = [
  { key: "juridique", label: "Juridique & Gouvernance", max: 15, color: "bg-blue-500" },
  { key: "financier", label: "Financier", max: 25, color: "bg-emerald-500" },
  { key: "technique", label: "Technique & Opérationnel", max: 20, color: "bg-amber-500" },
  { key: "marche", label: "Marché & Modèle", max: 20, color: "bg-purple-500" },
  { key: "impact", label: "Impact & Durabilité", max: 20, color: "bg-rose-500" },
];

const QUESTIONS: Question[] = [
  // Juridique (15 pts)
  { id: "j1", axis: "juridique", question: "Votre activité est-elle formellement enregistrée ?", options: [{ label: "Non", value: 0 }, { label: "En cours", value: 2 }, { label: "Oui, enregistrée", value: 5 }], maxPoints: 5 },
  { id: "j2", axis: "juridique", question: "Disposez-vous de statuts ou d'un règlement intérieur ?", options: [{ label: "Non", value: 0 }, { label: "En cours de rédaction", value: 2 }, { label: "Oui, formalisés", value: 5 }], maxPoints: 5 },
  { id: "j3", axis: "juridique", question: "Avez-vous une gouvernance claire (organigramme, rôles) ?", options: [{ label: "Non", value: 0 }, { label: "Partiellement", value: 2 }, { label: "Oui", value: 5 }], maxPoints: 5 },
  // Financier (25 pts)
  { id: "f1", axis: "financier", question: "Tenez-vous une comptabilité régulière ?", options: [{ label: "Non", value: 0 }, { label: "Informelle", value: 3 }, { label: "Oui, formalisée", value: 7 }], maxPoints: 7 },
  { id: "f2", axis: "financier", question: "Avez-vous un compte bancaire dédié à l'activité ?", options: [{ label: "Non", value: 0 }, { label: "Mobile money uniquement", value: 3 }, { label: "Oui, compte bancaire", value: 6 }], maxPoints: 6 },
  { id: "f3", axis: "financier", question: "Pouvez-vous justifier vos revenus des 6 derniers mois ?", options: [{ label: "Non", value: 0 }, { label: "Partiellement", value: 3 }, { label: "Oui, documents à l'appui", value: 6 }], maxPoints: 6 },
  { id: "f4", axis: "financier", question: "Avez-vous un plan financier ou budget prévisionnel ?", options: [{ label: "Non", value: 0 }, { label: "Ébauche", value: 3 }, { label: "Oui, détaillé", value: 6 }], maxPoints: 6 },
  // Technique (20 pts)
  { id: "t1", axis: "technique", question: "Avez-vous un lieu d'exploitation fixe ?", options: [{ label: "Non", value: 0 }, { label: "Temporaire", value: 3 }, { label: "Oui, fixe", value: 5 }], maxPoints: 5 },
  { id: "t2", axis: "technique", question: "Disposez-vous d'équipements adaptés ?", options: [{ label: "Non", value: 0 }, { label: "Insuffisants", value: 3 }, { label: "Oui, adaptés", value: 5 }], maxPoints: 5 },
  { id: "t3", axis: "technique", question: "Avez-vous du personnel qualifié ?", options: [{ label: "Seul", value: 0 }, { label: "Quelques aides", value: 3 }, { label: "Équipe qualifiée", value: 5 }], maxPoints: 5 },
  { id: "t4", axis: "technique", question: "Avez-vous des processus de production documentés ?", options: [{ label: "Non", value: 0 }, { label: "Partiellement", value: 2 }, { label: "Oui", value: 5 }], maxPoints: 5 },
  // Marché (20 pts)
  { id: "m1", axis: "marche", question: "Connaissez-vous votre marché cible ?", options: [{ label: "Non", value: 0 }, { label: "Vaguement", value: 3 }, { label: "Oui, étude réalisée", value: 7 }], maxPoints: 7 },
  { id: "m2", axis: "marche", question: "Avez-vous une clientèle régulière ?", options: [{ label: "Non", value: 0 }, { label: "Quelques clients", value: 3 }, { label: "Oui, fidélisée", value: 7 }], maxPoints: 7 },
  { id: "m3", axis: "marche", question: "Votre modèle économique est-il rentable ?", options: [{ label: "Déficitaire", value: 0 }, { label: "Équilibre", value: 3 }, { label: "Rentable", value: 6 }], maxPoints: 6 },
  // Impact (20 pts)
  { id: "i1", axis: "impact", question: "Votre activité crée-t-elle des emplois ?", options: [{ label: "Non", value: 0 }, { label: "1-2 emplois", value: 3 }, { label: "3+ emplois", value: 7 }], maxPoints: 7 },
  { id: "i2", axis: "impact", question: "Avez-vous un impact social ou environnemental positif ?", options: [{ label: "Non", value: 0 }, { label: "Indirect", value: 3 }, { label: "Oui, mesurable", value: 7 }], maxPoints: 7 },
  { id: "i3", axis: "impact", question: "Votre activité est-elle durable à long terme ?", options: [{ label: "Incertain", value: 0 }, { label: "Probable", value: 3 }, { label: "Oui, plan de durabilité", value: 6 }], maxPoints: 6 },
];

interface MPScoringProps {
  onBack?: () => void;
}

const MPScoring = ({ onBack }: MPScoringProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentAxisIdx, setCurrentAxisIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [projects, setProjects] = useState<{ id: string; title: string }[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [saving, setSaving] = useState(false);
  const [existingResults, setExistingResults] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    const fetchProjects = async () => {
      const { data } = await supabase.from("mp_projects").select("id, title").eq("user_id", user.id);
      if (data) setProjects(data);
    };
    const fetchResults = async () => {
      const { data } = await supabase.from("mp_scoring_results").select("*").eq("user_id", user.id).eq("is_active", true).order("created_at", { ascending: false });
      if (data) setExistingResults(data);
    };
    fetchProjects();
    fetchResults();
  }, [user]);

  const currentAxis = AXES[currentAxisIdx];
  const axisQuestions = QUESTIONS.filter((q) => q.axis === currentAxis.key);
  const allAnswered = axisQuestions.every((q) => answers[q.id] !== undefined);
  const totalQuestions = QUESTIONS.length;
  const answeredCount = Object.keys(answers).length;

  const calculateScores = () => {
    const scores: Record<string, number> = {};
    AXES.forEach((axis) => {
      const qs = QUESTIONS.filter((q) => q.axis === axis.key);
      scores[axis.key] = qs.reduce((sum, q) => sum + (answers[q.id] || 0), 0);
    });
    scores.global = Object.values(scores).reduce((a, b) => a + b, 0);
    return scores;
  };

  const getNiveau = (score: number) => {
    if (score >= 80) return "financable";
    if (score >= 60) return "prometteur";
    if (score >= 40) return "fragile";
    return "non_financable";
  };

  const getNiveauLabel = (niveau: string) => {
    const map: Record<string, string> = { financable: "Finançable", prometteur: "Prometteur", fragile: "Fragile", non_financable: "Non finançable" };
    return map[niveau] || niveau;
  };

  const getNiveauColor = (niveau: string) => {
    const map: Record<string, string> = { financable: "text-emerald-600", prometteur: "text-blue-600", fragile: "text-amber-600", non_financable: "text-rose-600" };
    return map[niveau] || "";
  };

  const handleSave = async () => {
    if (!user || !selectedProject) return;
    setSaving(true);
    const scores = calculateScores();
    const niveau = getNiveau(scores.global);

    // Deactivate previous scores for this project
    await supabase.from("mp_scoring_results").update({ is_active: false }).eq("user_id", user.id).eq("project_id", selectedProject);

    const { error } = await supabase.from("mp_scoring_results").insert({
      user_id: user.id,
      project_id: selectedProject,
      score_juridique: scores.juridique,
      score_financier: scores.financier,
      score_technique: scores.technique,
      score_marche: scores.marche,
      score_impact: scores.impact,
      score_global: scores.global,
      niveau,
      answers,
      is_active: true,
    });

    setSaving(false);
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Score enregistré", description: `Votre MIPROJET SCORE est de ${scores.global}/100` });
      setShowResults(true);
    }
  };

  if (showResults || (existingResults.length > 0 && answeredCount === 0)) {
    const scores = showResults ? calculateScores() : null;
    const result = showResults ? { score_global: scores!.global, score_juridique: scores!.juridique, score_financier: scores!.financier, score_technique: scores!.technique, score_marche: scores!.marche, score_impact: scores!.impact, niveau: getNiveau(scores!.global) } : existingResults[0];

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">MIPROJET SCORE</h2>
          <Button variant="outline" size="sm" onClick={() => { setShowResults(false); setAnswers({}); setCurrentAxisIdx(0); }}>
            Nouvelle évaluation
          </Button>
        </div>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6 text-center">
            <div className="inline-flex items-center justify-center w-28 h-28 rounded-full bg-gray-50 mb-4">
              <span className={`text-4xl font-bold ${getNiveauColor(result.niveau)}`}>{result.score_global}</span>
            </div>
            <p className="text-sm text-gray-500">sur 100</p>
            <p className={`text-lg font-bold mt-2 ${getNiveauColor(result.niveau)}`}>{getNiveauLabel(result.niveau)}</p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {AXES.map((axis) => {
            const key = `score_${axis.key}` as keyof typeof result;
            const score = Number(result[key]) || 0;
            return (
              <Card key={axis.key} className="border-0 shadow-sm">
                <CardContent className="p-4 text-center">
                  <div className={`w-10 h-10 rounded-full ${axis.color} mx-auto mb-2 flex items-center justify-center text-white font-bold text-sm`}>
                    {score}
                  </div>
                  <p className="text-xs text-gray-600 font-medium">{axis.label}</p>
                  <p className="text-[10px] text-gray-400">max {axis.max}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {existingResults.length > 1 && (
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2"><CardTitle className="text-sm">Historique</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-2">
                {existingResults.slice(0, 5).map((r: any) => (
                  <div key={r.id} className="flex justify-between text-sm p-2 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">{new Date(r.created_at).toLocaleDateString("fr-FR")}</span>
                    <span className={`font-bold ${getNiveauColor(r.niveau)}`}>{r.score_global}/100</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">MIPROJET SCORE – Évaluation</h2>

      {/* Project selector */}
      {projects.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6 text-center">
            <BarChart3 className="h-12 w-12 mx-auto text-gray-300 mb-3" />
            <p className="text-gray-600 font-medium">Créez d'abord un projet</p>
            <p className="text-sm text-gray-400 mt-1">Vous devez avoir un projet pour lancer une évaluation</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="space-y-2">
            <Label className="text-sm text-gray-700">Projet à évaluer</Label>
            <Select value={selectedProject} onValueChange={setSelectedProject}>
              <SelectTrigger><SelectValue placeholder="Sélectionnez un projet" /></SelectTrigger>
              <SelectContent>
                {projects.map((p) => (<SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>

          {selectedProject && (
            <>
              {/* Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Progression</span>
                  <span className="font-medium">{answeredCount}/{totalQuestions}</span>
                </div>
                <Progress value={(answeredCount / totalQuestions) * 100} className="h-2" />
              </div>

              {/* Axis tabs */}
              <div className="flex gap-1 overflow-x-auto pb-2">
                {AXES.map((axis, idx) => {
                  const qs = QUESTIONS.filter((q) => q.axis === axis.key);
                  const done = qs.every((q) => answers[q.id] !== undefined);
                  return (
                    <button key={axis.key} onClick={() => setCurrentAxisIdx(idx)}
                      className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1 ${
                        idx === currentAxisIdx ? "bg-emerald-100 text-emerald-700" : done ? "bg-gray-100 text-emerald-600" : "bg-gray-50 text-gray-500"
                      }`}>
                      {done && <CheckCircle className="h-3 w-3" />}
                      {axis.label}
                    </button>
                  );
                })}
              </div>

              {/* Questions */}
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${currentAxis.color}`} />
                    <CardTitle className="text-base">{currentAxis.label}</CardTitle>
                    <span className="text-xs text-gray-400 ml-auto">{currentAxis.max} pts max</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {axisQuestions.map((q) => (
                    <div key={q.id} className="space-y-3">
                      <p className="text-sm font-medium text-gray-800">{q.question}</p>
                      <RadioGroup value={answers[q.id]?.toString()} onValueChange={(v) => setAnswers((prev) => ({ ...prev, [q.id]: parseInt(v) }))}>
                        {q.options.map((opt) => (
                          <div key={opt.value} className="flex items-center space-x-2">
                            <RadioGroupItem value={opt.value.toString()} id={`${q.id}-${opt.value}`} />
                            <Label htmlFor={`${q.id}-${opt.value}`} className="text-sm text-gray-600 cursor-pointer">
                              {opt.label} <span className="text-gray-400">({opt.value} pts)</span>
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Navigation */}
              <div className="flex justify-between">
                <Button variant="outline" disabled={currentAxisIdx === 0} onClick={() => setCurrentAxisIdx((i) => i - 1)}>
                  <ArrowLeft className="h-4 w-4 mr-1" /> Précédent
                </Button>
                {currentAxisIdx < AXES.length - 1 ? (
                  <Button disabled={!allAnswered} onClick={() => setCurrentAxisIdx((i) => i + 1)} className="bg-emerald-600 hover:bg-emerald-700">
                    Suivant <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                ) : (
                  <Button disabled={answeredCount < totalQuestions || saving} onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700">
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Calculer mon score"}
                  </Button>
                )}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default MPScoring;
