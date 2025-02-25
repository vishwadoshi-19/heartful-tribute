
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const WHATSAPP_API_URL = "https://graph.facebook.com/v17.0/FROM_PHONE_ID/messages";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { gift_type, delivery_address, delivery_instructions, preferred_time } = await req.json()

    // Format the message
    const message = `New Gift Order!\n\n` +
      `Gift: ${gift_type}\n` +
      `Delivery Address: ${delivery_address}\n` +
      `Instructions: ${delivery_instructions || 'None'}\n` +
      `Preferred Time: ${preferred_time}`

    // Send WhatsApp message using Meta's Graph API
    const response = await fetch(WHATSAPP_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('WHATSAPP_ACCESS_TOKEN')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: Deno.env.get('WHATSAPP_TO_NUMBER'),
        type: "text",
        text: {
          body: message
        }
      })
    })

    const result = await response.json()
    
    console.log('WhatsApp API Response:', result)

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error sending WhatsApp message:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
