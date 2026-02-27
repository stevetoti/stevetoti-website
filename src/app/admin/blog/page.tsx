"use client";

import { useState, useEffect } from "react";
import { 
  FileText, Plus, Edit, Trash2, Eye, EyeOff, 
  Search, Calendar, Save, X, ExternalLink 
} from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  image_url: string;
  keywords: string[];
  focus_keyword: string | null;
  read_time: string;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

const emptyPost: Omit<BlogPost, "id" | "created_at" | "updated_at"> = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  category: "",
  image_url: "",
  keywords: [],
  focus_keyword: null,
  read_time: "5 min read",
  published: false,
  published_at: null,
};

export default function BlogManagementPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingPost, setEditingPost] = useState<Partial<BlogPost> | null>(null);
  const [saving, setSaving] = useState(false);
  const [keywordsInput, setKeywordsInput] = useState("");

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem("admin_auth");
      const response = await fetch("/api/admin/data?type=blog&limit=100", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (response.ok) {
        const { data } = await response.json();
        setPosts(data || []);
      }
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    }
    setLoading(false);
  };

  const savePost = async () => {
    if (!editingPost?.title || !editingPost?.content) {
      alert("Title and content are required");
      return;
    }

    setSaving(true);
    
    try {
      const token = localStorage.getItem("admin_auth");
      const isNew = !editingPost.id;
      
      // Generate slug if not set
      const slug = editingPost.slug || editingPost.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

      const postData = {
        ...editingPost,
        slug,
        keywords: keywordsInput ? keywordsInput.split(",").map(k => k.trim()) : [],
        site_id: "stevetoti",
        published_at: editingPost.published ? (editingPost.published_at || new Date().toISOString()) : null,
      };

      const response = await fetch("/api/admin/data", {
        method: isNew ? "POST" : "PUT",
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "blog",
          post: postData,
        }),
      });
      
      if (response.ok) {
        const result = await response.json();
        if (isNew && result.data) {
          setPosts([result.data, ...posts]);
        } else {
          setPosts(posts.map(p => p.id === editingPost.id ? { ...p, ...postData } as BlogPost : p));
        }
        setEditingPost(null);
        setKeywordsInput("");
      } else {
        const error = await response.json();
        alert(error.error || "Failed to save post");
      }
    } catch (error) {
      console.error("Failed to save post:", error);
      alert("Failed to save post");
    }
    setSaving(false);
  };

  const deletePost = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    
    try {
      const token = localStorage.getItem("admin_auth");
      const response = await fetch("/api/admin/data", {
        method: "DELETE",
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          table: "blog_posts",
          id,
        }),
      });
      
      if (response.ok) {
        setPosts(posts.filter(p => p.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete post:", error);
    }
  };

  const togglePublished = async (post: BlogPost) => {
    const token = localStorage.getItem("admin_auth");
    const newPublished = !post.published;
    
    await fetch("/api/admin/data", {
      method: "PATCH",
      headers: { 
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        table: "blog_posts",
        id: post.id,
        updates: { 
          published: newPublished,
          published_at: newPublished ? new Date().toISOString() : null,
        },
      }),
    });
    
    setPosts(posts.map(p => 
      p.id === post.id ? { ...p, published: newPublished } : p
    ));
  };

  const openEditor = (post?: BlogPost) => {
    if (post) {
      setEditingPost(post);
      setKeywordsInput(post.keywords?.join(", ") || "");
    } else {
      setEditingPost({ ...emptyPost });
      setKeywordsInput("");
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const filteredPosts = posts.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-vibrantorange border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Editor View
  if (editingPost) {
    return (
      <div className="space-y-6 max-w-4xl">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">
            {editingPost.id ? "Edit Post" : "New Post"}
          </h1>
          <div className="flex gap-2">
            <button
              onClick={() => { setEditingPost(null); setKeywordsInput(""); }}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 
                       text-white rounded-xl transition-colors"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
            <button
              onClick={savePost}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-vibrantorange hover:bg-orange-600 
                       disabled:opacity-50 text-white rounded-xl transition-colors"
            >
              {saving ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save Post
            </button>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Title *</label>
            <input
              type="text"
              value={editingPost.title || ""}
              onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white 
                       placeholder-gray-500 focus:outline-none focus:border-vibrantorange"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Slug</label>
              <input
                type="text"
                value={editingPost.slug || ""}
                onChange={(e) => setEditingPost({ ...editingPost, slug: e.target.value })}
                placeholder="auto-generated-from-title"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white 
                         placeholder-gray-500 focus:outline-none focus:border-vibrantorange"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Category</label>
              <input
                type="text"
                value={editingPost.category || ""}
                onChange={(e) => setEditingPost({ ...editingPost, category: e.target.value })}
                placeholder="e.g. Web Development"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white 
                         placeholder-gray-500 focus:outline-none focus:border-vibrantorange"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Excerpt</label>
            <textarea
              value={editingPost.excerpt || ""}
              onChange={(e) => setEditingPost({ ...editingPost, excerpt: e.target.value })}
              rows={2}
              placeholder="Brief summary for listings"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white 
                       placeholder-gray-500 focus:outline-none focus:border-vibrantorange resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Content * (HTML)</label>
            <textarea
              value={editingPost.content || ""}
              onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
              rows={15}
              placeholder="<p>Your blog post content...</p>"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white 
                       placeholder-gray-500 focus:outline-none focus:border-vibrantorange font-mono text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Featured Image URL</label>
            <input
              type="url"
              value={editingPost.image_url || ""}
              onChange={(e) => setEditingPost({ ...editingPost, image_url: e.target.value })}
              placeholder="https://..."
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white 
                       placeholder-gray-500 focus:outline-none focus:border-vibrantorange"
            />
          </div>

          {/* SEO Section */}
          <div className="border-t border-gray-800 pt-4 mt-4">
            <h3 className="text-white font-medium mb-4">SEO Settings</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Focus Keyword</label>
                <input
                  type="text"
                  value={editingPost.focus_keyword || ""}
                  onChange={(e) => setEditingPost({ ...editingPost, focus_keyword: e.target.value })}
                  placeholder="Main keyword to target"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white 
                           placeholder-gray-500 focus:outline-none focus:border-vibrantorange"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Keywords (comma-separated)</label>
                <input
                  type="text"
                  value={keywordsInput}
                  onChange={(e) => setKeywordsInput(e.target.value)}
                  placeholder="keyword1, keyword2, keyword3"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white 
                           placeholder-gray-500 focus:outline-none focus:border-vibrantorange"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Read Time</label>
                  <input
                    type="text"
                    value={editingPost.read_time || ""}
                    onChange={(e) => setEditingPost({ ...editingPost, read_time: e.target.value })}
                    placeholder="5 min read"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white 
                             placeholder-gray-500 focus:outline-none focus:border-vibrantorange"
                  />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingPost.published || false}
                      onChange={(e) => setEditingPost({ ...editingPost, published: e.target.checked })}
                      className="w-5 h-5 rounded border-gray-600 text-vibrantorange focus:ring-vibrantorange"
                    />
                    <span className="text-white">Published</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // List View
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-vibrantorange" />
            Blog Management
          </h1>
          <p className="text-gray-400 mt-1">
            {posts.filter(p => p.published).length} published, {posts.filter(p => !p.published).length} drafts
          </p>
        </div>
        <button
          onClick={() => openEditor()}
          className="flex items-center gap-2 px-4 py-2 bg-vibrantorange hover:bg-orange-600 
                   text-white rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Post
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
        <input
          type="text"
          placeholder="Search posts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-gray-900 border border-gray-800 rounded-xl 
                   text-white placeholder-gray-500 focus:outline-none focus:border-vibrantorange"
        />
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {filteredPosts.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 text-center">
            <FileText className="w-12 h-12 text-gray-700 mx-auto mb-4" />
            <p className="text-gray-500">
              {search ? "No posts match your search" : "No blog posts yet"}
            </p>
            {!search && (
              <button
                onClick={() => openEditor()}
                className="mt-4 px-4 py-2 bg-vibrantorange hover:bg-orange-600 
                         text-white rounded-xl transition-colors inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Create your first post
              </button>
            )}
          </div>
        ) : (
          filteredPosts.map((post) => (
            <div
              key={post.id}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-white truncate">{post.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs flex-shrink-0
                                   ${post.published 
                                     ? "bg-green-500/20 text-green-400" 
                                     : "bg-yellow-500/20 text-yellow-400"}`}>
                      {post.published ? "Published" : "Draft"}
                    </span>
                  </div>
                  
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                    {post.excerpt || "No excerpt"}
                  </p>
                  
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    {post.category && (
                      <span className="px-2 py-1 bg-gray-800 rounded">{post.category}</span>
                    )}
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(post.created_at)}
                    </span>
                    {post.read_time && <span>{post.read_time}</span>}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <a
                    href={`/blog/${post.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-gray-500 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                    title="View post"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => togglePublished(post)}
                    className="p-2 text-gray-500 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                    title={post.published ? "Unpublish" : "Publish"}
                  >
                    {post.published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => openEditor(post)}
                    className="p-2 text-gray-500 hover:text-vibrantorange hover:bg-vibrantorange/10 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deletePost(post.id)}
                    className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
