"use client";

import { useState, useEffect } from "react";
import { MessageSquare, User, Clock, Bot, ChevronRight } from "lucide-react";

interface ChatSession {
  id: string;
  visitor_id: string;
  visitor_name: string | null;
  source: string | null;
  status: string;
  created_at: string;
}

interface ChatMessage {
  id: string;
  session_id: string;
  role: string;
  content: string;
  created_at: string;
}

export default function ChatsPage() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const token = localStorage.getItem("admin_auth");
      const response = await fetch("/api/admin/data?type=chats&limit=100", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (response.ok) {
        const { data } = await response.json();
        setSessions(data || []);
      }
    } catch (error) {
      console.error("Failed to fetch sessions:", error);
    }
    setLoading(false);
  };

  const fetchMessages = async (sessionId: string) => {
    setMessagesLoading(true);
    try {
      const token = localStorage.getItem("admin_auth");
      const response = await fetch(`/api/admin/data?type=chat-messages&sessionId=${sessionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (response.ok) {
        const { data } = await response.json();
        setMessages(data || []);
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
    setMessagesLoading(false);
  };

  const selectSession = (session: ChatSession) => {
    setSelectedSession(session);
    fetchMessages(session.id);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-vibrantorange border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-vibrantorange" />
          Chat Transcripts
        </h1>
        <p className="text-gray-400 mt-1">{sessions.length} chat sessions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sessions List */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-gray-800">
            <h2 className="font-semibold text-white">Chat Sessions</h2>
          </div>
          
          <div className="divide-y divide-gray-800 max-h-[600px] overflow-y-auto">
            {sessions.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No chat sessions yet
              </div>
            ) : (
              sessions.map((session) => (
                <button
                  key={session.id}
                  onClick={() => selectSession(session)}
                  className={`w-full p-4 text-left hover:bg-gray-800 transition-colors
                            ${selectedSession?.id === session.id ? "bg-gray-800" : ""}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <div className="font-medium text-white">
                          {session.visitor_name || "Anonymous Visitor"}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center gap-2">
                          <Clock className="w-3 h-3" />
                          {formatDate(session.created_at)}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-500" />
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat Transcript */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-gray-800">
            <h2 className="font-semibold text-white">
              {selectedSession 
                ? `Conversation with ${selectedSession.visitor_name || "Anonymous"}`
                : "Transcript"
              }
            </h2>
          </div>
          
          {messagesLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-6 h-6 border-2 border-vibrantorange border-t-transparent rounded-full animate-spin" />
            </div>
          ) : selectedSession ? (
            <div className="p-4 max-h-[600px] overflow-y-auto space-y-4">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  No messages in this session
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.role === "assistant" ? "" : "flex-row-reverse"}`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                                  ${message.role === "assistant" 
                                    ? "bg-vibrantorange/20" 
                                    : "bg-blue-500/20"}`}
                    >
                      {message.role === "assistant" 
                        ? <Bot className="w-4 h-4 text-vibrantorange" />
                        : <User className="w-4 h-4 text-blue-400" />
                      }
                    </div>
                    <div className={`flex-1 max-w-[80%] ${message.role === "assistant" ? "" : "text-right"}`}>
                      <div className={`inline-block p-3 rounded-xl 
                                    ${message.role === "assistant" 
                                      ? "bg-gray-800 text-gray-200" 
                                      : "bg-blue-600 text-white"}`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {formatTime(message.created_at)}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              Select a session to view the transcript
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
