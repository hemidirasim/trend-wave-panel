
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PayriffPaymentData {
  amount: number;
  language: string;
  currency: string;
  description: string;
  callbackUrl: string;
  cardSave: boolean;
  operation: string;
  metadata?: { [key: string]: string };
}

interface PayriffApiResponse {
  code: string;
  message: string;
  route: string;
  internalMessage: string | null;
  responseId: string;
  payload: {
    orderId: string;
    paymentUrl: string;
    transactionId: number;
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { action, ...data } = await req.json()
    
    const merchantId = 'ES1094521'
    const secretKey = '910C7790D6F14A6DAF28C7A34374A81A'
    const baseUrl = 'https://api.payriff.com'

    if (action === 'createPayment') {
      const { amount, currency, orderId, description, customerEmail, customerName, successUrl, errorUrl } = data

      const paymentData: PayriffPaymentData = {
        amount: amount,
        language: 'EN',
        currency: currency.toUpperCase(),
        description: description,
        callbackUrl: successUrl,
        cardSave: false,
        operation: 'PURCHASE',
        metadata: {
          orderId: orderId,
          customerEmail: customerEmail || '',
          customerName: customerName || ''
        }
      }

      console.log('Creating Payriff payment:', paymentData)

      const response = await fetch(`${baseUrl}/api/v3/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'MerchantId': merchantId,
          'Authorization': `Bearer ${secretKey}`
        },
        body: JSON.stringify(paymentData)
      })

      console.log('Payriff API response status:', response.status)
      
      const responseText = await response.text()
      console.log('Payriff API raw response:', responseText)

      let result: PayriffApiResponse
      try {
        result = JSON.parse(responseText)
      } catch (parseError) {
        console.error('Failed to parse response as JSON:', parseError)
        return new Response(
          JSON.stringify({
            success: false,
            error: 'API cavab formatı düzgün deyil'
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500,
          }
        )
      }

      console.log('Payriff payment response:', result)

      if (result.code === '00000' && result.payload?.paymentUrl) {
        return new Response(
          JSON.stringify({
            success: true,
            paymentUrl: result.payload.paymentUrl,
            transactionId: result.payload.transactionId.toString()
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        )
      } else {
        return new Response(
          JSON.stringify({
            success: false,
            error: result.message || 'Ödəniş yaradılmadı'
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
          }
        )
      }
    }

    if (action === 'checkStatus') {
      const { transactionId } = data

      const statusData = {
        orderId: transactionId
      }

      const response = await fetch(`${baseUrl}/api/v3/orders/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'MerchantId': merchantId,
          'Authorization': `Bearer ${secretKey}`
        },
        body: JSON.stringify(statusData)
      })

      const result = await response.json()

      const mapStatus = (status: string): 'pending' | 'success' | 'failed' | 'cancelled' => {
        switch (status?.toLowerCase()) {
          case 'success':
          case 'completed':
          case 'paid':
            return 'success'
          case 'failed':
          case 'error':
          case 'declined':
            return 'failed'
          case 'cancelled':
          case 'canceled':
            return 'cancelled'
          default:
            return 'pending'
        }
      }

      return new Response(
        JSON.stringify({
          status: mapStatus(result.status),
          transactionId: result.transactionId,
          amount: result.amount,
          currency: result.currency,
          orderId: result.orderId
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )

  } catch (error) {
    console.error('Payriff payment error:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Ödəniş sistemində xəta baş verdi'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
