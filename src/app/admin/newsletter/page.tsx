"use client";

import { useState, useEffect } from "react";
import { Mail, Users, Calendar, Trash2, Download, Search } from "lucide-react";

interface Subscriber {
  id: string;
  email: string;
  name: string | null;
  status: string;
  source: string;
  subscribed_at: string;
  created_at: string;
}

export default function NewsletterPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      const token = localStorage.getItem("admin_auth");
      const response = await fetch("/api/admin/data?type=newsletter&limit=500", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (response.ok) {
        const { data } = await response.json();
        setSubscribers(data || []);
      }
    } catch (error) {
      console.error("Failed to fetch subscribers:", error);
    }
    setLoading(false);
  };

  const deleteSubscriber = async (id: string) => {
    if (!confirm("Are you sure you want to remove this subscriber?")) return;
    
    try {
      const token = localStorage.getItem("admin_auth");
      const response = await fetch("/api/admin/data", {
        method: "DELETE",
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          table: "newsletter_subscribers",
          id,
        }),
      });
      
      if (response.ok) {
        setSubscribers(subscribers.filter(s => s.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete subscriber:", error);
    }
  };

  const exportCSV = () => {
    const headers = ["Email", "Name", "Status", "Subscribed At"];
    const rows = subscribers.map(s => [
      s.email,
      s.name || "",
      s.status,
      new Date(s.subscribed_at).toLocaleDateString(),
    ]);
    
    const csv = [headers, ...rows].map(row => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `newsletter-subscribers-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const filteredSubscribers = subscribers.filter(s =>
    s.email.toLowerCase().includes(search.toLowerCase()) ||
    (s.name && s.name.toLowerCase().includes(search.toLowerCase()))
  );

  const activeCount = subscribers.filter(s => s.status === "active").length;

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
            Newsletter Subscribers
          </h1>
          <p className="text-gray-400 mt-1">{activeCount} active subscribers</p>
        </div>
        <button
          onClick={exportCSV}
          className="flex items-center gap-2 px-4 py-2 bg-vibrantorange hover:bg-orange-600 
                   text-white rounded-xl transition-colors"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Users className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{activeCount}</div>
              <div className="text-sm text-gray-500">Active</div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Mail className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{subscribers.length}</div>
              <div className="text-sm text-gray-500">Total</div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500/20 rounded-lg">
              <Calendar className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">
                {subscribers.filter(s => {
                  const weekAgo = new Date();
                  weekAgo.setDate(weekAgo.getDate() - 7);
                  return new Date(s.subscribed_at) > weekAgo;
                }).length}
              </div>
              <div className="text-sm text-gray-500">This Week</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
        <input
          type="text"
          placeholder="Search subscribers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-gray-900 border border-gray-800 rounded-xl 
                   text-white placeholder-gray-500 focus:outline-none focus:border-vibrantorange"
        />
      </div>

      {/* Subscribers List */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Email</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Name</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Status</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Subscribed</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredSubscribers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    {search ? "No subscribers match your search" : "No subscribers yet"}
                  </td>
                </tr>
              ) : (
                filteredSubscribers.map((subscriber) => (
                  <tr key={subscriber.id} className="hover:bg-gray-800/50">
                    <td className="px-6 py-4">
                      <a href={`mailto:${subscriber.email}`} className="text-vibrantorange hover:underline">
                        {subscriber.email}
                      </a>
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      {subscriber.name || <span className="text-gray-600">—</span>}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs
                                     ${subscriber.status === "active" 
                                       ? "bg-green-500/20 text-green-400" 
                                       : "bg-gray-500/20 text-gray-400"}`}>
                        {subscriber.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm">
                      {formatDate(subscriber.subscribed_at)}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => deleteSubscriber(subscriber.id)}
                        className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 
                                 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
