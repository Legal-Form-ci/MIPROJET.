import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const SITE_URL = "https://miprojet.agricapital.ci";
const DEFAULT_IMAGE = `${SITE_URL}/miprojet-og-cover.png`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const type = url.searchParams.get("type"); // news, opportunity, project, ebook, document
    const id = url.searchParams.get("id");

    if (!type || !id) {
      return new Response(JSON.stringify({ error: "Missing type or id" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    let title = "MIPROJET";
    let description = "Plateforme Panafricaine de Structuration de Projets";
    let image = DEFAULT_IMAGE;
    let pageUrl = SITE_URL;

    if (type === "news") {
      const { data } = await supabase.from("news").select("title, excerpt, content, image_url").eq("id", id).single();
      if (data) {
        title = data.title;
        description = data.excerpt || data.content?.substring(0, 160) || description;
        image = data.image_url || DEFAULT_IMAGE;
        pageUrl = `${SITE_URL}/news/${id}`;
      }
    } else if (type === "opportunity") {
      const { data } = await supabase.from("opportunities").select("title, description, content, image_url").eq("id", id).single();
      if (data) {
        title = data.title;
        description = data.description || data.content?.substring(0, 160) || description;
        image = data.image_url || DEFAULT_IMAGE;
        pageUrl = `${SITE_URL}/opportunities/${id}`;
      }
    } else if (type === "project") {
      const { data } = await supabase.from("projects").select("title, description, image_url").eq("id", id).single();
      if (data) {
        title = data.title;
        description = data.description?.substring(0, 160) || description;
        image = data.image_url || DEFAULT_IMAGE;
        pageUrl = `${SITE_URL}/projects/${id}`;
      }
    } else if (type === "document") {
      const { data } = await supabase.from("platform_documents").select("title, description, cover_url").eq("id", id).single();
      if (data) {
        title = data.title;
        description = data.description?.substring(0, 160) || description;
        image = data.cover_url || DEFAULT_IMAGE;
        pageUrl = `${SITE_URL}/documents/${id}`;
      }
    }

    // Return OG metadata as JSON (used by the Vercel middleware)
    return new Response(JSON.stringify({ title, description, image, url: pageUrl }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("OG metadata error:", error);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
