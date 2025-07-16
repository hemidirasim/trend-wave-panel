
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-requested-with',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
  'Access-Control-Max-Age': '86400',
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
  payload?: {
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
    
    // Use Payriff credentials from environment variables
    const merchantId = Deno.env.get('PAYRIFF_MERCHANT_ID')
    const secretKey = Deno.env.get('PAYRIFF_SECRET_KEY')
    
    console.log('Payriff credentials check:', {
      merchantId: merchantId ? `${merchantId.substring(0, 3)}...${merchantId.substring(merchantId.length - 3)}` : 'NOT SET',
      secretKey: secretKey ? `${secretKey.substring(0, 8)}...${secretKey.substring(secretKey.length - 8)}` : 'NOT SET'
    })
    
    if (!merchantId || !secretKey) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Payriff credentials not configured'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      )
    }
    const baseUrl = 'https://api.payriff.com'

    console.log('Payriff payment request:', { action, data })

    if (action === 'createPayment') {
      const { amount, currency, orderId, description, customerEmail, customerName, successUrl, errorUrl } = data

      const paymentData: PayriffPaymentData = {
        amount: amount,
        language: 'AZ',
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

      const requestHeaders = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'MerchantId': merchantId,
        'Authorization': `Bearer ${secretKey}`
      }

      console.log('Request headers:', {
        ...requestHeaders,
        'Authorization': `Bearer ${secretKey.substring(0, 8)}...${secretKey.substring(secretKey.length - 8)}`
      })
      console.log('Request URL:', `${baseUrl}/api/v3/orders`)
      console.log('Request body:', JSON.stringify(paymentData, null, 2))

      try {
        const response = await fetch(`${baseUrl}/api/v3/orders`, {
          method: 'POST',
          headers: requestHeaders,
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
      } catch (fetchError) {
        console.error('Fetch error:', fetchError)
        return new Response(
          JSON.stringify({
            success: false,
            error: 'API sorğusunda xəta baş verdi'
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500,
          }
        )
      }
    }

    if (action === 'checkStatus') {
      const { transactionId } = data

      const statusData = {
        orderId: transactionId
      }

      try {
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
      } catch (fetchError) {
        console.error('Status check error:', fetchError)
        return new Response(
          JSON.stringify({
            status: 'pending',
            transactionId: transactionId,
            amount: 0,
            currency: 'AZN',
            orderId: transactionId
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        )
      }
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
