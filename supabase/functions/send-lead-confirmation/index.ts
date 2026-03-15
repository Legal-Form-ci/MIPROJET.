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

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');

    const htmlContent = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 0; background: #f9fafb;">
        <div style="background: linear-gradient(135deg, #166534, #22863a); padding: 30px 24px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 22px;">MIPROJET</h1>
          <p style="color: rgba(255,255,255,0.85); margin: 8px 0 0; font-size: 13px;">Plateforme Panafricaine de Structuration de Projets</p>
        </div>
        <div style="padding: 30px 24px; background: white;">
          <h2 style="color: #166534; margin: 0 0 16px;">Bonjour ${firstName || ''} 👋</h2>
          <p style="color: #374151; line-height: 1.6; margin: 0 0 20px;">
            Merci pour votre intérêt ! Votre document <strong>"${documentTitle}"</strong> est prêt à être téléchargé.
          </p>
          <div style="text-align: center; margin: 24px 0;">
            <a href="${downloadUrl}" style="background: #166534; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600; font-size: 15px;">
              📥 Télécharger le document
            </a>
          </div>
          <p style="color: #6b7280; font-size: 13px; margin: 20px 0 0;">
            Si le bouton ne fonctionne pas, copiez ce lien : <a href="${downloadUrl}" style="color: #166534;">${downloadUrl}</a>
          </p>
        </div>
        <div style="padding: 20px 24px; background: #f3f4f6; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="color: #9ca3af; font-size: 11px; margin: 0;">
            © ${new Date().getFullYear()} MIPROJET — Structuration • Financement • Incubation
          </p>
          <p style="color: #9ca3af; font-size: 11px; margin: 4px 0 0;">
            <a href="https://www.ivoireprojet.com" style="color: #166534;">www.ivoireprojet.com</a>
          </p>
        </div>
      </div>
    `;

    // Try sending via Lovable AI gateway (Resend-compatible)
    let emailSent = false;
    if (lovableApiKey) {
      try {
        const res = await fetch('https://ai.gateway.lovable.dev/v1/email/send', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${lovableApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: email,
            subject: `📥 Votre document : ${documentTitle}`,
            html: htmlContent,
            from: 'MIPROJET <noreply@miprojet.ci>',
          }),
        });
        if (res.ok) {
          emailSent = true;
          console.log(`✅ Email sent to ${email}`);
        } else {
          console.log(`⚠️ Gateway email failed: ${res.status}`);
        }
      } catch (e) {
        console.log('⚠️ Gateway email error:', e);
      }
    }

    // Log the email for admin tracking
    const supabase = createClient(supabaseUrl, supabaseKey);
    await supabase.from('notifications').insert({
      user_id: '00000000-0000-0000-0000-000000000000',
      title: emailSent ? `✅ Email envoyé à ${email}` : `📧 Email en attente pour ${email}`,
      message: `Document "${documentTitle}" - ${emailSent ? 'Email envoyé' : 'Email en attente (configurer SMTP)'}`,
      type: 'info',
      metadata: { email, firstName, documentTitle, downloadUrl, sent: emailSent, sent_at: new Date().toISOString() },
    }).then(() => {});

    return new Response(JSON.stringify({
      success: true,
      emailSent,
      message: emailSent ? 'Email sent successfully' : 'Email queued (SMTP not configured)',
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Failed' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
