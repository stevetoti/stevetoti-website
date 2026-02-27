import { NextRequest, NextResponse } from "next/server";

interface Message {
  role: "user" | "assistant";
  content: string;
}

// Visitor-focused system prompt
const VISITOR_SYSTEM_PROMPT = `You are Toti, Steve's AI assistant on his personal website stevetoti.com.

## YOUR ROLE
You help website visitors learn about Stephen's services and determine if they'd be a good fit for working together. You're friendly, helpful, and knowledgeable about Stephen's offerings.

## STEPHEN'S SERVICES
1. **AI Automation** - Custom chatbots, workflow automation, AI-powered content generation, business process automation
2. **Web Development** - Modern websites, web apps, e-commerce, React/Next.js applications
3. **Business Systems** - CRM, inventory management, custom internal tools, dashboards
4. **Consulting** - AI strategy, digital transformation, technology stack decisions
5. **Training** - AI/automation workshops, web development courses, team upskilling

## STEPHEN'S COMPANIES
- **Pacific Wave Digital** (Vanuatu) - Full-service digital agency
- **Global Digital Prime** (USA) - Enterprise AI solutions
- **Rapid Entrepreneurs** (Ghana) - Startup acceleration & training

## PORTFOLIO HIGHLIGHTS
- **Trade Farm** - AI agricultural trading platform with $2M+ in transactions, 500+ users
- **Pacific Resort Group** - Booking system that increased reservations by 40%
- **MEDD-SIM** - Healthcare simulation platform for 2,000+ medical students
- **VanuConnect** - Business messaging platform for Vanuatu
- 100+ projects delivered across 15+ countries

## BOOKING INFO
Discovery calls are FREE 30-minute sessions to discuss potential projects.
Self-booking link: https://cal.com/stevetotibooking/discovery-call-toti

## ASSISTED BOOKING (When customers ask you to book FOR them)
If a visitor says things like "can you book for me", "book it for me", "schedule it for me", or prefers not to book themselves:
1. Say "I'd be happy to book that for you! Let me collect a few details:"
2. Ask for their **Full Name**
3. Ask for their **Email Address** 
4. Ask for their **Phone Number**
5. Ask for their **Preferred Date/Time** (give options like "Tomorrow morning", "Next week", "ASAP")
6. Once you have all 4 pieces of info, say: "Perfect! I've captured your details. Stephen or his team will confirm your booking within 24 hours via email. Is there anything specific you'd like to discuss on the call?"

IMPORTANT: Collect info one question at a time, not all at once. Be conversational.

## PERSONALITY
- Friendly and approachable, not corporate
- Helpful without being pushy
- Knowledgeable about AI and web development
- Encourages video calls or discovery calls for deeper conversations
- Concise but thorough answers

## IMPORTANT RULES
- You're chatting with WEBSITE VISITORS, not Steve
- Don't pretend to access emails, calendars, or internal systems
- Focus on helping visitors understand services and booking calls
- If they want to discuss a project in depth, suggest the video call feature or booking a discovery call
- Keep responses conversational and under 150 words unless more detail is specifically requested
- Use emojis sparingly but naturally
- Always provide a clear next step (book call, ask another question, upgrade to video)`;

export async function POST(request: NextRequest) {
  const anthropicKey = process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY;

  if (!anthropicKey) {
    // If no API key, use intelligent fallback
    try {
      const body = await request.json();
      const { messages } = body as { messages: Message[] };
      const lastMessage = messages[messages.length - 1]?.content || "";
      
      return NextResponse.json({
        message: getFallbackResponse(lastMessage),
        fallback: true,
      });
    } catch {
      return NextResponse.json(
        { error: "Chat service not configured" },
        { status: 500 }
      );
    }
  }

  try {
    const body = await request.json();
    const { messages } = body as { messages: Message[] };

    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { error: "No messages provided" },
        { status: 400 }
      );
    }

    // Call Claude directly with visitor context
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": anthropicKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 500,
        system: VISITOR_SYSTEM_PROMPT,
        messages: messages.map(m => ({
          role: m.role,
          content: m.content,
        })),
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Claude API error:", response.status, error);
      
      // Fallback to local responses
      const lastMessage = messages[messages.length - 1]?.content || "";
      return NextResponse.json({
        message: getFallbackResponse(lastMessage),
        fallback: true,
      });
    }

    const data = await response.json();
    const textContent = data.content?.find((block: { type: string }) => block.type === "text");
    
    return NextResponse.json({ 
      message: textContent?.text || getFallbackResponse(messages[messages.length - 1]?.content || ""),
      usage: data.usage,
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Failed to process chat" },
      { status: 500 }
    );
  }
}

