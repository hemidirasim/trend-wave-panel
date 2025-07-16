
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

      // Create JSON string as shown in the documentation
      const jsonData = {
        "public_key": publicKey,
        "amount": amountInQepik.toString(),
        "currency": currency,
        "description": description,
        "order_id": orderId.toString()
      };

      const jsonString = JSON.stringify(jsonData);
      console.log('JSON string created:', jsonString);

      // Base64 encode the JSON string
      const encoder = new TextEncoder();
      const jsonBytes = encoder.encode(jsonString);
      const data = btoa(String.fromCharCode(...jsonBytes));
      
      console.log('Base64 encoded data:', data);

      // Create signature: private_key + data + private_key
      const signatureInput = privateKey + data + privateKey;
      console.log('Signature input length:', signatureInput.length);
      console.log('Signature input start:', signatureInput.substring(0, 50));
      console.log('Signature input end:', signatureInput.substring(signatureInput.length - 50));

      // Create SHA1 hash and then base64 encode
      const signatureBytes = encoder.encode(signatureInput);
      const hashBuffer = await crypto.subtle.digest('SHA-1', signatureBytes);
      const hashArray = new Uint8Array(hashBuffer);
      const hashHex = Array.from(hashArray)
        .map(byte => byte.toString(16).padStart(2, '0'))
        .join('');
      
      // Base64 encode the hash
      const signature = btoa(hashHex);
      console.log('Generated signature:', signature);

      // Prepare form data for Epoint API
      const formData = new URLSearchParams();
      formData.append('data', data);
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
