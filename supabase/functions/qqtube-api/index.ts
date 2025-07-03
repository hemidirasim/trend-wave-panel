
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const API_BASE_URL = 'https://www.qqtube.com/v1-api';
const API_KEY = '2246aa33bc7050be3469cc0dd4a0065831e3148f';

interface ApiRequest {
  action: string;
  id_service?: string;
  url?: string;
  quantity?: number;
  id_service_submission?: string;
  limit?: number;
  [key: string]: any;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('QQTube API Request received');
    
    const requestBody: ApiRequest = await req.json();
    console.log('Request body:', requestBody);

    // Prepare URL-encoded form data for QQTube API
    const formParams = new URLSearchParams();
    formParams.append('api_key', API_KEY);
    
    // Add all request parameters to form data
    Object.entries(requestBody).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formParams.append(key, value.toString());
      }
    });

    console.log('Making request to QQTube API with URL-encoded data...');
    console.log('Form params:', formParams.toString());

    // Make request to QQTube API with proper headers
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (compatible; Supabase Edge Function)',
      },
      body: formParams.toString(),
    });

    console.log('QQTube API response status:', response.status);
    console.log('QQTube API response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('QQTube API error response:', errorText);
      throw new Error(`QQTube API error: ${response.status} - ${errorText}`);
    }

    const responseText = await response.text();
    console.log('QQTube API raw response:', responseText);

    // Try to parse as JSON
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse response as JSON:', parseError);
      // If it's not JSON, return the raw text
      data = { message: responseText };
    }

    console.log('QQTube API parsed response data:', data);

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error('Edge Function Error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Edge Function execution failed'
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  }
};

serve(handler);
