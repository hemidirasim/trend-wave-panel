
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
    console.log('Epoint webhook received:', req.method, req.url);
    
    // Create Supabase client with service role key to bypass RLS
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    if (req.method === 'POST') {
      const body = await req.text();
      console.log('Webhook body:', body);

      // Parse form data from Epoint webhook
      const formData = new URLSearchParams(body);
      const status = formData.get('status');
      const orderId = formData.get('order_id');
      const amount = formData.get('amount');
      const transactionId = formData.get('transaction_id');
      
      console.log('Parsed webhook data:', {
        status,
        orderId,
        amount,
        transactionId
      });

      // Only process successful payments
      if (status === 'approved' && orderId && amount) {
        const amountValue = parseFloat(amount);
        
        console.log('Processing successful payment:', {
          orderId,
          amount: amountValue,
          transactionId
        });

        // Update payment transaction status
        const { error: updateTransactionError } = await supabase
          .from('payment_transactions')
          .update({ 
            status: 'completed',
            transaction_id: transactionId,
            completed_at: new Date().toISOString()
          })
          .eq('order_id', orderId);

        if (updateTransactionError) {
          console.error('Error updating transaction:', updateTransactionError);
        }

        // Check if this is a balance top-up order
        if (orderId.startsWith('balance-')) {
          // Get the payment transaction to find the customer
          const { data: transaction, error: transactionError } = await supabase
            .from('payment_transactions')
            .select('customer_email')
            .eq('order_id', orderId)
            .single();

          if (transactionError) {
            console.error('Error finding transaction:', transactionError);
            return new Response('Transaction not found', { status: 404 });
          }

          if (transaction?.customer_email) {
            // Find user by email and update balance
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('id, balance')
              .eq('email', transaction.customer_email)
              .single();

            if (profileError) {
              console.error('Error finding profile:', profileError);
              return new Response('Profile not found', { status: 404 });
            }

            if (profile) {
              const newBalance = (profile.balance || 0) + amountValue;
              
              const { error: updateBalanceError } = await supabase
                .from('profiles')
                .update({ 
                  balance: newBalance,
                  updated_at: new Date().toISOString()
                })
                .eq('id', profile.id);

              if (updateBalanceError) {
                console.error('Error updating balance:', updateBalanceError);
                return new Response('Error updating balance', { status: 500 });
              }

              console.log('Balance updated successfully:', {
                userId: profile.id,
                oldBalance: profile.balance,
                newBalance: newBalance,
                amountAdded: amountValue
              });
            }
          }
        }

        return new Response('Payment processed successfully', { status: 200 });
      } else if (status === 'declined' || status === 'cancelled') {
        // Update transaction status for failed payments
        const { error: updateTransactionError } = await supabase
          .from('payment_transactions')
          .update({ 
            status: 'failed',
            transaction_id: transactionId,
            completed_at: new Date().toISOString()
          })
          .eq('order_id', orderId);

        if (updateTransactionError) {
          console.error('Error updating failed transaction:', updateTransactionError);
        }

        console.log('Payment failed or cancelled:', { orderId, status });
        return new Response('Payment failed', { status: 200 });
      }
    }

    // For GET requests or other methods, return OK
    return new Response('Epoint webhook endpoint is active', { 
      status: 200,
      headers: corsHeaders
    });

  } catch (error) {
    console.error('Webhook error:', error);
    return new Response('Internal server error', { 
      status: 500,
      headers: corsHeaders
    });
  }
});
