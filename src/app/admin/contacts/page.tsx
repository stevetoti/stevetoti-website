"use client";

import { useState, useEffect } from "react";
import { Mail, User, Building, DollarSign, CheckCircle, Clock, Eye } from "lucide-react";

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  company: string | null;
  service: string | null;
  budget: string | null;
  message: string;
  created_at: string;
  status: string;
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState<ContactSubmission | null>(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const token = localStorage.getItem("admin_auth");
      const response = await fetch("/api/admin/data?type=contacts&limit=100", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (response.ok) {
        const { data } = await response.json();
        setContacts(data || []);
      }
    } catch (error) {
      console.error("Failed to fetch contacts:", error);
    }
    setLoading(false);
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const token = localStorage.getItem("admin_auth");
      const response = await fetch("/api/admin/data", {
        method: "PATCH",
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          table: "contact_submissions",
          id,
          updates: { status },
        }),
      });
      
      if (response.ok) {
        setContacts(contacts.map(c => 
          c.id === id ? { ...c, status } : c
        ));
        if (selectedContact?.id === id) {
          setSelectedContact({ ...selectedContact, status });
        }
      }
    } catch (error) {
      console.error("Failed to update status:", error);
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs">New</span>;
      case "read":
        return <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs">Read</span>;
      case "contacted":
        return <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">Contacted</span>;
      default:
        return <span className="px-2 py-1 bg-gray-500/20 text-gray-400 rounded-full text-xs">{status}</span>;
    }
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Mail className="w-6 h-6 text-vibrantorange" />
            Contact Submissions
          </h1>
          <p className="text-gray-400 mt-1">{contacts.length} total submissions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contacts List */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-gray-800">
            <h2 className="font-semibold text-white">All Submissions</h2>
          </div>
          
          <div className="divide-y divide-gray-800 max-h-[600px] overflow-y-auto">
            {contacts.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No contact submissions yet
              </div>
            ) : (
              contacts.map((contact) => (
                <button
                  key={contact.id}
                  onClick={() => setSelectedContact(contact)}
                  className={`w-full p-4 text-left hover:bg-gray-800 transition-colors
                            ${selectedContact?.id === contact.id ? "bg-gray-800" : ""}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-white truncate">{contact.name}</span>
                        {getStatusBadge(contact.status)}
                      </div>
                      <div className="text-sm text-gray-400 truncate">{contact.email}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {contact.service || "General"} • {formatDate(contact.created_at)}
                      </div>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Contact Detail */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-gray-800">
            <h2 className="font-semibold text-white">Details</h2>
          </div>
          
          {selectedContact ? (
            <div className="p-4 space-y-4">
              {/* Status Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => updateStatus(selectedContact.id, "read")}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors
                            ${selectedContact.status === "read" 
                              ? "bg-yellow-500/20 text-yellow-400" 
                              : "bg-gray-800 text-gray-400 hover:bg-gray-700"}`}
                >
                  <Eye className="w-4 h-4" />
                  Mark as Read
                </button>
                <button
                  onClick={() => updateStatus(selectedContact.id, "contacted")}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors
                            ${selectedContact.status === "contacted" 
                              ? "bg-green-500/20 text-green-400" 
                              : "bg-gray-800 text-gray-400 hover:bg-gray-700"}`}
                >
                  <CheckCircle className="w-4 h-4" />
                  Mark as Contacted
                </button>
              </div>

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-xs text-gray-500">Name</div>
                    <div className="text-white">{selectedContact.name}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-xs text-gray-500">Email</div>
                    <a href={`mailto:${selectedContact.email}`} className="text-vibrantorange hover:underline">
                      {selectedContact.email}
                    </a>
                  </div>
                </div>
                
                {selectedContact.company && (
                  <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                    <Building className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-xs text-gray-500">Company</div>
                      <div className="text-white">{selectedContact.company}</div>
                    </div>
                  </div>
                )}
                
                {selectedContact.service && (
                  <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-xs text-gray-500">Service Interest</div>
                      <div className="text-white capitalize">{selectedContact.service.replace("-", " ")}</div>
                    </div>
                  </div>
                )}
                
                {selectedContact.budget && (
                  <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                    <DollarSign className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-xs text-gray-500">Budget</div>
                      <div className="text-white">{selectedContact.budget}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Message */}
              <div className="p-4 bg-gray-800 rounded-lg">
                <div className="text-xs text-gray-500 mb-2">Message</div>
                <p className="text-gray-300 whitespace-pre-wrap">{selectedContact.message}</p>
              </div>

              {/* Timestamp */}
              <div className="text-sm text-gray-500 text-center">
                Submitted on {formatDate(selectedContact.created_at)}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              Select a submission to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
