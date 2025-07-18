
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const API_BASE_URL = 'https://www.qqtube.com/v1-api';
const API_KEY = '9d9a63f4407126586252fe2a33a424dce7e0a6a4';

interface OrderStatusResponse {
  id_service_submission: string;
  status: {
    id_status: string;
    name: string;
    type: string;
    description: string;
  };
  current_count: string;
  wanted_count: string;
  start_count: string;
  total_cost: string;
  refund_total?: string;
}

const getStatusFromApiId = (apiStatusId: string): string => {
  const statusId = parseInt(apiStatusId);
  
  console.log(`Mapping API status ID ${statusId} to local status`);
  
  if (statusId === 1) return 'completed';
  if (statusId === 2 || statusId === 3) return 'processing';
  if (statusId === 4) return 'error';
  if ((statusId >= 5 && statusId <= 7) || (statusId >= 9 && statusId <= 18) || (statusId >= 20 && statusId <= 25)) return 'error';
  if (statusId === 8) return 'refunded';
  if (statusId === 19) return 'stopped';
  
  return 'pending'; // fallback
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('=== Order status check started ===');
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    console.log('Supabase URL:', supabaseUrl);
    console.log('Service key available:', !!supabaseServiceKey);
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get all orders that might need status updates
    console.log('Fetching orders that need status checks...');
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('id, external_order_id, status, service_name, created_at')
      .in('status', ['pending', 'processing'])
      .not('external_order_id', 'is', null);

    if (ordersError) {
      console.error('Error fetching orders:', ordersError);
      return new Response(JSON.stringify({ error: 'Failed to fetch orders', details: ordersError }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    console.log(`Found ${orders?.length || 0} orders to check`);
    console.log('Orders data:', orders?.map(o => ({ id: o.id, external_order_id: o.external_order_id, status: o.status, service_name: o.service_name })));

    if (!orders || orders.length === 0) {
      return new Response(JSON.stringify({ 
        message: 'No orders to check',
        timestamp: new Date().toISOString() 
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    let updatedCount = 0;
    let errorCount = 0;

    // Check each order status
    for (const order of orders) {
      if (!order.external_order_id) {
        console.log(`Skipping order ${order.id} - no external_order_id`);
        continue;
      }

      try {
        console.log(`=== Checking order ${order.id} with external ID ${order.external_order_id} ===`);

        const params = new URLSearchParams();
        params.append('api_key', API_KEY);
        params.append('action', 'stats');
        params.append('id_service_submission', order.external_order_id);

        const apiUrl = `${API_BASE_URL}?${params.toString()}`;
        console.log(`Making API request to: ${apiUrl}`);

        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'application/json',
          },
        });

        console.log(`API response status for order ${order.id}: ${response.status}`);

        if (!response.ok) {
          console.error(`API request failed for order ${order.id}: ${response.status} ${response.statusText}`);
          errorCount++;
          continue;
        }

        const responseText = await response.text();
        console.log(`API response for order ${order.id}:`, responseText.substring(0, 500));

        let statusData: OrderStatusResponse;
        try {
          statusData = JSON.parse(responseText);
        } catch (parseError) {
          console.error(`Failed to parse response for order ${order.id}:`, parseError);
          console.error('Response text:', responseText);
          errorCount++;
          continue;
        }

        if (!statusData.status || !statusData.status.id_status) {
          console.error(`Invalid status data for order ${order.id}:`, statusData);
          errorCount++;
          continue;
        }

        const apiStatusId = statusData.status.id_status;
        const newStatus = getStatusFromApiId(apiStatusId);
        
        console.log(`Order ${order.id}: API status ID ${apiStatusId} -> local status "${newStatus}" (current: "${order.status}")`);
        
        if (newStatus !== order.status) {
          console.log(`Updating order ${order.id} status from "${order.status}" to "${newStatus}"`);
          
          const { error: updateError } = await supabase
            .from('orders')
            .update({ 
              status: newStatus,
              updated_at: new Date().toISOString()
            })
            .eq('id', order.id);

          if (updateError) {
            console.error(`Failed to update order ${order.id}:`, updateError);
            errorCount++;
          } else {
            console.log(`Successfully updated order ${order.id}`);
            updatedCount++;
          }
        } else {
          console.log(`Order ${order.id} status unchanged: ${newStatus}`);
        }

        // Add a small delay to avoid overwhelming the API
        await new Promise(resolve => setTimeout(resolve, 200));

      } catch (error) {
        console.error(`Error checking order ${order.id}:`, error);
        errorCount++;
      }
    }

    const result = {
      message: 'Order status check completed',
      timestamp: new Date().toISOString(),
      checked: orders.length,
      updated: updatedCount,
      errors: errorCount,
      summary: `Checked ${orders.length} orders, updated ${updatedCount}, errors ${errorCount}`
    };

    console.log('=== Final result ===', result);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });

  } catch (error: any) {
    console.error('=== Edge Function Error ===', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: 'Order status check failed',
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
};

serve(handler);
