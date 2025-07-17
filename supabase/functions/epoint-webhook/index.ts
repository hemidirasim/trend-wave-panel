
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
    console.log('🔔 Epoint webhook received:', req.method, req.url);
    
    // Create Supabase client with service role key to bypass RLS
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    if (req.method === 'POST') {
      const body = await req.text();
      console.log('📥 Webhook body received:', body);

      // Parse form data from Epoint webhook
      const formData = new URLSearchParams(body);
      const status = formData.get('status');
      const orderId = formData.get('order_id');
      const amount = formData.get('amount');
      const transactionId = formData.get('transaction_id');
      
      console.log('📊 Parsed webhook data:', {
        status,
        orderId,
        amount,
        transactionId
      });

      // Only process successful payments
      if (status === 'approved' && orderId && amount) {
        const amountValue = parseFloat(amount);
        
        console.log('✅ Processing successful payment:', {
          orderId,
          amount: amountValue,
          transactionId
        });

        // Update payment transaction status
        console.log('📝 Updating payment transaction...');
        const { error: updateTransactionError } = await supabase
          .from('payment_transactions')
          .update({ 
            status: 'completed',
            transaction_id: transactionId,
            completed_at: new Date().toISOString()
          })
          .eq('order_id', orderId);

        if (updateTransactionError) {
          console.error('❌ Error updating transaction:', updateTransactionError);
        } else {
          console.log('✅ Transaction updated successfully');
        }

        // Check if this is a balance top-up order
        if (orderId.startsWith('balance-')) {
          console.log('💰 Processing balance top-up...');
          
          // Get the payment transaction to find the customer
          console.log('🔍 Finding transaction by order_id:', orderId);
          const { data: transaction, error: transactionError } = await supabase
            .from('payment_transactions')
            .select('customer_email')
            .eq('order_id', orderId)
            .single();

          if (transactionError) {
            console.error('❌ Error finding transaction:', transactionError);
            return new Response('Transaction not found', { status: 404 });
          }

          console.log('📧 Found transaction for customer:', transaction?.customer_email);

          if (transaction?.customer_email) {
            // Find user by email and update balance
            console.log('👤 Finding user profile by email:', transaction.customer_email);
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('id, balance, email')
              .eq('email', transaction.customer_email)
              .single();

            if (profileError) {
              console.error('❌ Error finding profile:', profileError);
              
              // Also try to find all profiles to debug
              console.log('🔍 Debug: Checking all profiles...');
              const { data: allProfiles, error: allProfilesError } = await supabase
                .from('profiles')
                .select('id, email, balance');
              
              if (allProfilesError) {
                console.error('❌ Error fetching all profiles:', allProfilesError);
              } else {
                console.log('📊 All profiles in database:', allProfiles);
              }
              
              return new Response('Profile not found', { status: 404 });
            }

            console.log('📋 Found user profile:', {
              userId: profile?.id,
              email: profile?.email,
              currentBalance: profile?.balance
            });

            if (profile) {
              const oldBalance = parseFloat(profile.balance || '0');
              const newBalance = oldBalance + amountValue;
              
              console.log('💳 Updating balance:', {
                userId: profile.id,
                email: profile.email,
                oldBalance,
                amountToAdd: amountValue,
                newBalance
              });
              
              const { data: updateResult, error: updateBalanceError } = await supabase
                .from('profiles')
                .update({ 
                  balance: newBalance,
                  updated_at: new Date().toISOString()
                })
                .eq('id', profile.id)
                .select();

              if (updateBalanceError) {
                console.error('❌ Error updating balance:', updateBalanceError);
                return new Response('Error updating balance', { status: 500 });
              }

              console.log('🎉 Balance update result:', updateResult);
              console.log('✅ Balance updated successfully:', {
                userId: profile.id,
                email: profile.email,
                oldBalance: oldBalance,
                newBalance: newBalance,
                amountAdded: amountValue
              });

              // Verify the update by fetching the profile again
              console.log('🔍 Verifying balance update...');
              const { data: verifyProfile, error: verifyError } = await supabase
                .from('profiles')
                .select('balance')
                .eq('id', profile.id)
                .single();

              if (verifyError) {
                console.error('❌ Error verifying update:', verifyError);
              } else {
                console.log('✅ Verified balance:', verifyProfile?.balance);
              }
            }
          }
        } else {
          console.log('ℹ️ Not a balance top-up order, skipping balance update');
        }

        return new Response('Payment processed successfully', { status: 200 });
        
      } else if (status === 'declined' || status === 'cancelled') {
        console.log('❌ Payment failed or cancelled:', { orderId, status });
        
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
          console.error('❌ Error updating failed transaction:', updateTransactionError);
        }

        return new Response('Payment failed', { status: 200 });
      } else {
        console.log('⚠️ Unhandled webhook status:', { status, orderId });
        return new Response('Unhandled status', { status: 200 });
      }
    }

    // For GET requests or other methods, return OK
    console.log('ℹ️ Non-POST request received');
    return new Response('Epoint webhook endpoint is active', { 
      status: 200,
      headers: corsHeaders
    });

  } catch (error) {
    console.error('💥 Webhook error:', error);
    return new Response('Internal server error', { 
      status: 500,
      headers: corsHeaders
    });
  }
});
