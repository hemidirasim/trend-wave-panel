
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
            // First, let's check if we're using the service role correctly
            console.log('🔐 Verifying service role connection...');
            const { data: testQuery, error: testError } = await supabase
              .from('profiles')
              .select('count')
              .limit(1);
            
            if (testError) {
              console.error('❌ Service role connection error:', testError);
              return new Response('Database connection error', { status: 500 });
            } else {
              console.log('✅ Service role connection working');
            }

            // Find user by email and update balance
            console.log('👤 Finding user profile by email:', transaction.customer_email);
            
            // Try with multiple approaches to find the profile
            console.log('🔍 Attempt 1: Direct email match');
            const { data: profile1, error: profileError1 } = await supabase
              .from('profiles')
              .select('id, balance, email')
              .eq('email', transaction.customer_email)
              .maybeSingle();

            console.log('Profile search result 1:', { profile1, profileError1 });

            // Try case-insensitive search
            console.log('🔍 Attempt 2: Case-insensitive email match');
            const { data: profile2, error: profileError2 } = await supabase
              .from('profiles')
              .select('id, balance, email')
              .ilike('email', transaction.customer_email)
              .maybeSingle();

            console.log('Profile search result 2:', { profile2, profileError2 });

            // Get all profiles for debugging
            console.log('🔍 Debug: Checking all profiles...');
            const { data: allProfiles, error: allProfilesError } = await supabase
              .from('profiles')
              .select('id, email, balance')
              .limit(10);
            
            if (allProfilesError) {
              console.error('❌ Error fetching all profiles:', allProfilesError);
            } else {
              console.log('📊 Sample profiles in database:', allProfiles);
              console.log('📧 Looking for email:', transaction.customer_email);
              
              // Check if email exists in any form
              const emailExists = allProfiles?.find(p => 
                p.email?.toLowerCase() === transaction.customer_email?.toLowerCase()
              );
              console.log('🔍 Email found in profiles?', emailExists ? 'YES' : 'NO');
            }

            const profile = profile1 || profile2;
            const profileError = profile1 ? profileError1 : profileError2;

            if (profileError || !profile) {
              console.error('❌ Profile not found for email:', transaction.customer_email);
              console.error('❌ Profile error:', profileError);
              return new Response('Profile not found', { status: 404 });
            }

            console.log('📋 Found user profile:', {
              userId: profile.id,
              email: profile.email,
              currentBalance: profile.balance
            });

            const oldBalance = parseFloat(profile.balance || '0');
            const newBalance = oldBalance + amountValue;
            
            console.log('💳 About to update balance:', {
              userId: profile.id,
              email: profile.email,
              oldBalance,
              amountToAdd: amountValue,
              newBalance,
              timestamp: new Date().toISOString()
            });
            
            // Update with explicit select to verify the update
            const { data: updateResult, error: updateBalanceError } = await supabase
              .from('profiles')
              .update({ 
                balance: newBalance,
                updated_at: new Date().toISOString()
              })
              .eq('id', profile.id)
              .select('id, email, balance, updated_at');

            if (updateBalanceError) {
              console.error('❌ Error updating balance:', updateBalanceError);
              return new Response('Error updating balance', { status: 500 });
            }

            console.log('🎉 Balance update result:', updateResult);
            
            if (updateResult && updateResult.length > 0) {
              console.log('✅ Balance updated successfully:', {
                userId: updateResult[0].id,
                email: updateResult[0].email,
                newBalance: updateResult[0].balance,
                updatedAt: updateResult[0].updated_at,
                amountAdded: amountValue
              });
            } else {
              console.error('❌ No rows were updated!');
            }

            // Double-check by fetching the profile again
            console.log('🔍 Verifying balance update...');
            const { data: verifyProfile, error: verifyError } = await supabase
              .from('profiles')
              .select('id, email, balance, updated_at')
              .eq('id', profile.id)
              .single();

            if (verifyError) {
              console.error('❌ Error verifying update:', verifyError);
            } else {
              console.log('✅ Verified profile after update:', verifyProfile);
              
              // Compare the balances
              const verifiedBalance = parseFloat(verifyProfile.balance || '0');
              if (verifiedBalance === newBalance) {
                console.log('🎯 Balance verification SUCCESSFUL!');
              } else {
                console.error('❌ Balance verification FAILED!', {
                  expected: newBalance,
                  actual: verifiedBalance
                });
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
