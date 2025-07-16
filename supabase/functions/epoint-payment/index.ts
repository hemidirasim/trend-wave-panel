
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
      // The correct order should be: public_key + amount + currency + description + order_id + success_redirect + error_redirect + lang
      const dataForSignature = publicKey + amountInQepik.toString() + currency + description + orderId + successUrl + errorUrl + 'az';
      const signatureData = privateKey + dataForSignature + privateKey;
      
      console.log('Data for signature:', dataForSignature);
      console.log('Full signature input length:', signatureData.length);
      
      // Create SHA1 hash
      const encoder = new TextEncoder();
      const data = encoder.encode(signatureData);
      const hashBuffer = await crypto.subtle.digest('SHA-1', data);
      
      // Convert to hex string first, then base64
      const hashArray = new Uint8Array(hashBuffer);
      const hashHex = Array.from(hashArray)
        .map(byte => byte.toString(16).padStart(2, '0'))
        .join('');
      
      const signature = btoa(hashHex);

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

      console.log('Form data:', formData.toString());

      try {
        const response = await fetch('https://epoint.az/api/1/request', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
          },
          body: formData.toString()
        });

        console.log('Epoint API response status:', response.status);
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
