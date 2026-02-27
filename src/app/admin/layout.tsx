"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Mail, 
  MessageSquare, 
  Video, 
  LogOut,
  Menu,
  X,
  Lock,
  Users,
  Search,
  FileText
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/contacts", label: "Contact Submissions", icon: Mail },
  { href: "/admin/chats", label: "Chat Transcripts", icon: MessageSquare },
  { href: "/admin/calls", label: "Video Calls", icon: Video },
  { href: "/admin/newsletter", label: "Newsletter", icon: Users },
  { href: "/admin/blog", label: "Blog Management", icon: FileText },
  { href: "/admin/seo", label: "SEO Hub", icon: Search },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Check if already authenticated
    const authToken = localStorage.getItem("admin_auth");
    if (authToken) {
      verifyToken(authToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  const verifyToken = async (token: string) => {
    try {
      const response = await fetch("/api/admin/verify", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem("admin_auth");
      }
    } catch {
      localStorage.removeItem("admin_auth");
    }
    setIsLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem("admin_auth", data.token);
        setIsAuthenticated(true);
      } else {
        setError(data.error || "Invalid password");
      }
    } catch {
      setError("Login failed. Please try again.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_auth");
    setIsAuthenticated(false);
    setPassword("");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-vibrantorange border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-vibrantorange/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-vibrantorange" />
              </div>
              <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-gray-400 mt-2">Enter your admin password to continue</p>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Admin Password"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white 
                           placeholder-gray-500 focus:outline-none focus:border-vibrantorange"
                  autoFocus
                />
              </div>
              
              {error && (
                <p className="text-red-400 text-sm text-center">{error}</p>
              )}
              
              <button
                type="submit"
                className="w-full py-3 bg-vibrantorange hover:bg-orange-600 text-white font-semibold 
                         rounded-xl transition-colors"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 pt-0">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-20 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 bg-gray-800 rounded-lg text-white"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-gray-900 border-r border-gray-800 
                   transform transition-transform duration-200 z-40
                   ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        <div className="p-6">
          <h2 className="text-xl font-bold text-white mb-2">Admin Panel</h2>
          <p className="text-gray-500 text-sm">stevetoti.com</p>
        </div>

        <nav className="px-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors
                          ${isActive 
                            ? "bg-vibrantorange text-white" 
                            : "text-gray-400 hover:bg-gray-800 hover:text-white"}`}
              >
                <item.icon size={20} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-6 left-4 right-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-gray-400 
                     hover:bg-red-500/20 hover:text-red-400 transition-colors"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="lg:ml-64 min-h-screen p-6 pt-20 lg:pt-6">
        {children}
      </main>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
