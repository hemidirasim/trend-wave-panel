
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

    // Prepare form data for QQTube API
    const formData = new FormData();
    formData.append('api_key', API_KEY);
    
    // Add all request parameters to form data
    Object.entries(requestBody).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });

    console.log('Making request to QQTube API...');

    // Make request to QQTube API
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      body: formData,
    });

    console.log('QQTube API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('QQTube API error:', errorText);
      throw new Error(`QQTube API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('QQTube API response data:', data);

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
