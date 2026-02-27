"use client";

import { useState, useEffect } from "react";
import { Video, User, Phone, MessageSquare, Clock, CheckCircle, XCircle } from "lucide-react";

interface VideoCall {
  id: string;
  visitor_id: string;
  visitor_name: string | null;
  visitor_phone: string | null;
  call_reason: string | null;
  source: string | null;
  status: string;
  lead_qualified: boolean | null;
  created_at: string;
}

export default function CallsPage() {
  const [calls, setCalls] = useState<VideoCall[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCall, setSelectedCall] = useState<VideoCall | null>(null);

  useEffect(() => {
    fetchCalls();
  }, []);

  const fetchCalls = async () => {
    try {
      const token = localStorage.getItem("admin_auth");
      const response = await fetch("/api/admin/data?type=calls&limit=100", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (response.ok) {
        const { data } = await response.json();
        setCalls(data || []);
      }
    } catch (error) {
      console.error("Failed to fetch calls:", error);
    }
    setLoading(false);
  };

  const updateQualified = async (id: string, qualified: boolean) => {
    try {
      const token = localStorage.getItem("admin_auth");
      const response = await fetch("/api/admin/data", {
        method: "PATCH",
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          table: "toti_chat_sessions",
          id,
          updates: { lead_qualified: qualified },
        }),
      });
      
      if (response.ok) {
        setCalls(calls.map(c => 
          c.id === id ? { ...c, lead_qualified: qualified } : c
        ));
        if (selectedCall?.id === id) {
          setSelectedCall({ ...selectedCall, lead_qualified: qualified });
        }
      }
    } catch (error) {
      console.error("Failed to update:", error);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
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
          <Video className="w-6 h-6 text-vibrantorange" />
          Video Call Logs
        </h1>
        <p className="text-gray-400 mt-1">{calls.length} video calls</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calls List */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-gray-800">
            <h2 className="font-semibold text-white">All Video Calls</h2>
          </div>
          
          <div className="divide-y divide-gray-800 max-h-[600px] overflow-y-auto">
            {calls.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No video calls yet
              </div>
            ) : (
              calls.map((call) => (
                <button
                  key={call.id}
                  onClick={() => setSelectedCall(call)}
                  className={`w-full p-4 text-left hover:bg-gray-800 transition-colors
                            ${selectedCall?.id === call.id ? "bg-gray-800" : ""}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                        <Video className="w-5 h-5 text-green-400" />
                      </div>
                      <div>
                        <div className="font-medium text-white">
                          {call.visitor_name || "Anonymous"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {call.visitor_phone || "No phone"}
                        </div>
                        <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                          <Clock className="w-3 h-3" />
                          {formatDate(call.created_at)}
                        </div>
                      </div>
                    </div>
                    {call.lead_qualified !== null && (
                      <div className={`px-2 py-1 rounded-full text-xs
                                    ${call.lead_qualified 
                                      ? "bg-green-500/20 text-green-400" 
                                      : "bg-red-500/20 text-red-400"}`}>
                        {call.lead_qualified ? "Qualified" : "Not Qualified"}
                      </div>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Call Detail */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-gray-800">
            <h2 className="font-semibold text-white">Call Details</h2>
          </div>
          
          {selectedCall ? (
            <div className="p-4 space-y-4">
              {/* Qualification Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => updateQualified(selectedCall.id, true)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors
                            ${selectedCall.lead_qualified === true 
                              ? "bg-green-500/20 text-green-400 border border-green-500/30" 
                              : "bg-gray-800 text-gray-400 hover:bg-gray-700"}`}
                >
                  <CheckCircle className="w-4 h-4" />
                  Qualified Lead
                </button>
                <button
                  onClick={() => updateQualified(selectedCall.id, false)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors
                            ${selectedCall.lead_qualified === false 
                              ? "bg-red-500/20 text-red-400 border border-red-500/30" 
                              : "bg-gray-800 text-gray-400 hover:bg-gray-700"}`}
                >
                  <XCircle className="w-4 h-4" />
                  Not Qualified
                </button>
              </div>

              {/* Call Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-xs text-gray-500">Visitor Name</div>
                    <div className="text-white">{selectedCall.visitor_name || "Anonymous"}</div>
                  </div>
                </div>
                
                {selectedCall.visitor_phone && (
                  <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-xs text-gray-500">Phone Number</div>
                      <a href={`tel:${selectedCall.visitor_phone}`} className="text-vibrantorange hover:underline">
                        {selectedCall.visitor_phone}
                      </a>
                    </div>
                  </div>
                )}
                
                {selectedCall.call_reason && (
                  <div className="flex items-start gap-3 p-3 bg-gray-800 rounded-lg">
                    <MessageSquare className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <div className="text-xs text-gray-500">Call Reason</div>
                      <p className="text-white whitespace-pre-wrap">{selectedCall.call_reason}</p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-xs text-gray-500">Call Time</div>
                    <div className="text-white">{formatDate(selectedCall.created_at)}</div>
                  </div>
                </div>

                {selectedCall.source && (
                  <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                    <div className="w-5 h-5 text-gray-400 flex items-center justify-center text-sm">🌐</div>
                    <div>
                      <div className="text-xs text-gray-500">Source</div>
                      <div className="text-white">{selectedCall.source}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              Select a call to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
