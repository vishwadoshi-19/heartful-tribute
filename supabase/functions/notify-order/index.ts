
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
  console.log("Function invoked with method:", req.method);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Check for required environment variables
  const resendApiKey = Deno.env.get("RESEND_API_KEY");
  const recipientEmail = Deno.env.get("NOTIFICATION_EMAIL");

  console.log("Environment check:");
  console.log("- RESEND_API_KEY present:", !!resendApiKey);
  console.log("- NOTIFICATION_EMAIL present:", !!recipientEmail);

  if (!resendApiKey) {
    console.error("RESEND_API_KEY environment variable not set");
    return new Response(
      JSON.stringify({ error: "Email service not configured" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }

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
    console.log("Parsing request body...");
    const requestBody = await req.text();
    console.log("Raw request body:", requestBody);

    let orderData: OrderNotificationRequest;
    try {
      orderData = JSON.parse(requestBody);
    } catch (parseError) {
      console.error("Failed to parse request body:", parseError);
      return new Response(
        JSON.stringify({ error: "Invalid request body" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const { 
      gift_type, 
      delivery_address, 
      delivery_instructions = '', 
      preferred_time 
    } = orderData;

    console.log("Validated order data:", {
      gift_type,
      delivery_address,
      delivery_instructions,
      preferred_time,
      recipientEmail
    });

    console.log("Attempting to send email via Resend...");
    const emailResponse = await resend.emails.send({
      from: "Gift Orders <onboarding@resend.dev>", // Using Resend's testing domain
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
  } catch (error: any) {
    console.error("Error in notify-order function:", error);
    console.error("Error details:", {
      name: error.name,
      message: error.message,
      stack: error.stack
    });

    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: "Check function logs for more information" 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
