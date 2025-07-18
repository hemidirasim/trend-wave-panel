
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const API_BASE_URL = 'https://www.qqtube.com/v1-api';
const API_KEY = '9d9a63f4407126586252fe2a33a424dce7e0a6a4';

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

    let response: Response;

    // Use GET method for 'services' action, POST for others
    if (requestBody.action === 'services') {
      // For services, use GET method with query parameters
      const params = new URLSearchParams();
      params.append('api_key', API_KEY);
      params.append('action', requestBody.action);
      
      const url = `${API_BASE_URL}?${params.toString()}`;
      console.log('Making GET request to QQTube API:', url);

      response = await fetch(url, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'application/json, text/plain, */*',
          'Accept-Language': 'en-US,en;q=0.9',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive',
        },
      });
    } else {
      // For other actions, use POST method with form data
      const formData = new URLSearchParams();
      formData.append('api_key', API_KEY);
      
      // Add all request parameters to form data
      Object.entries(requestBody).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });

      console.log('Making POST request to QQTube API with form data:', formData.toString());

      response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'application/json, text/plain, */*',
          'Accept-Language': 'en-US,en;q=0.9',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive',
        },
        body: formData,
      });
    }

    console.log('QQTube API response status:', response.status);
    console.log('QQTube API response headers:', Object.fromEntries(response.headers.entries()));

    const responseText = await response.text();
    console.log('QQTube API raw response:', responseText);

    if (!response.ok) {
      console.error('QQTube API error response:', responseText);
      return new Response(
        JSON.stringify({ 
          error: `QQTube API error: ${response.status}`,
          details: responseText,
          debug: {
            url: requestBody.action === 'services' ? `${API_BASE_URL}?api_key=${API_KEY}&action=services` : API_BASE_URL,
            method: requestBody.action === 'services' ? 'GET' : 'POST',
            requestData: requestBody,
          }
        }),
        {
          status: response.status,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }

    // Try to parse as JSON
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse response as JSON:', parseError);
      // If it's not JSON, return the raw text wrapped in an object
      data = { 
        raw_response: responseText,
        parse_error: parseError.message 
      };
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
        details: 'Edge Function execution failed',
        stack: error.stack
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
