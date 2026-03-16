// Vercel Serverless Function for OG tag prerendering
// This intercepts social media crawler requests and returns HTML with proper OG tags

const SUPABASE_URL = "https://nrrgqnruoylwztddkntm.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ycmdxbnJ1b3lsd3p0ZGRrbnRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzExNTYxOTYsImV4cCI6MjA4NjczMjE5Nn0.p2bFufIgC7dcHIWTBBGdhkEbS9XXxiEdIY2kymE0dZ0";
const SITE_URL = "https://miprojet.agricapital.ci";
const DEFAULT_IMAGE = `${SITE_URL}/miprojet-og-cover.png`;

async function fetchFromSupabase(table, id, fields) {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}&select=${fields}`,
    {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
    }
  );
  const data = await res.json();
  return data?.[0] || null;
}

function generateHTML(title, description, image, url) {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>${escapeHtml(title)} | MIPROJET</title>
  <meta name="description" content="${escapeHtml(description)}">
  <meta property="og:type" content="article">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:image" content="${escapeHtml(image)}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:url" content="${escapeHtml(url)}">
  <meta property="og:site_name" content="MIPROJET">
  <meta property="og:locale" content="fr_FR">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(title)}">
  <meta name="twitter:description" content="${escapeHtml(description)}">
  <meta name="twitter:image" content="${escapeHtml(image)}">
  <meta http-equiv="refresh" content="0;url=${escapeHtml(url)}">
</head>
<body>
  <p>Redirection vers <a href="${escapeHtml(url)}">${escapeHtml(title)}</a>...</p>
</body>
</html>`;
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export default async function handler(req, res) {
  const { type, id } = req.query;

  if (!type || !id) {
    return res.status(400).json({ error: "Missing type or id" });
  }

  let title = "MIPROJET";
  let description = "Plateforme Panafricaine de Structuration de Projets";
  let image = DEFAULT_IMAGE;
  let url = SITE_URL;

  try {
    if (type === "news") {
      const data = await fetchFromSupabase("news", id, "title,excerpt,content,image_url");
      if (data) {
        title = data.title;
        description = data.excerpt || data.content?.substring(0, 160) || description;
        image = data.image_url || DEFAULT_IMAGE;
        url = `${SITE_URL}/news/${id}`;
      }
    } else if (type === "opportunity") {
      const data = await fetchFromSupabase("opportunities", id, "title,description,content,image_url");
      if (data) {
        title = data.title;
        description = data.description || data.content?.substring(0, 160) || description;
        image = data.image_url || DEFAULT_IMAGE;
        url = `${SITE_URL}/opportunities/${id}`;
      }
    } else if (type === "project") {
      const data = await fetchFromSupabase("projects", id, "title,description,image_url");
      if (data) {
        title = data.title;
        description = data.description?.substring(0, 160) || description;
        image = data.image_url || DEFAULT_IMAGE;
        url = `${SITE_URL}/projects/${id}`;
      }
    } else if (type === "document") {
      const data = await fetchFromSupabase("platform_documents", id, "title,description,cover_url");
      if (data) {
        title = data.title;
        description = data.description?.substring(0, 160) || description;
        image = data.cover_url || DEFAULT_IMAGE;
        url = `${SITE_URL}/documents/${id}`;
      }
    }
  } catch (e) {
    console.error("Error fetching OG data:", e);
  }

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate");
  return res.status(200).send(generateHTML(title, description, image, url));
}
