
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface OrderNotificationRequest {
  gift_type: string;
  delivery_address: string;
  delivery_instructions?: string;
  preferred_time: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const recipientEmail = Deno.env.get("NOTIFICATION_EMAIL");
  if (!recipientEmail) {
    console.error("NOTIFICATION_EMAIL environment variable not set");
    return new Response(
      JSON.stringify({ error: "Recipient email not configured" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }

  try {
    const { 
      gift_type, 
      delivery_address, 
      delivery_instructions, 
      preferred_time 
    }: OrderNotificationRequest = await req.json();

    console.log("Attempting to send email notification to:", recipientEmail);
    console.log("Order details:", { gift_type, delivery_address, delivery_instructions, preferred_time });

    const emailResponse = await resend.emails.send({
      from: "Gift Orders <onboarding@resend.dev>",
      to: [recipientEmail],
      subject: "New Gift Order Received!",
      html: `
        <h1>New Gift Order Details</h1>
        <p><strong>Gift:</strong> ${gift_type}</p>
        <p><strong>Delivery Address:</strong> ${delivery_address}</p>
        <p><strong>Delivery Instructions:</strong> ${delivery_instructions || 'None'}</p>
        <p><strong>Preferred Time:</strong> ${preferred_time}</p>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error) {
    console.error("Error sending order notification:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
