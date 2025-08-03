

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AccountEmailRequest {
  email: string;
  password?: string | null;
  orderDetails: {
    serviceName: string;
    quantity: number;
    price: number;
    link: string;
  };
  isExistingUser?: boolean;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, password, orderDetails, isExistingUser = false }: AccountEmailRequest = await req.json();

    let emailHtml;
    let subject;

    if (isExistingUser) {
      // Email for existing users - only order information
      subject = "Sifarişiniz təsdiqləndi";
      emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Sifarişiniz uğurla tamamlandı!</h2>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #495057; margin-top: 0;">Sifariş məlumatları:</h3>
            <ul style="list-style: none; padding: 0;">
              <li><strong>Xidmət:</strong> ${orderDetails.serviceName}</li>
              <li><strong>Miqdar:</strong> ${orderDetails.quantity}</li>
              <li><strong>Qiymət:</strong> $${orderDetails.price.toFixed(2)}</li>
              <li><strong>Link:</strong> ${orderDetails.link}</li>
            </ul>
          </div>

          <p style="color: #666;">
            Sifarişinizin statusunu izləmək üçün hesabınıza daxil olaraq dashboard bölməsinə baxa bilərsiniz.
          </p>

          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            Təşəkkür edirik ki, bizə etibar etdiniz!
          </p>
        </div>
      `;
    } else {
      // Email for new users - order information + account credentials
      subject = "Sifarişiniz təsdiqləndi - Hesab məlumatları";
      emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Sifarişiniz uğurla tamamlandı!</h2>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #495057; margin-top: 0;">Sifariş məlumatları:</h3>
            <ul style="list-style: none; padding: 0;">
              <li><strong>Xidmət:</strong> ${orderDetails.serviceName}</li>
              <li><strong>Miqdar:</strong> ${orderDetails.quantity}</li>
              <li><strong>Qiymət:</strong> $${orderDetails.price.toFixed(2)}</li>
              <li><strong>Link:</strong> ${orderDetails.link}</li>
            </ul>
          </div>

          <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1976d2; margin-top: 0;">Hesab məlumatlarınız:</h3>
            <p>Sizin üçün avtomatik olaraq hesab yaradılmışdır:</p>
            <ul style="list-style: none; padding: 0;">
              <li><strong>Email:</strong> ${email}</li>
              <li><strong>Şifrə:</strong> ${password}</li>
            </ul>
            <p style="color: #666; font-size: 14px;">
              Bu məlumatları təhlükəsiz yerdə saxlayın və giriş etdikdən sonra şifrənizi dəyişməyi tövsiyə edirik.
            </p>
          </div>

          <p style="color: #666;">
            Sifarişinizin statusunu izləmək üçün hesabınıza daxil olaraq dashboard bölməsinə baxa bilərsiniz.
          </p>

          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            Təşəkkür edirik ki, bizə etibar etdiniz!
          </p>
        </div>
      `;
    }

    const emailResponse = await resend.emails.send({
      from: "SMM Panel <noreply@example.com>",
      to: [email],
      subject: subject,
      html: emailHtml,
    });

    console.log("Account email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error sending account email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);

