import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  service?: string;
  budget?: string;
  message: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const resendApiKey = Deno.env.get("RESEND_API_KEY")!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    const body: ContactFormData = await req.json();
    const { name, email, company, service, budget, message } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: "Name, email, and message are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 1. Save to Supabase
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

    // 2. Send email notification via Resend
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #1a1a2e; color: #fff; padding: 30px; border-radius: 12px;">
        <h1 style="color: #EF5E33; margin-bottom: 20px;">🚀 New Contact Form Submission</h1>
        
        <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #EF5E33; font-size: 18px; margin-bottom: 15px;">Contact Details</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}" style="color: #EF5E33;">${email}</a></p>
          ${company ? `<p><strong>Company:</strong> ${company}</p>` : ""}
          ${service ? `<p><strong>Service Interested:</strong> ${service}</p>` : ""}
          ${budget ? `<p><strong>Budget Range:</strong> ${budget}</p>` : ""}
        </div>
        
        <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 8px;">
          <h2 style="color: #EF5E33; font-size: 18px; margin-bottom: 15px;">Message</h2>
          <p style="white-space: pre-wrap; line-height: 1.6;">${message}</p>
        </div>
        
        <div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.2); text-align: center;">
          <p style="color: #888; font-size: 12px;">
            Submitted at: ${new Date().toLocaleString("en-US", { timeZone: "Pacific/Efate" })} (Vanuatu Time)
          </p>
          <a href="https://stevetoti.com/admin" style="display: inline-block; background: #EF5E33; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 10px;">
            View in Admin Dashboard
          </a>
        </div>
      </div>
    `;

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Steve Toti Website <notifications@totiroom.pacificwavedigital.com>",
        to: ["toti@pacificwavedigital.com", "steve@pacificwavedigital.com"],
        subject: `New Inquiry: ${service || "General"} - ${name}`,
        html: emailHtml,
        reply_to: email,
      }),
    });

    if (!emailResponse.ok) {
      const emailError = await emailResponse.text();
      console.error("Email error:", emailError);
      // Don't fail the request if email fails - the data is saved
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        id: submission.id,
        message: "Thank you! Your message has been sent successfully." 
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Contact form error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
