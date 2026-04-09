import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, FileText, Loader2, Pencil, Trash2 } from "lucide-react";

const SECTORS = ["Agriculture", "Commerce", "Artisanat", "Services", "Transport", "BTP", "Industrie", "Technologie", "Éducation", "Santé", "Autre"];

const MPProjects = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "", description: "", activity_type: "micro_activity", sector: "", legal_status: "",
    city: "", annual_revenue: 0, monthly_expenses: 0, employees_count: 0,
    has_accounting: false, has_bank_account: false, has_business_plan: false,
  });

  const fetchProjects = async () => {
    if (!user) return;
    const { data } = await supabase.from("mp_projects").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
    if (data) setProjects(data);
    setLoading(false);
  };

  useEffect(() => { fetchProjects(); }, [user]);

  const resetForm = () => {
    setForm({ title: "", description: "", activity_type: "micro_activity", sector: "", legal_status: "", city: "", annual_revenue: 0, monthly_expenses: 0, employees_count: 0, has_accounting: false, has_bank_account: false, has_business_plan: false });
    setEditingId(null);
  };

  const handleSubmit = async () => {
    if (!user || !form.title) return;
    setSaving(true);
    const payload = { ...form, user_id: user.id };

    let error;
    if (editingId) {
      ({ error } = await supabase.from("mp_projects").update(payload).eq("id", editingId));
    } else {
      ({ error } = await supabase.from("mp_projects").insert(payload));
    }

    setSaving(false);
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      toast({ title: editingId ? "Projet modifié" : "Projet créé" });
      setShowForm(false);
      resetForm();
      fetchProjects();
    }
  };

  const handleEdit = (p: any) => {
    setForm({ title: p.title, description: p.description || "", activity_type: p.activity_type, sector: p.sector || "", legal_status: p.legal_status || "", city: p.city || "", annual_revenue: p.annual_revenue || 0, monthly_expenses: p.monthly_expenses || 0, employees_count: p.employees_count || 0, has_accounting: p.has_accounting, has_bank_account: p.has_bank_account, has_business_plan: p.has_business_plan });
    setEditingId(p.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("mp_projects").delete().eq("id", id);
    if (!error) { toast({ title: "Projet supprimé" }); fetchProjects(); }
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-emerald-600" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Mes projets</h2>
        <Dialog open={showForm} onOpenChange={(o) => { setShowForm(o); if (!o) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="bg-emerald-600 hover:bg-emerald-700" size="sm"><Plus className="h-4 w-4 mr-1" /> Nouveau</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editingId ? "Modifier le projet" : "Nouveau projet"}</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label>Nom du projet / activité *</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Ex: Boutique de tissus Abidjan" /></div>
              <div><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Type</Label><Select value={form.activity_type} onValueChange={(v) => setForm({ ...form, activity_type: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="micro_activity">Micro-activité</SelectItem><SelectItem value="pme">PME</SelectItem><SelectItem value="startup">Startup</SelectItem><SelectItem value="cooperative">Coopérative</SelectItem></SelectContent></Select></div>
                <div><Label>Secteur</Label><Select value={form.sector} onValueChange={(v) => setForm({ ...form, sector: v })}><SelectTrigger><SelectValue placeholder="Secteur" /></SelectTrigger><SelectContent>{SECTORS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Ville</Label><Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /></div>
                <div><Label>Statut juridique</Label><Input value={form.legal_status} onChange={(e) => setForm({ ...form, legal_status: e.target.value })} placeholder="SARL, SA, EI..." /></div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div><Label>CA annuel (XOF)</Label><Input type="number" value={form.annual_revenue} onChange={(e) => setForm({ ...form, annual_revenue: +e.target.value })} /></div>
                <div><Label>Charges/mois</Label><Input type="number" value={form.monthly_expenses} onChange={(e) => setForm({ ...form, monthly_expenses: +e.target.value })} /></div>
                <div><Label>Employés</Label><Input type="number" value={form.employees_count} onChange={(e) => setForm({ ...form, employees_count: +e.target.value })} /></div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between"><Label>Comptabilité tenue</Label><Switch checked={form.has_accounting} onCheckedChange={(v) => setForm({ ...form, has_accounting: v })} /></div>
                <div className="flex items-center justify-between"><Label>Compte bancaire</Label><Switch checked={form.has_bank_account} onCheckedChange={(v) => setForm({ ...form, has_bank_account: v })} /></div>
                <div className="flex items-center justify-between"><Label>Business plan</Label><Switch checked={form.has_business_plan} onCheckedChange={(v) => setForm({ ...form, has_business_plan: v })} /></div>
              </div>
              <Button onClick={handleSubmit} disabled={saving || !form.title} className="w-full bg-emerald-600 hover:bg-emerald-700">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : editingId ? "Modifier" : "Créer le projet"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {projects.length === 0 ? (
        <Card className="border-0 shadow-sm"><CardContent className="p-8 text-center">
          <FileText className="h-12 w-12 mx-auto text-gray-300 mb-3" />
          <p className="text-gray-600 font-medium">Aucun projet</p>
          <p className="text-sm text-gray-400 mt-1">Créez votre premier projet pour démarrer l'évaluation</p>
        </CardContent></Card>
      ) : (
        <div className="space-y-3">
          {projects.map((p) => (
            <Card key={p.id} className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-900">{p.title}</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">{p.activity_type === "micro_activity" ? "Micro-activité" : p.activity_type === "pme" ? "PME" : p.activity_type}</Badge>
                      {p.sector && <Badge variant="secondary" className="text-xs">{p.sector}</Badge>}
                      {p.city && <span className="text-xs text-gray-400">{p.city}</span>}
                    </div>
                    {p.description && <p className="text-xs text-gray-500 mt-2 line-clamp-2">{p.description}</p>}
                  </div>
                  <div className="flex gap-1 shrink-0 ml-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(p)}><Pencil className="h-3.5 w-3.5" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-rose-500" onClick={() => handleDelete(p.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MPProjects;
