
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

interface EmailRequest {
  email: string;
  password: string;
  userId: string;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { email, password, userId }: EmailRequest = await req.json();

    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    // Email məzmunu
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Hesabınız Yaradıldı</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          .header { text-align: center; margin-bottom: 30px; }
          .logo { font-size: 24px; font-weight: bold; color: #333; }
          .content { color: #333; line-height: 1.6; }
          .credentials { background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .button { display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { margin-top: 30px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">Social Media Panel</div>
          </div>
          
          <div class="content">
            <h2>Hesabınız Uğurla Yaradıldı!</h2>
            
            <p>Salam,</p>
            
            <p>Sifarişinizi tamamlamaq üçün sizin adınıza avtomatik olaraq bir hesab yaratdıq. Aşağıda hesabınızın giriş məlumatlarını tapacaqsınız:</p>
            
            <div class="credentials">
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Şifrə:</strong> ${password}</p>
            </div>
            
            <p>Bu məlumatları təhlükəsiz yerdə saxlayın və istədiyiniz vaxt şifrənizi dəyişə bilərsiniz.</p>
            
            <a href="${req.headers.get('origin') || 'https://yoursite.com'}/auth" class="button">Hesabıma Daxil Ol</a>
            
            <p>Sifarişinizin statusunu yoxlamaq və digər xidmətlərimizdən istifadə etmək üçün hesabınıza daxil ola bilərsiniz.</p>
            
            <p>Təşəkkürlər,<br>Social Media Panel Komandası</p>
          </div>
          
          <div class="footer">
            <p>Bu email avtomatik olaraq göndərilmişdir. Cavab vermək tələb olunmur.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Resend API ilə email göndərmək
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "noreply@yoursite.com",
        to: email,
        subject: "Hesabınız Yaradıldı - Social Media Panel",
        html: emailHtml,
      }),
    });

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      throw new Error(`Email sending failed: ${errorText}`);
    }

    const result = await emailResponse.json();

    return new Response(
      JSON.stringify({ success: true, messageId: result.id }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
