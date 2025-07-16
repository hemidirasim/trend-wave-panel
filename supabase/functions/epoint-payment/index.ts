
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, ...requestData } = await req.json();
    console.log('Epoint payment request:', { action, data: requestData });

    // Get credentials from environment
    const publicKey = 'i000200888'; // Public key provided
    const privateKey = Deno.env.get('EPOINT_PRIVATE_KEY');
    
    console.log('Epoint credentials check:', {
      publicKey: publicKey,
      privateKey: privateKey ? `${privateKey.substring(0, 8)}...${privateKey.substring(privateKey.length - 8)}` : 'NOT SET'
    });

    if (!privateKey) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Epoint credentials not configured'
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }

    if (action === 'createPayment') {
      const {
        amount,
        currency,
        orderId,
        description,
        customerEmail,
        customerName,
        successUrl,
        errorUrl
      } = requestData;

      // Convert amount to proper format (Epoint expects amount in qəpik/cents)
      const amountInQepik = Math.round(amount * 100);

      console.log('Creating Epoint payment with amount:', amountInQepik);

      // Create signature according to Epoint documentation
      // The string for signature should be: privateKey + publicKey + amount + currency + description + orderId + successUrl + errorUrl + lang + privateKey
      const signatureString = privateKey + publicKey + amountInQepik.toString() + currency + description + orderId + successUrl + errorUrl + 'az' + privateKey;
      
      console.log('Signature string length:', signatureString.length);
      console.log('Signature string start:', signatureString.substring(0, 50));
      console.log('Signature string end:', signatureString.substring(signatureString.length - 50));
      
      // Create MD5 hash (many payment systems use MD5 for signatures)
      const encoder = new TextEncoder();
      const data = encoder.encode(signatureString);
      
      // Use MD5 hash instead of SHA1
      const crypto = globalThis.crypto;
      let signature;
      
      try {
        // Try to create signature using Web Crypto API with SHA-256 (since MD5 is not available)
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = new Uint8Array(hashBuffer);
        signature = Array.from(hashArray)
          .map(byte => byte.toString(16).padStart(2, '0'))
          .join('');
      } catch (error) {
        console.error('Hash creation failed:', error);
        return new Response(
          JSON.stringify({
            success: false,
            error: 'Signature generation failed'
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
        );
      }

      console.log('Generated signature:', signature);

      // Prepare form data for Epoint API
      const formData = new URLSearchParams();
      formData.append('public_key', publicKey);
      formData.append('amount', amountInQepik.toString());
      formData.append('currency', currency);
      formData.append('description', description);
      formData.append('order_id', orderId);
      formData.append('success_redirect', successUrl);
      formData.append('error_redirect', errorUrl);
      formData.append('lang', 'az');
      formData.append('signature', signature);

      console.log('Form data being sent:');
      for (const [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }

      try {
        const response = await fetch('https://epoint.az/api/1/request', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
            'User-Agent': 'Mozilla/5.0 (compatible; HitLoyal/1.0)'
          },
          body: formData.toString()
        });

        console.log('Epoint API response status:', response.status);
        console.log('Epoint API response headers:', Object.fromEntries(response.headers.entries()));
        
        const responseText = await response.text();
        console.log('Epoint API raw response:', responseText);

        let responseData;
        try {
          responseData = JSON.parse(responseText);
        } catch (parseError) {
          console.error('Failed to parse Epoint response:', parseError);
          return new Response(
            JSON.stringify({
              success: false,
              error: 'Invalid response from payment provider'
            }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
          );
        }

        console.log('Epoint payment response:', responseData);

        if (response.ok && responseData.status === 'success' && responseData.redirect_url) {
          return new Response(
            JSON.stringify({
              success: true,
              paymentUrl: responseData.redirect_url,
              transactionId: responseData.payment_id || orderId
            }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        } else {
          return new Response(
            JSON.stringify({
              success: false,
              error: responseData.message || 'Ödəniş yaradılmadı'
            }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
          );
        }
      } catch (fetchError) {
        console.error('Epoint API request failed:', fetchError);
        return new Response(
          JSON.stringify({
            success: false,
            error: 'Failed to connect to payment provider'
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
        );
      }
    }

    if (action === 'checkStatus') {
      const { transactionId } = requestData;
      
      // For now, return a basic status check
      // This would need to be implemented based on Epoint's status check API
      return new Response(
        JSON.stringify({
          status: 'pending',
          transactionId: transactionId,
          amount: 0,
          currency: 'AZN',
          orderId: transactionId
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        success: false,
        error: 'Invalid action'
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
    );

  } catch (error) {
    console.error('Epoint payment error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Internal server error'
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
