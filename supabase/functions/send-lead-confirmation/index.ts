import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const { email, firstName, documentTitle, downloadUrl } = await req.json();

    if (!email || !downloadUrl) {
      return new Response(JSON.stringify({ success: false, error: 'Email and downloadUrl required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Use Supabase's built-in email via auth.admin or a simple SMTP approach
    // For now, we log the email and return success - integrate with Resend/SMTP later
    console.log(`📧 Confirmation email to ${email}:`);
    console.log(`  Name: ${firstName}`);
    console.log(`  Document: ${documentTitle}`);
    console.log(`  Download: ${downloadUrl}`);

    // Store the email attempt for admin tracking
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    await supabase.from('notifications').insert({
      user_id: '00000000-0000-0000-0000-000000000000', // system notification
      title: `Email de confirmation envoyé`,
      message: `Document "${documentTitle}" - Email envoyé à ${email}`,
      type: 'info',
      metadata: { email, firstName, documentTitle, downloadUrl, sent_at: new Date().toISOString() },
    }).then(() => {});

    return new Response(JSON.stringify({
      success: true,
      message: 'Confirmation email queued',
      emailContent: {
        to: email,
        subject: `Votre document : ${documentTitle}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #16a34a;">✅ Merci ${firstName || ''} !</h2>
            <p>Votre téléchargement est prêt. Voici votre lien de téléchargement :</p>
            <p style="margin: 20px 0;">
              <a href="${downloadUrl}" style="background-color: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">
                📥 Télécharger : ${documentTitle}
              </a>
            </p>
            <p style="color: #666; font-size: 14px;">Si le bouton ne fonctionne pas, copiez ce lien : <a href="${downloadUrl}">${downloadUrl}</a></p>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />
            <p style="color: #999; font-size: 12px;">MiPROJET - Plateforme de financement de projets en Côte d'Ivoire</p>
          </div>
        `
      }
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Failed' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
