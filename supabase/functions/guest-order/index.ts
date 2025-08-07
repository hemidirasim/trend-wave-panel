
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
    const { 
      email, 
      serviceData, 
      orderDetails, 
      transactionId 
    } = await req.json();

    // Create Supabase client with service role
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    let userId = null;

    // Check if user already exists
    const { data: existingUser, error: userError } = await supabase.auth.admin.listUsers();
    
    if (userError) {
      console.error('Error checking users:', userError);
    }

    const userExists = existingUser?.users.find(u => u.email === email);

    if (userExists) {
      // User exists, use their ID
      userId = userExists.id;
      console.log('Existing user found:', userId);
    } else {
      // Create new user
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email: email,
        email_confirm: true, // Auto-confirm email for guest users
        user_metadata: {
          full_name: 'Guest User',
          created_via: 'guest_order'
        }
      });

      if (createError) {
        console.error('Error creating user:', createError);
        throw new Error('Failed to create user account');
      }

      userId = newUser.user.id;
      console.log('New user created:', userId);
    }

    // Create order record
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: userId,
        email: email,
        service_id: serviceData.id_service.toString(),
        service_name: serviceData.public_name,
        platform: serviceData.platform,
        service_type: serviceData.type_name || 'Other',
        link: orderDetails.serviceUrl,
        quantity: orderDetails.quantity,
        price: parseFloat(orderDetails.total),
        status: 'pending',
        external_order_id: transactionId
      })
      .select()
      .single();

    if (orderError) {
      console.error('Error creating order:', orderError);
      throw new Error('Failed to create order');
    }

    // Send confirmation email (you can implement this with Resend later)
    console.log('Order created successfully:', order);

    return new Response(
      JSON.stringify({
        success: true,
        userId: userId,
        orderId: order.id,
        message: 'Order created successfully'
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error('Guest order error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Internal server error'
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" }, 
        status: 500 
      }
    );
  }
});
