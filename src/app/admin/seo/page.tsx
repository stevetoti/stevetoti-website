"use client";

import { useState, useEffect } from "react";
import { Search, Globe, BarChart3, Save, Check } from "lucide-react";

interface SEOSettings {
  site_title: string;
  site_description: string;
  ga4_measurement_id: string;
  google_search_console_id: string;
  facebook_pixel_id: string;
  twitter_handle: string;
  og_image: string;
}

export default function SEOHubPage() {
  const [settings, setSettings] = useState<SEOSettings>({
    site_title: "",
    site_description: "",
    ga4_measurement_id: "",
    google_search_console_id: "",
    facebook_pixel_id: "",
    twitter_handle: "",
    og_image: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem("admin_auth");
      const response = await fetch("/api/admin/data?type=seo-settings", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (response.ok) {
        const { data } = await response.json();
        if (data) {
          setSettings(prev => ({ ...prev, ...data }));
        }
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error);
    }
    setLoading(false);
  };

  const saveSettings = async () => {
    setSaving(true);
    setSaved(false);
    
    try {
      const token = localStorage.getItem("admin_auth");
      const response = await fetch("/api/admin/data", {
        method: "PUT",
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "seo-settings",
          settings,
        }),
      });
      
      if (response.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (error) {
      console.error("Failed to save settings:", error);
    }
    setSaving(false);
  };

  const handleChange = (field: keyof SEOSettings, value: string) => {
    setSettings(prev => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-vibrantorange border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Search className="w-6 h-6 text-vibrantorange" />
            SEO Hub
          </h1>
          <p className="text-gray-400 mt-1">Manage site-wide SEO and analytics settings</p>
        </div>
        <button
          onClick={saveSettings}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-vibrantorange hover:bg-orange-600 
                   disabled:opacity-50 text-white rounded-xl transition-colors"
        >
          {saving ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : saved ? (
            <Check className="w-4 h-4" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saved ? "Saved!" : "Save Changes"}
        </button>
      </div>

      {/* Site Meta */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5 text-vibrantorange" />
          Site Information
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Site Title
            </label>
            <input
              type="text"
              value={settings.site_title}
              onChange={(e) => handleChange("site_title", e.target.value)}
              placeholder="Steve Toti - Digital Solutions"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white 
                       placeholder-gray-500 focus:outline-none focus:border-vibrantorange"
            />
            <p className="text-xs text-gray-500 mt-1">This appears in browser tabs and search results</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Site Description
            </label>
            <textarea
              value={settings.site_description}
              onChange={(e) => handleChange("site_description", e.target.value)}
              placeholder="Pacific Islands digital solutions - web development, AI automation, and business consulting"
              rows={3}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white 
                       placeholder-gray-500 focus:outline-none focus:border-vibrantorange resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">Meta description for search engines (recommended: 150-160 characters)</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Default OG Image URL
            </label>
            <input
              type="url"
              value={settings.og_image}
              onChange={(e) => handleChange("og_image", e.target.value)}
              placeholder="https://stevetoti.com/og-image.jpg"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white 
                       placeholder-gray-500 focus:outline-none focus:border-vibrantorange"
            />
            <p className="text-xs text-gray-500 mt-1">Image shown when sharing on social media (1200x630px recommended)</p>
          </div>
        </div>
      </div>

      {/* Analytics */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-vibrantorange" />
          Analytics & Tracking
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              GA4 Measurement ID
            </label>
            <input
              type="text"
              value={settings.ga4_measurement_id}
              onChange={(e) => handleChange("ga4_measurement_id", e.target.value)}
              placeholder="G-XXXXXXXXXX"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white 
                       placeholder-gray-500 focus:outline-none focus:border-vibrantorange"
            />
            <p className="text-xs text-gray-500 mt-1">
              Google Analytics 4 Measurement ID (starts with G-)
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Google Search Console Verification
            </label>
            <input
              type="text"
              value={settings.google_search_console_id}
              onChange={(e) => handleChange("google_search_console_id", e.target.value)}
              placeholder="Verification meta tag content"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white 
                       placeholder-gray-500 focus:outline-none focus:border-vibrantorange"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Facebook Pixel ID
            </label>
            <input
              type="text"
              value={settings.facebook_pixel_id}
              onChange={(e) => handleChange("facebook_pixel_id", e.target.value)}
              placeholder="XXXXXXXXXXXXXXX"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white 
                       placeholder-gray-500 focus:outline-none focus:border-vibrantorange"
            />
          </div>
        </div>
      </div>

      {/* Social */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Social Media</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Twitter/X Handle
            </label>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">@</span>
              <input
                type="text"
                value={settings.twitter_handle}
                onChange={(e) => handleChange("twitter_handle", e.target.value.replace("@", ""))}
                placeholder="stevetoti"
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white 
                         placeholder-gray-500 focus:outline-none focus:border-vibrantorange"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Search Result Preview</h2>
        
        <div className="bg-gray-950 p-4 rounded-xl">
          <div className="text-sm text-gray-500 mb-1">stevetoti.com</div>
          <div className="text-lg text-blue-400 hover:underline cursor-pointer mb-1">
            {settings.site_title || "Steve Toti - Digital Solutions"}
          </div>
          <div className="text-sm text-gray-400 line-clamp-2">
            {settings.site_description || "Your site description will appear here..."}
          </div>
        </div>
      </div>
    </div>
  );
}