// Intelligent fallback responses
function getFallbackResponse(userMessage: string): string {
  const lowerMessage = userMessage.toLowerCase();

  const responses: Record<string, string> = {
    "ai automation": "Steve specializes in AI automation that saves businesses 20+ hours per week! This includes custom chatbots, workflow automation, and AI-powered content generation. Would you like to upgrade to a video call to discuss your specific needs?",
    "automation": "Steve specializes in AI automation that saves businesses 20+ hours per week! This includes custom chatbots, workflow automation, and AI-powered content generation. Would you like to upgrade to a video call to discuss your specific needs?",
    "chatbot": "Steve builds custom AI chatbots for businesses - from customer support bots to sales assistants. They can handle inquiries 24/7 and integrate with your existing tools. Want to discuss your chatbot needs?",
    "services": "Stephen offers 5 core services:\n\n🤖 AI Automation\n💻 Web Development\n📊 Business Systems\n🎯 Consulting\n🎓 Training\n\nEach is tailored to help businesses scale efficiently. Which interests you most?",
    "what do you do": "Stephen offers 5 core services:\n\n🤖 AI Automation\n💻 Web Development\n📊 Business Systems\n🎯 Consulting\n🎓 Training\n\nEach is tailored to help businesses scale efficiently. Which interests you most?",
    "offer": "Stephen offers 5 core services:\n\n🤖 AI Automation\n💻 Web Development\n📊 Business Systems\n🎯 Consulting\n🎓 Training\n\nEach is tailored to help businesses scale efficiently. Which interests you most?",
    "consultation": "Great choice! You can book a free 30-minute discovery call with Steve at https://cal.com/stevetotibooking/discovery-call-toti\n\nOr upgrade to a video call right here to chat face-to-face!",
    "discovery": "Great choice! You can book a free 30-minute discovery call with Steve at https://cal.com/stevetotibooking/discovery-call-toti\n\nOr upgrade to a video call right here to chat face-to-face!",
    "portfolio": "Stephen has delivered 100+ projects across 15+ countries! Some highlights:\n\n• Trade Farm - AI agricultural platform ($2M+ transactions)\n• Pacific Resort Group - 40% booking increase\n• Healthcare Simulation - 2,000+ medical students\n\nWant to discuss a similar project?",
    "projects": "Stephen has delivered 100+ projects across 15+ countries! Some highlights:\n\n• Trade Farm - AI agricultural platform ($2M+ transactions)\n• Pacific Resort Group - 40% booking increase\n• Healthcare Simulation - 2,000+ medical students\n\nWant to discuss a similar project?",
    "book for me": "I'd be happy to book that for you! Let me collect a few details.\n\nFirst, what's your **full name**?",
    "book it for me": "I'd be happy to book that for you! Let me collect a few details.\n\nFirst, what's your **full name**?",
    "can you book": "Absolutely! I can book a discovery call for you. Let me get a few details.\n\nWhat's your **full name**?",
    "schedule for me": "I'd be happy to schedule that for you! Let me collect some info.\n\nWhat's your **full name**?",
    "book": "You have two options:\n\n1️⃣ **Self-book**: https://cal.com/stevetotibooking/discovery-call-toti\n\n2️⃣ **I book for you**: Just say 'book for me' and I'll collect your details!\n\nWhich do you prefer?",
    "schedule": "You have two options:\n\n1️⃣ **Self-book**: https://cal.com/stevetotibooking/discovery-call-toti\n\n2️⃣ **I book for you**: Just say 'book for me' and I'll collect your details!\n\nWhich do you prefer?",
    "call": "You have two options:\n\n1️⃣ **Self-book**: https://cal.com/stevetotibooking/discovery-call-toti\n\n2️⃣ **I book for you**: Just say 'book for me' and I'll collect your details!\n\nWhich do you prefer?",
    "video": "Great idea! Tap the 'Upgrade to Video Call' button to start a face-to-face conversation. I'll just need a few quick details first.",
    "hello": "👋 Hi there! I'm Toti, Steve's AI assistant. I can help you learn about AI automation, web development, and other services. What brings you here today?",
    "hi": "👋 Hello! I'm Toti. I can help you explore Stephen's services or book a discovery call. What would you like to know?",
    "hey": "👋 Hey! I'm Toti, Steve's AI assistant. How can I help you today?",
    "price": "Pricing varies by project scope and complexity. Most engagements start with a free discovery call to understand your needs and provide an accurate quote. Would you like to book one?",
    "cost": "Investment depends on the project complexity and timeline. A free discovery call is the best way to get an accurate estimate for your specific needs. Want to schedule one?",
    "how much": "Pricing varies by project scope. A free discovery call is the best way to get a quote for your specific needs. Book here: https://cal.com/stevetotibooking/discovery-call-toti",
    "web": "Steve builds modern, fast websites and web applications using React, Next.js, and other cutting-edge technologies. From landing pages to complex web apps - what kind of project do you have in mind?",
    "website": "Steve builds modern, fast websites and web applications using React, Next.js, and other cutting-edge technologies. From landing pages to complex web apps - what kind of project do you have in mind?",
    "app": "Steve builds web applications, mobile-responsive sites, and business systems. Whether it's a customer portal, dashboard, or e-commerce platform - he can help. What are you looking to build?",
    "thanks": "You're welcome! Feel free to ask anything else, or book a discovery call when you're ready: https://cal.com/stevetotibooking/discovery-call-toti",
    "thank you": "You're welcome! Feel free to ask anything else, or book a discovery call when you're ready: https://cal.com/stevetotibooking/discovery-call-toti",
    "vanuatu": "Yes! Steve is based in Port Vila, Vanuatu, but works with clients globally across 15+ countries. His companies span Vanuatu, USA, and Ghana. Time zone differences are never an issue!",
    "location": "Steve is based in Port Vila, Vanuatu, but works with clients globally across 15+ countries. His companies: Pacific Wave Digital (Vanuatu), Global Digital Prime (USA), Rapid Entrepreneurs (Ghana).",
    "contact": "You can reach Steve by:\n\n📞 Booking a call: cal.com/stevetotibooking/discovery-call-toti\n📧 Email: totinarh24@gmail.com\n💬 Or keep chatting with me!\n\nWhat works best for you?",
  };

  for (const [key, value] of Object.entries(responses)) {
    if (lowerMessage.includes(key)) {
      return value;
    }
  }

  return "Thanks for your message! I'd love to help you learn more about how Stephen can help your business. You can:\n\n• Ask about specific services (AI automation, web development, etc.)\n• Book a free discovery call at cal.com/stevetotibooking/discovery-call-toti\n• Upgrade to video call for a face-to-face chat\n\nWhat would you like to explore?";
}
