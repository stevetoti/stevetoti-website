"use client";

import { useState, useEffect } from "react";
import { 
  Mail, 
  MessageSquare, 
  Video, 
  TrendingUp,
  Calendar,
  Users,
  Clock,
  FileText,
  Search
} from "lucide-react";

interface Stats {
  contacts: { total: number; today: number; week: number; month: number };
  chats: { total: number; today: number; week: number; month: number };
  calls: { total: number; today: number; week: number; month: number };
  newsletter: { total: number; today: number; week: number; month: number };
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("admin_auth");
      const response = await fetch("/api/admin/data?type=stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
    setLoading(false);
  };

  const statCards = [
    {
      title: "Contact Submissions",
      icon: Mail,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-500/10",
      data: stats?.contacts,
    },
    {
      title: "Chat Sessions",
      icon: MessageSquare,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-500/10",
      data: stats?.chats,
    },
    {
      title: "Video Calls",
      icon: Video,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-500/10",
      data: stats?.calls,
    },
    {
      title: "Newsletter Subscribers",
      icon: Users,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-500/10",
      data: stats?.newsletter,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 mt-1">Welcome back! Here&apos;s your overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((card) => (
          <div
            key={card.title}
            className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-colors"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${card.bgColor}`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
              <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${card.color} text-white text-sm font-medium`}>
                {loading ? "..." : card.data?.total || 0} total
              </div>
            </div>
            
            <h3 className="text-lg font-semibold text-white mb-4">{card.title}</h3>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">
                  {loading ? "-" : card.data?.today || 0}
                </div>
                <div className="text-xs text-gray-500">Today</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">
                  {loading ? "-" : card.data?.week || 0}
                </div>
                <div className="text-xs text-gray-500">This Week</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">
                  {loading ? "-" : card.data?.month || 0}
                </div>
                <div className="text-xs text-gray-500">This Month</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-vibrantorange" />
          Quick Actions
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <a
            href="/admin/contacts"
            className="flex items-center gap-4 p-4 bg-gray-800 rounded-xl hover:bg-gray-750 transition-colors"
          >
            <div className="p-3 rounded-lg bg-orange-500/20">
              <Mail className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <div className="font-medium text-white">View Contacts</div>
              <div className="text-sm text-gray-500">Review new submissions</div>
            </div>
          </a>
          
          <a
            href="/admin/chats"
            className="flex items-center gap-4 p-4 bg-gray-800 rounded-xl hover:bg-gray-750 transition-colors"
          >
            <div className="p-3 rounded-lg bg-blue-500/20">
              <MessageSquare className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="font-medium text-white">Chat Transcripts</div>
              <div className="text-sm text-gray-500">Read visitor conversations</div>
            </div>
          </a>
          
          <a
            href="/admin/calls"
            className="flex items-center gap-4 p-4 bg-gray-800 rounded-xl hover:bg-gray-750 transition-colors"
          >
            <div className="p-3 rounded-lg bg-green-500/20">
              <Video className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <div className="font-medium text-white">Video Call Logs</div>
              <div className="text-sm text-gray-500">View call history</div>
            </div>
          </a>

          <a
            href="/admin/newsletter"
            className="flex items-center gap-4 p-4 bg-gray-800 rounded-xl hover:bg-gray-750 transition-colors"
          >
            <div className="p-3 rounded-lg bg-purple-500/20">
              <Users className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <div className="font-medium text-white">Newsletter</div>
              <div className="text-sm text-gray-500">Manage subscribers</div>
            </div>
          </a>

          <a
            href="/admin/blog"
            className="flex items-center gap-4 p-4 bg-gray-800 rounded-xl hover:bg-gray-750 transition-colors"
          >
            <div className="p-3 rounded-lg bg-cyan-500/20">
              <FileText className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <div className="font-medium text-white">Blog Management</div>
              <div className="text-sm text-gray-500">Create and edit posts</div>
            </div>
          </a>

          <a
            href="/admin/seo"
            className="flex items-center gap-4 p-4 bg-gray-800 rounded-xl hover:bg-gray-750 transition-colors"
          >
            <div className="p-3 rounded-lg bg-yellow-500/20">
              <Search className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <div className="font-medium text-white">SEO Hub</div>
              <div className="text-sm text-gray-500">Manage SEO settings</div>
            </div>
          </a>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-vibrantorange" />
            Recent Activity
          </h3>
          <div className="space-y-3 text-gray-400">
            <p className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Dashboard updated in real-time
            </p>
            <p className="text-sm">
              Check the individual sections for detailed information about each interaction.
            </p>
          </div>
        </div>
        
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-vibrantorange" />
            Lead Conversion
          </h3>
          <div className="space-y-3 text-gray-400">
            <p className="text-sm">
              Track leads from contact form, chat, and video calls. Mark leads as contacted 
              to track your follow-up progress.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
