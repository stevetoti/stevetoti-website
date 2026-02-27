-- Toti Chat System Tables
-- TotiRoom Supabase Project

-- Chat Sessions table
CREATE TABLE IF NOT EXISTS toti_chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id TEXT, -- Anonymous visitor identifier
  visitor_name TEXT,
  visitor_email TEXT,
  source TEXT DEFAULT 'website', -- website, cal.com, etc.
  status TEXT DEFAULT 'active', -- active, ended, qualified
  qualified BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ
);

-- Chat Messages table
CREATE TABLE IF NOT EXISTS toti_chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES toti_chat_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL, -- 'user' or 'assistant'
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}', -- For video chat transcripts, etc.
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Knowledge Base table (Info about Steve's business)
CREATE TABLE IF NOT EXISTS toti_knowledge_base (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL, -- 'services', 'pricing', 'about', 'faq', 'portfolio'
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  keywords TEXT[], -- For search/matching
  priority INTEGER DEFAULT 0, -- Higher = more important
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cal.com Booking Notifications table
CREATE TABLE IF NOT EXISTS toti_booking_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cal_event_id TEXT,
  event_type TEXT, -- 'discovery-call-toti', 'strategy-session', etc.
  attendee_name TEXT,
  attendee_email TEXT,
  scheduled_at TIMESTAMPTZ,
  status TEXT DEFAULT 'scheduled', -- scheduled, completed, cancelled, no-show
  notes TEXT,
  session_id UUID REFERENCES toti_chat_sessions(id), -- Link to chat if exists
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_chat_sessions_visitor ON toti_chat_sessions(visitor_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_status ON toti_chat_sessions(status);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session ON toti_chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_base_category ON toti_knowledge_base(category);
CREATE INDEX IF NOT EXISTS idx_knowledge_base_keywords ON toti_knowledge_base USING GIN(keywords);

-- Enable RLS
ALTER TABLE toti_chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE toti_chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE toti_knowledge_base ENABLE ROW LEVEL SECURITY;
ALTER TABLE toti_booking_notifications ENABLE ROW LEVEL SECURITY;

-- Policies for anonymous access (chat from website)
CREATE POLICY "Allow insert chat sessions" ON toti_chat_sessions
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow insert chat messages" ON toti_chat_messages
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow read knowledge base" ON toti_knowledge_base
  FOR SELECT TO anon USING (active = true);

-- Policies for service role (full access)
CREATE POLICY "Service role full access sessions" ON toti_chat_sessions
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access messages" ON toti_chat_messages
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access knowledge" ON toti_knowledge_base
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access bookings" ON toti_booking_notifications
  FOR ALL TO service_role USING (true) WITH CHECK (true);
