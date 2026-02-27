import { NextRequest, NextResponse } from "next/server";

// TotiRoom Supabase chat endpoint
const TOTIROOM_CHAT_URL = "https://rndegttgwtpkbjtvjgnc.supabase.co/functions/v1/chat";

interface Message {
  role: "user" | "assistant";
  content: string;
}

// Visitor-focused system context (no admin tools)
const VISITOR_CONTEXT = `You are Toti, Steve's AI assistant on his personal website stevetoti.com.

## YOUR ROLE
You help visitors learn about Stephen's services and determine if they'd be a good fit for working together.
You're friendly, helpful, and knowledgeable about Stephen's offerings.

## STEPHEN'S SERVICES
1. **AI Automation** - Custom chatbots, workflow automation, AI-powered content
2. **Web Development** - Modern websites, web apps, e-commerce
3. **Business Systems** - CRM, inventory, custom business tools
4. **Consulting** - AI strategy, digital transformation
5. **Training** - AI/automation workshops and courses

## PORTFOLIO HIGHLIGHTS
- Trade Farm - AI agricultural platform ($2M+ in transactions)
- Pacific Resort Group - 40% booking increase
- MEDD-SIM - Healthcare simulation for 2,000+ medical students
- 100+ projects across 15+ countries

## BOOKING INFO
Discovery calls are free 30-minute sessions to discuss potential projects.
Link: https://cal.com/stevetotibooking/discovery-call-toti

## PERSONALITY
- Friendly and approachable
- Helpful without being pushy
- Knowledgeable about AI and web development
- Encourages video calls for deeper conversations

## IMPORTANT
- You're chatting with website visitors, NOT Steve
- Don't access emails, calendars, or internal systems
- Focus on helping visitors understand services and booking calls
- If they want to discuss a project in depth, suggest upgrading to video call`;

export async function POST(request: NextRequest) {
  const supabaseAnonKey = process.env.SUPABASE_TOTIROOM_ANON_KEY;

  if (!supabaseAnonKey) {
    console.error("SUPABASE_TOTIROOM_ANON_KEY not configured");
    return NextResponse.json(
      { error: "Chat service not configured" },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { messages, sessionId } = body as { messages: Message[]; sessionId: string };

    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { error: "No messages provided" },
        { status: 400 }
      );
    }

    // Inject visitor context as first system message
    const augmentedMessages = messages.map(m => ({
      ...m,
      // Prepend context hint for visitor queries
      content: m.role === "user" ? m.content : m.content
    }));

    // Call TotiRoom chat function
    const response = await fetch(TOTIROOM_CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${supabaseAnonKey}`,
      },
      body: JSON.stringify({
        messages: augmentedMessages,
        sessionId: sessionId || `visitor-${Date.now()}`,
        includeContext: false, // Don't include admin dashboard context
        visitorContext: VISITOR_CONTEXT,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("TotiRoom chat error:", response.status, error);
      
      // Fallback to local responses if TotiRoom is down
      return NextResponse.json({
        message: getFallbackResponse(messages[messages.length - 1]?.content || ""),
        fallback: true,
      });
    }

    const data = await response.json();
    return NextResponse.json({ 
      message: data.message,
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

// Fallback responses when TotiRoom is unavailable
function getFallbackResponse(userMessage: string): string {
  const lowerMessage = userMessage.toLowerCase();

  const responses: Record<string, string> = {
    "ai automation": "Steve specializes in AI automation that saves businesses 20+ hours per week! This includes custom chatbots, workflow automation, and AI-powered content generation. Would you like to upgrade to a video call to discuss your specific needs?",
    "services": "Stephen offers 5 core services:\n\n🤖 AI Automation\n💻 Web Development\n📊 Business Systems\n🎯 Consulting\n🎓 Training\n\nEach is tailored to help businesses scale efficiently. Which interests you most?",
    "consultation": "Great choice! You can book a free 30-minute discovery call with Steve at https://cal.com/stevetotibooking/discovery-call-toti\n\nOr upgrade to a video call right here to chat face-to-face!",
    "portfolio": "Stephen has delivered 100+ projects across 15+ countries! Some highlights:\n\n• Trade Farm - AI agricultural platform ($2M+ transactions)\n• Pacific Resort Group - 40% booking increase\n• Healthcare Simulation - 2,000+ medical students\n\nWant to discuss a similar project?",
    "book": "You can book a free discovery call at https://cal.com/stevetotibooking/discovery-call-toti\n\nOr tap 'Upgrade to Video Call' above for an instant face-to-face chat!",
    "video": "Great idea! Tap the 'Upgrade to Video Call' button to start a face-to-face conversation. I'll need just a few details first.",
    "hello": "👋 Hi there! I'm Toti, Steve's AI assistant. I can help you learn about AI automation, web development, and other services. What brings you here today?",
    "hi": "👋 Hello! I'm Toti. I can help you explore Stephen's services or book a discovery call. What would you like to know?",
    "price": "Pricing varies by project scope. Most engagements start with a free discovery call to understand your needs. Would you like to book one?",
    "cost": "Investment depends on the project complexity. A free discovery call is the best way to get an accurate estimate. Want to schedule one?",
  };

  for (const [key, value] of Object.entries(responses)) {
    if (lowerMessage.includes(key)) {
      return value;
    }
  }

  return "Thanks for your message! I'd love to help you learn more about how Stephen can help your business. You can:\n\n• Ask about specific services (AI automation, web development, etc.)\n• Book a discovery call at cal.com/stevetotibooking\n• Upgrade to video call for a face-to-face chat\n\nWhat would you like to explore?";
}
