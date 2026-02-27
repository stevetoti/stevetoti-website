import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { name, email, company, service, budget, message } = await req.json();

    // Validate required fields
    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: "Name, email, and message are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Initialize Supabase client
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Save to database
    const { data: submission, error: dbError } = await supabase
      .from("contact_submissions")
      .insert({
        name,
        email,
        company: company || null,
        service: service || null,
        budget: budget || null,
        message,
        status: "new",
      })
      .select()
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
      return new Response(
        JSON.stringify({ error: "Failed to save submission" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Send email notification via Resend
    if (RESEND_API_KEY) {
      const emailHtml = `
        <h2>New Contact Form Submission</h2>
        <p><strong>From:</strong> ${name} (${email})</p>
        ${company ? `<p><strong>Company:</strong> ${company}</p>` : ""}
        ${service ? `<p><strong>Service Interest:</strong> ${service}</p>` : ""}
        ${budget ? `<p><strong>Budget:</strong> ${budget}</p>` : ""}
        <p><strong>Message:</strong></p>
        <p style="white-space: pre-wrap; background: #f5f5f5; padding: 16px; border-radius: 8px;">${message}</p>
        <hr />
        <p style="color: #666; font-size: 12px;">Submitted via stevetoti.com contact form</p>
      `;

      try {
        const emailResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Steve Toti <noreply@totiroom.pacificwavedigital.com>",
            to: ["toti@pacificwavedigital.com", "steve@pacificwavedigital.com"],
            subject: `New Contact: ${name} - ${service || "General Inquiry"}`,
            html: emailHtml,
            reply_to: email,
          }),
        });

        if (!emailResponse.ok) {
          const errorText = await emailResponse.text();
          console.error("Email send error:", errorText);
        } else {
          console.log("Email sent successfully");
        }
      } catch (emailError) {
        console.error("Email error:", emailError);
        // Don't fail the request if email fails
      }
    } else {
      console.warn("RESEND_API_KEY not configured, skipping email");
    }

    return new Response(
      JSON.stringify({ success: true, id: submission.id }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
