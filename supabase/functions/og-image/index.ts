import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const SITE_URL = Deno.env.get("PUBLIC_SITE_URL") || "https://miprojet.agricapital.ci";
const DEFAULT_IMAGE = `${SITE_URL}/miprojet-og-cover.png`;

const ctaByType: Record<string, string> = {
  news: "Lire l'article complet sur MIPROJET",
  opportunity: "Découvrir l'opportunité sur MIPROJET",
  project: "Découvrir le projet sur MIPROJET",
  document: "Télécharger le document sur MIPROJET",
  ebook: "Télécharger le guide sur MIPROJET",
};

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const toAbsoluteUrl = (value: string, fallbackBase: string) => {
  if (!value) return value;
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  return `${fallbackBase}${value.startsWith("/") ? "" : "/"}${value}`;
};

const buildHtml = ({
  title,
  description,
  image,
  pageUrl,
}: {
  title: string;
  description: string;
  image: string;
  pageUrl: string;
}) => `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(title)} | MIPROJET</title>
  <meta name="description" content="${escapeHtml(description)}" />
  <meta property="og:type" content="article" />
  <meta property="og:site_name" content="MIPROJET" />
  <meta property="og:locale" content="fr_FR" />
  <meta property="og:title" content="${escapeHtml(title)}" />
  <meta property="og:description" content="${escapeHtml(description)}" />
  <meta property="og:image" content="${escapeHtml(image)}" />
  <meta property="og:image:secure_url" content="${escapeHtml(image)}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:url" content="${escapeHtml(pageUrl)}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(title)}" />
  <meta name="twitter:description" content="${escapeHtml(description)}" />
  <meta name="twitter:image" content="${escapeHtml(image)}" />
  <link rel="canonical" href="${escapeHtml(pageUrl)}" />
  <meta http-equiv="refresh" content="0;url=${escapeHtml(pageUrl)}" />
</head>
<body>
  <p>Redirection vers <a href="${escapeHtml(pageUrl)}">${escapeHtml(title)}</a>…</p>
</body>
</html>`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const type = url.searchParams.get("type");
    const id = url.searchParams.get("id");
    const format = url.searchParams.get("format");

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
    } else if (type === "document" || type === "ebook") {
      const { data } = await supabase.from("platform_documents").select("title, description, cover_url").eq("id", id).single();
      if (data) {
        title = data.title;
        description = data.description?.substring(0, 160) || description;
        image = data.cover_url || DEFAULT_IMAGE;
        pageUrl = `${SITE_URL}/documents/${id}`;
      }
    }

    const cta = ctaByType[type] || "Découvrir sur MIPROJET";
    const seoDescription = `${description} — ${cta}`.substring(0, 220);
    const absoluteImage = toAbsoluteUrl(image, SITE_URL);

    if (format === "json") {
      const jsonHeaders = new Headers(corsHeaders);
      jsonHeaders.set("content-type", "application/json; charset=utf-8");
      return new Response(JSON.stringify({ title, description: seoDescription, image: absoluteImage, url: pageUrl }), {
        headers: jsonHeaders,
      });
    }

    const htmlHeaders = new Headers(corsHeaders);
    htmlHeaders.set("content-type", "text/html; charset=utf-8");
    return new Response(buildHtml({ title, description: seoDescription, image: absoluteImage, pageUrl }), {
      headers: htmlHeaders,
    });
  } catch (error) {
    console.error("OG metadata error:", error);
    const errorHeaders = new Headers(corsHeaders);
    errorHeaders.set("content-type", "application/json; charset=utf-8");
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: errorHeaders,
    });
  }
});
