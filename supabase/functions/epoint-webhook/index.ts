
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Add startup logging
console.log('🚀 EPOINT WEBHOOK FUNCTION INITIALIZING...');
console.log('🚀 Function started at:', new Date().toISOString());

serve(async (req) => {
  // CRITICAL: Log every single request that comes in, no matter what
  const timestamp = new Date().toISOString();
  console.log('\n' + '='.repeat(80));
  console.log('🚨 WEBHOOK REQUEST INCOMING! 🚨');
  console.log('='.repeat(80));
  console.log('⏰ Timestamp:', timestamp);
  console.log('📋 Method:', req.method);
  console.log('🌐 URL:', req.url);
  console.log('🌐 Host:', req.headers.get('host'));
  console.log('🔗 User-Agent:', req.headers.get('user-agent'));
  console.log('📍 Content-Type:', req.headers.get('content-type'));
  console.log('📍 Content-Length:', req.headers.get('content-length'));
  console.log('🌍 Origin:', req.headers.get('origin'));
  console.log('🔑 Authorization:', req.headers.get('authorization') ? 'PRESENT' : 'NOT PRESENT');
  console.log('📨 ALL HEADERS:', JSON.stringify(Object.fromEntries(req.headers.entries()), null, 2));

  if (req.method === "OPTIONS") {
    console.log('✅ OPTIONS request - returning CORS headers');
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase client with service role key to bypass RLS
    console.log('🔗 Creating Supabase client with service role...');
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    
    console.log('🔗 Supabase URL:', supabaseUrl);
    console.log('🔗 Service Role Key exists:', !!supabaseServiceKey);
    console.log('🔗 Service Role Key length:', supabaseServiceKey?.length || 0);

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    if (req.method === 'POST') {
      console.log('📨 Processing POST request...');
      
      // Get raw body
      const body = await req.text();
      console.log('📥 Raw webhook body:', body);
      console.log('📥 Body length:', body.length);
      console.log('📥 Body type:', typeof body);

      // Try to parse as JSON first
      let webhookData;
      let status, orderId, amount, transactionId, code, message, rrn, cardName, cardMask;

      try {
        console.log('🔄 Attempting JSON parsing...');
        webhookData = JSON.parse(body);
        console.log('✅ JSON parsing successful!');
        console.log('📊 Parsed webhook data:', JSON.stringify(webhookData, null, 2));
        
        // Extract all relevant fields from Epoint webhook
        status = webhookData.status;
        orderId = webhookData.order_id;
        amount = webhookData.amount;
        transactionId = webhookData.transaction;
        code = webhookData.code;
        message = webhookData.message;
        rrn = webhookData.rrn;
        cardName = webhookData.card_name;
        cardMask = webhookData.card_mask;

        console.log('📋 Extracted fields:');
        console.log('  - Status:', status);
        console.log('  - Order ID:', orderId);
        console.log('  - Amount:', amount);
        console.log('  - Transaction ID:', transactionId);
        console.log('  - Code:', code);
        console.log('  - Message:', message);
        console.log('  - RRN:', rrn);
        console.log('  - Card Name:', cardName);
        console.log('  - Card Mask:', cardMask);

      } catch (jsonError) {
        console.log('❌ JSON parsing failed:', jsonError);
        console.log('🔄 Attempting form data parsing...');
        
        // If JSON parsing fails, try form data (fallback)
        const formData = new URLSearchParams(body);
        status = formData.get('status');
        orderId = formData.get('order_id');
        amount = formData.get('amount');
        transactionId = formData.get('transaction');
        code = formData.get('code');
        message = formData.get('message');
        rrn = formData.get('rrn');
        cardName = formData.get('card_name');
        cardMask = formData.get('card_mask');

        console.log('📋 Form data extracted fields:');
        console.log('  - Status:', status);
        console.log('  - Order ID:', orderId);
        console.log('  - Amount:', amount);
        console.log('  - Transaction ID:', transactionId);
        console.log('  - Code:', code);
        console.log('  - Message:', message);
        console.log('  - RRN:', rrn);
        console.log('  - Card Name:', cardName);
        console.log('  - Card Mask:', cardMask);
      }

      // Validation checks
      console.log('🔍 Starting validation checks...');
      console.log('🔍 Status check - received:', status, 'expected: success');
      console.log('🔍 Code check - received:', code, 'expected: 000');
      console.log('🔍 Order ID check - exists:', !!orderId, 'value:', orderId);
      console.log('🔍 Amount check - exists:', !!amount, 'value:', amount, 'type:', typeof amount);

      // Check for successful payments
      if (status === 'success' && code === '000' && orderId && amount) {
        console.log('🎉 PAYMENT SUCCESS DETECTED!');
        console.log('🎉 Processing successful payment...');
        
        const amountValue = parseFloat(amount.toString());
        console.log('💰 Amount converted to float:', amountValue);
        
        console.log('📝 Updating payment transaction status...');
        console.log('📝 Looking for transaction with order_id:', orderId);

        // Update payment transaction status with additional data
        const { data: updateResult, error: updateTransactionError } = await supabase
          .from('payment_transactions')
          .update({ 
            status: 'completed',
            transaction_id: transactionId,
            completed_at: new Date().toISOString()
          })
          .eq('order_id', orderId)
          .select('*');

        if (updateTransactionError) {
          console.error('❌ Error updating transaction:', updateTransactionError);
          console.error('❌ Error details:', JSON.stringify(updateTransactionError, null, 2));
        } else {
          console.log('✅ Transaction updated successfully!');
          console.log('✅ Update result:', JSON.stringify(updateResult, null, 2));
        }

        // Check if this is a balance top-up order
        if (orderId.startsWith('balance-')) {
          console.log('💰 BALANCE TOP-UP DETECTED!');
          console.log('💰 Processing balance top-up for order:', orderId);
          
          // Get the payment transaction to find the user
          console.log('🔍 Finding transaction by order_id:', orderId);
          const { data: transaction, error: transactionError } = await supabase
            .from('payment_transactions')
            .select('user_id, customer_email, customer_name, amount, currency')
            .eq('order_id', orderId)
            .single();

          if (transactionError) {
            console.error('❌ Error finding transaction:', transactionError);
            console.error('❌ Transaction error details:', JSON.stringify(transactionError, null, 2));
            return new Response('Transaction not found', { status: 404 });
          }

          console.log('📧 Found transaction:', JSON.stringify(transaction, null, 2));
          console.log('📧 User ID from transaction:', transaction?.user_id);
          console.log('📧 Customer email from transaction:', transaction?.customer_email);

          if (transaction?.user_id) {
            const userId = transaction.user_id;
            
            console.log('👤 Looking for profile with user_id:', userId);
            
            // Find profile by user_id
            const { data: existingProfile, error: profileSearchError } = await supabase
              .from('profiles')
              .select('id, balance, email, full_name')
              .eq('id', userId)
              .maybeSingle();

            if (profileSearchError) {
              console.error('❌ Error searching for profile:', profileSearchError);
              console.error('❌ Profile search error details:', JSON.stringify(profileSearchError, null, 2));
              return new Response('Error searching profile', { status: 500 });
            }

            console.log('👤 Profile search result:', JSON.stringify(existingProfile, null, 2));

            let profileToUpdate = existingProfile;
            
            // If no profile exists, create one
            if (!existingProfile) {
              console.log('🆕 No profile found, creating new profile for user:', userId);
              
              const { data: newProfile, error: createProfileError } = await supabase
                .from('profiles')
                .insert({
                  id: userId,
                  email: transaction.customer_email,
                  full_name: transaction.customer_name || transaction.customer_email?.split('@')[0] || 'User',
                  balance: 0.00,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString()
                })
                .select('id, balance, email, full_name')
                .single();

              if (createProfileError) {
                console.error('❌ Error creating profile:', createProfileError);
                console.error('❌ Create profile error details:', JSON.stringify(createProfileError, null, 2));
                return new Response('Error creating profile', { status: 500 });
              }
              
              console.log('✅ New profile created:', JSON.stringify(newProfile, null, 2));
              profileToUpdate = newProfile;
            }

            const oldBalance = parseFloat(profileToUpdate.balance || '0');
            const newBalance = oldBalance + amountValue;
            
            console.log('💳 BALANCE UPDATE DETAILS:');
            console.log('💳 User ID:', profileToUpdate.id);
            console.log('💳 Email:', profileToUpdate.email);
            console.log('💳 Old Balance:', oldBalance);
            console.log('💳 Amount to Add:', amountValue);
            console.log('💳 New Balance:', newBalance);
            console.log('💳 Transaction ID:', transactionId);
            console.log('💳 RRN:', rrn);
            console.log('💳 Card Info:', { cardName, cardMask });
            console.log('💳 Timestamp:', new Date().toISOString());
            
            // Update balance
            console.log('🔄 Executing balance update...');
            const { data: balanceUpdateResult, error: updateBalanceError } = await supabase
              .from('profiles')
              .update({ 
                balance: newBalance,
                updated_at: new Date().toISOString()
              })
              .eq('id', profileToUpdate.id)
              .select('id, email, balance, updated_at');

            if (updateBalanceError) {
              console.error('❌ Error updating balance:', updateBalanceError);
              console.error('❌ Balance update error details:', JSON.stringify(updateBalanceError, null, 2));
              return new Response('Error updating balance', { status: 500 });
            }

            console.log('🎉 BALANCE UPDATE SUCCESS!');
            console.log('🎉 Balance update result:', JSON.stringify(balanceUpdateResult, null, 2));
            
            if (balanceUpdateResult && balanceUpdateResult.length > 0) {
              console.log('✅ Balance updated successfully for user:', balanceUpdateResult[0].id);
              console.log('✅ New balance:', balanceUpdateResult[0].balance);
              console.log('✅ Updated at:', balanceUpdateResult[0].updated_at);
            } else {
              console.error('❌ No rows were updated in balance update!');
            }

            // Double-check by fetching the profile again
            console.log('🔍 Verifying balance update by fetching profile again...');
            const { data: verifyProfile, error: verifyError } = await supabase
              .from('profiles')
              .select('id, email, balance, updated_at')
              .eq('id', profileToUpdate.id)
              .single();

            if (verifyError) {
              console.error('❌ Error verifying update:', verifyError);
              console.error('❌ Verify error details:', JSON.stringify(verifyError, null, 2));
            } else {
              console.log('✅ VERIFICATION RESULT:', JSON.stringify(verifyProfile, null, 2));
              
              const verifiedBalance = parseFloat(verifyProfile.balance || '0');
              if (verifiedBalance === newBalance) {
                console.log('🎯 BALANCE VERIFICATION SUCCESSFUL!');
                console.log('🎯 Expected:', newBalance, 'Actual:', verifiedBalance);
              } else {
                console.error('❌ BALANCE VERIFICATION FAILED!');
                console.error('❌ Expected:', newBalance, 'Actual:', verifiedBalance);
              }
            }
          } else {
            console.error('❌ No user_id found in transaction');
          }
        } else {
          console.log('ℹ️ Not a balance top-up order, skipping balance update');
        }

        console.log('✅ Payment processing completed successfully');
        return new Response('Payment processed successfully', { status: 200 });
        
      } else if (status === 'failed' || (status !== 'success' || code !== '000')) {
        console.log('❌ PAYMENT FAILED OR INVALID');
        console.log('❌ Failure details:', { 
          orderId, 
          status, 
          code, 
          message,
          transactionId,
          rrn 
        });
        
        if (orderId) {
          console.log('📝 Updating transaction status to failed...');
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
          } else {
            console.log('✅ Failed transaction status updated');
          }
        }

        return new Response('Payment failed', { status: 200 });
      } else {
        console.log('⚠️ UNHANDLED WEBHOOK STATUS');
        console.log('⚠️ Unhandled details:', { 
          status, 
          code, 
          orderId, 
          amount,
          message,
          hasStatus: !!status,
          hasCode: !!code,
          hasOrderId: !!orderId,
          hasAmount: !!amount
        });
        return new Response('Unhandled status or missing data', { status: 200 });
      }
    }

    // For GET requests or other methods, return OK
    console.log('ℹ️ Non-POST request received, returning OK');
    console.log('ℹ️ Request details for non-POST:', {
      method: req.method,
      url: req.url,
      headers: Object.fromEntries(req.headers.entries()),
      timestamp: new Date().toISOString()
    });
    
    return new Response(JSON.stringify({
      status: 'active',
      message: 'Epoint webhook endpoint is running and ready to receive payments',
      timestamp: new Date().toISOString(),
      version: '2.0',
      webhook_url: 'https://lnsragearbdkxpbhhyez.supabase.co/functions/v1/epoint-webhook'
    }), { 
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error('💥 CRITICAL WEBHOOK ERROR!');
    console.error('💥 Error details:', error);
    console.error('💥 Error stack:', error.stack);
    console.error('💥 Error message:', error.message);
    console.error('💥 Error name:', error.name);
    return new Response('Internal server error', { 
      status: 500,
      headers: corsHeaders
    });
  }
});
