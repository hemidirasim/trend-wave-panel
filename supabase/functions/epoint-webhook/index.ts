
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
          
          // Get the payment transaction to find the user
          console.log('🔍 Finding transaction by order_id:', orderId);
          const { data: transaction, error: transactionError } = await supabase
            .from('payment_transactions')
            .select('user_id, customer_email')
            .eq('order_id', orderId)
            .single();

          if (transactionError) {
            console.error('❌ Error finding transaction:', transactionError);
            return new Response('Transaction not found', { status: 404 });
          }

          console.log('📧 Found transaction for user:', transaction?.user_id, 'email:', transaction?.customer_email);

          if (transaction?.user_id) {
            const userId = transaction.user_id;
            
            // Find profile by user_id (more reliable than email)
            console.log('👤 Looking for profile with user_id:', userId);
            const { data: existingProfile, error: profileSearchError } = await supabase
              .from('profiles')
              .select('id, balance, email')
              .eq('id', userId)
              .maybeSingle();

            if (profileSearchError) {
              console.error('❌ Error searching for profile:', profileSearchError);
              return new Response('Error searching profile', { status: 500 });
            }

            let profileToUpdate = existingProfile;
            
            // If no profile exists, create one (shouldn't happen but just in case)
            if (!existingProfile) {
              console.log('🆕 No profile found, creating new profile for user:', userId);
              
              const { data: newProfile, error: createProfileError } = await supabase
                .from('profiles')
                .insert({
                  id: userId,
                  email: transaction.customer_email,
                  full_name: transaction.customer_email?.split('@')[0] || 'User',
                  balance: 0.00,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString()
                })
                .select('id, balance, email')
                .single();

              if (createProfileError) {
                console.error('❌ Error creating profile:', createProfileError);
                return new Response('Error creating profile', { status: 500 });
              }
              
              console.log('✅ New profile created:', newProfile);
              profileToUpdate = newProfile;
            }

            console.log('📋 Profile to update:', {
              userId: profileToUpdate.id,
              email: profileToUpdate.email,
              currentBalance: profileToUpdate.balance
            });

            const oldBalance = parseFloat(profileToUpdate.balance || '0');
            const newBalance = oldBalance + amountValue;
            
            console.log('💳 About to update balance:', {
              userId: profileToUpdate.id,
              email: profileToUpdate.email,
              oldBalance,
              amountToAdd: amountValue,
              newBalance,
              timestamp: new Date().toISOString()
            });
            
            // Update balance
            const { data: updateResult, error: updateBalanceError } = await supabase
              .from('profiles')
              .update({ 
                balance: newBalance,
                updated_at: new Date().toISOString()
              })
              .eq('id', profileToUpdate.id)
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
              .eq('id', profileToUpdate.id)
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
