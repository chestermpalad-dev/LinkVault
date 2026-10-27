import { useEffect, useMemo, useState } from "react";
import {
  Bookmark,
  Search,
  Plus,
  X,
  Moon,
  Sun,
  Star,
  Layers3,
  CalendarDays,
  LogOut,
  CloudUpload,
} from "lucide-react";
import BookmarkCard from "../components/BookmarkCard";
import StatCard from "../components/StatCard";
import Sidebar from "../components/Sidebar";
import BookmarkModal from "../components/BookmarkModal";
import { supabase } from "../lib/supabase";

// Convert PostgreSQL column names into the format expected by the UI components.
function fromRow(row) {
  return {
    id: row.id,
    title: row.title,
    url: row.url,
    description: row.description ?? "",
    collection: row.collection ?? "Unsorted",
    tags: Array.isArray(row.tags) ? row.tags : [],
    favorite: Boolean(row.favorite),
    createdAt: row.created_at,
  };
}

function readPreviousBookmarks(userId) {
  try {
    if (localStorage.getItem(`linkvault-imported-${userId}`)) return [];
    const saved = JSON.parse(localStorage.getItem("linkvault-bookmarks") || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function Dashboard({ user }) {
  const [bookmarks, setBookmarks] = useState([]);
  const [loadingBookmarks, setLoadingBookmarks] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [importing, setImporting] = useState(false);
  const [previousBookmarks, setPreviousBookmarks] = useState(() => readPreviousBookmarks(user.id));
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("linkvault-theme");
    return saved ? saved === "dark" : true;
  });

  const [search, setSearch] = useState("");
  const [selectedCollection, setSelectedCollection] = useState("All");
  const [selectedTag, setSelectedTag] = useState("");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [collection, setCollection] = useState("Unsorted");
  const [tagsInput, setTagsInput] = useState("");
  const [error, setError] = useState("");

  // Data now lives in Supabase PostgreSQL, not browser LocalStorage.
  useEffect(() => {
    let active = true;

    async function fetchBookmarks() {
      setLoadingBookmarks(true);
      const { data, error: fetchError } = await supabase
        .from("bookmarks")
        .select("id,title,url,description,collection,tags,favorite,created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!active) return;
      if (fetchError) {
        setNotice(`Could not load bookmarks: ${fetchError.message}`);
      } else {
        setBookmarks((data || []).map(fromRow));
      }
      setLoadingBookmarks(false);
    }

    fetchBookmarks();
    return () => { active = false; };
  }, [user.id]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("linkvault-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const collections = useMemo(() => {
    const unique = new Set(bookmarks.map((bookmark) => bookmark.collection));
    return ["All", ...Array.from(unique)];
  }, [bookmarks]);

  const stats = useMemo(() => {
    const favorites = bookmarks.filter((bookmark) => bookmark.favorite).length;
    const collectionCount = new Set(
      bookmarks.map((bookmark) => bookmark.collection)
    ).size;

    const thisWeek = bookmarks.filter((bookmark) => {
      const created = new Date(bookmark.createdAt);
      const now = new Date();
      const diff = now - created;
      return diff <= 7 * 24 * 60 * 60 * 1000;
    }).length;

    return {
      total: bookmarks.length,
      favorites,
      collections: collectionCount,
      thisWeek,
    };
  }, [bookmarks]);

  function resetForm() {
    setEditingId(null);
    setTitle("");
    setUrl("");
    setDescription("");
    setCollection("Unsorted");
    setTagsInput("");
    setError("");
  }

  function openAddModal() {
    resetForm();
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    resetForm();
  }

  function handleEdit(bookmark) {
    setEditingId(bookmark.id);
    setTitle(bookmark.title);
    setUrl(bookmark.url);
    setDescription(bookmark.description || "");
    setCollection(bookmark.collection);
    setTagsInput(bookmark.tags.join(", "));
    setError("");
    setIsModalOpen(true);
  }

  async function handleDelete(id) {
    const bookmark = bookmarks.find((item) => item.id === id);
    if (!bookmark || !window.confirm(`Delete "${bookmark.title}"?`)) return;

    const { error: deleteError } = await supabase
      .from("bookmarks")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (deleteError) {
      setNotice(`Could not delete bookmark: ${deleteError.message}`);
      return;
    }
    setBookmarks((previous) => previous.filter((item) => item.id !== id));
    if (editingId === id) closeModal();
  }

  async function handleToggleFavorite(id) {
    const bookmark = bookmarks.find((item) => item.id === id);
    if (!bookmark) return;

    const { data, error: updateError } = await supabase
      .from("bookmarks")
      .update({ favorite: !bookmark.favorite })
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (updateError) {
      setNotice(`Could not update favorite: ${updateError.message}`);
      return;
    }
    setBookmarks((previous) => previous.map((b) => b.id === id ? fromRow(data) : b));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const cleanTitle = title.trim();
    let cleanUrl = url.trim();

    if (!cleanTitle || !cleanUrl) {
      setError("Website name and URL are required.");
      return;
    }

    if (!/^https?:\/\//i.test(cleanUrl)) cleanUrl = `https://${cleanUrl}`;
    try {
      const parsed = new URL(cleanUrl);
      if (!["http:", "https:"].includes(parsed.protocol) || !parsed.hostname.includes(".")) {
        throw new Error("Invalid URL");
      }
      cleanUrl = parsed.href;
    } catch {
      setError("Enter a valid website address, such as https://react.dev");
      return;
    }

    const tags = [...new Set(
      tagsInput.split(",").map((tag) => tag.trim().toLowerCase()).filter(Boolean)
    )];

    const payload = {
      title: cleanTitle,
      url: cleanUrl,
      description: description.trim(),
      collection: collection.trim() || "Unsorted",
      tags,
    };

    setSaving(true);
    const query = editingId
      ? supabase.from("bookmarks").update(payload).eq("id", editingId).eq("user_id", user.id)
      : supabase.from("bookmarks").insert({ ...payload, user_id: user.id });

    const { data, error: saveError } = await query.select().single();
    setSaving(false);

    if (saveError) {
      setError(`Could not save bookmark: ${saveError.message}`);
      return;
    }

    if (editingId) {
      setBookmarks((previous) => previous.map((b) => b.id === editingId ? fromRow(data) : b));
    } else {
      setBookmarks((previous) => [fromRow(data), ...previous]);
    }
    closeModal();
  }

  // Optional, one-time import of bookmarks created in the original LocalStorage app.
  async function importPreviousBookmarks() {
    const existingUrls = new Set(bookmarks.map((b) => b.url));
    const rows = [];
    for (const item of previousBookmarks) {
      try {
        const target = new URL(item.url);
        if (!["http:", "https:"].includes(target.protocol)) continue;
        if (existingUrls.has(target.href)) continue;
        existingUrls.add(target.href);
        rows.push({
          user_id: user.id,
          title: String(item.title || target.hostname).slice(0, 300),
          url: target.href,
          description: String(item.description || ""),
          collection: String(item.collection || "Unsorted"),
          tags: Array.isArray(item.tags) ? item.tags.map(String) : [],
          favorite: Boolean(item.favorite),
        });
      } catch {
        // Ignore malformed URLs from the old demo.
      }
    }

    if (rows.length) {
      setImporting(true);
      const { data, error: importError } = await supabase.from("bookmarks").insert(rows).select();
      setImporting(false);
      if (importError) {
        setNotice(`Import failed: ${importError.message}`);
        return;
      }
      setBookmarks((previous) => [...(data || []).map(fromRow), ...previous]);
    }
    localStorage.setItem(`linkvault-imported-${user.id}`, "yes");
    setPreviousBookmarks([]);
    setNotice(`${rows.length} old bookmark${rows.length === 1 ? "" : "s"} imported.`);
  }

  async function handleLogout() {
    const { error: logoutError } = await supabase.auth.signOut();
    if (logoutError) setNotice(`Logout failed: ${logoutError.message}`);
  }

  const filteredBookmarks = useMemo(() => {
    const query = search.toLowerCase().trim();

    let result = bookmarks.filter((bookmark) => {
      const matchesSearch =
        bookmark.title.toLowerCase().includes(query) ||
        bookmark.url.toLowerCase().includes(query) ||
        bookmark.description.toLowerCase().includes(query) ||
        bookmark.collection.toLowerCase().includes(query) ||
        bookmark.tags.some((tag) => tag.includes(query));

      const matchesCollection =
        selectedCollection === "All" ||
        bookmark.collection === selectedCollection;

      const matchesTag = !selectedTag || bookmark.tags.includes(selectedTag);

      const matchesFavorite = !showFavoritesOnly || bookmark.favorite;

      return (
        matchesSearch &&
        matchesCollection &&
        matchesTag &&
        matchesFavorite
      );
    });

    switch (sortBy) {
      case "az":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "za":
        result.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "oldest":
        result.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
        break;
      case "newest":
      default:
        result.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        break;
    }

    return result;
  }, [
    bookmarks,
    search,
    selectedCollection,
    selectedTag,
    showFavoritesOnly,
    sortBy,
  ]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-200 dark:bg-[#020617] dark:text-white">
      <div className="flex min-h-screen">
        {/* SIDEBAR */}

<Sidebar
  bookmarks={bookmarks}
  collections={collections}
  stats={stats}
  selectedCollection={selectedCollection}
  setSelectedCollection={setSelectedCollection}
  showFavoritesOnly={showFavoritesOnly}
  setShowFavoritesOnly={setShowFavoritesOnly}
  openAddModal={openAddModal}
  onLogout={handleLogout}
/>



        {/* MAIN */}
        <main className="min-w-0 flex-1">
          <div className="mx-auto max-w-7xl p-5 md:p-8">
            {notice && (
              <div role="status" className="mb-5 flex items-center justify-between gap-4 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm text-indigo-900 dark:border-indigo-800 dark:bg-indigo-950 dark:text-indigo-100">
                <span>{notice}</span>
                <button type="button" onClick={() => setNotice("")} aria-label="Dismiss message" className="cursor-pointer text-indigo-500"><X size={18} /></button>
              </div>
            )}
            {previousBookmarks.length > 0 && !loadingBookmarks && (
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-indigo-200 bg-indigo-50 p-4 text-sm text-slate-700 dark:border-indigo-800 dark:bg-indigo-950 dark:text-slate-200">
                <span>You have bookmarks from the old browser-only version. Import them to your private online account?</span>
                <button type="button" onClick={importPreviousBookmarks} disabled={importing}
                  className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white disabled:opacity-60">
                  <CloudUpload size={16} /> {importing ? "Importing..." : "Import old bookmarks"}
                </button>
              </div>
            )}
            {loadingBookmarks && <p role="status" className="mb-5 text-sm text-slate-500">Loading bookmarks from Supabase...</p>}

            {/* MOBILE HEADER */}
            <div className="mb-6 flex items-center justify-between lg:hidden">
              <div>
                <h1 className="text-2xl font-bold">LinkVault</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">Bookmarks dashboard</p>
              </div>

              <button
                type="button"
                onClick={openAddModal}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
              >
                <Plus size={16} />
                Add
              </button>
            </div>

            {/* TOPBAR */}
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">
                  {showFavoritesOnly ? "Favorite Bookmarks" : selectedCollection === "All" ? "All Bookmarks" : selectedCollection}
                </h2>
                <p className="mt-1 text-slate-500 dark:text-slate-400">
                  Every link you’ve saved, in one place.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="hidden max-w-48 truncate text-xs text-slate-500 dark:text-slate-400 sm:block" title={user.email}>{user.email}</span>
              <button
                type="button"
                onClick={() => setDarkMode((prev) => !prev)}
                className="inline-flex cursor-pointer items-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                {darkMode ? "Light mode" : "Dark mode"}
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <LogOut size={17} /> Sign out
              </button>
              </div>
            </div>

            {/* STATS */}
            <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                label="Total"
                value={stats.total}
                icon={<Bookmark size={18} />}
                accent="indigo"
              />
              <StatCard
                label="Favorites"
                value={stats.favorites}
                icon={<Star size={18} />}
                accent="yellow"
              />
              <StatCard
                label="Collections"
                value={stats.collections}
                icon={<Layers3 size={18} />}
                accent="blue"
              />
              <StatCard
                label="Added this week"
                value={stats.thisWeek}
                icon={<CalendarDays size={18} />}
                accent="emerald"
              />
            </div>

            {/* SEARCH + FILTERS */}
            <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-white/5">
              <div className="grid gap-4 lg:grid-cols-[1fr_auto_auto]">
                <div className="relative">
                  <Search
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                  />
                  <input
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search bookmarks, tags, collections..."
                   className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-slate-900 outline-none placeholder:text-slate-400 focus:border-indigo-500 dark:border-white/10 dark:bg-slate-900/70 dark:text-white dark:placeholder:text-slate-500"
                  />
                </div>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="az">Name (A-Z)</option>
                  <option value="za">Name (Z-A)</option>
                </select>

                <button
                  type="button"
                  onClick={openAddModal}
                  className="hidden items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-500 lg:inline-flex"
                >
                  <Plus size={18} />
                  Add Bookmark
                </button>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCollection("All");
                    setSelectedTag("");
                    setShowFavoritesOnly(false);
                  }}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    selectedCollection === "All" && !selectedTag && !showFavoritesOnly
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                  }`}
                >
                  All
                </button>

                {collections
                  .filter((item) => item !== "All")
                  .map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => {
                        setSelectedCollection(item);
                        setShowFavoritesOnly(false);
                      }}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                        selectedCollection === item
                          ? "bg-indigo-600 text-white"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                      }`}
                    >
                      {item}
                    </button>
                  ))}

                {selectedTag && (
                  <button
                    type="button"
                    onClick={() => setSelectedTag("")}
                    className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300"
                  >
                    #{selectedTag}
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* RESULTS */}
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                {showFavoritesOnly
                  ? "Favorite Bookmarks"
                  : selectedCollection === "All"
                  ? "All Bookmarks"
                  : selectedCollection}
              </h3>
              <span className="text-sm text-slate-500 dark:text-slate-400">
                {filteredBookmarks.length} results
              </span>
            </div>

            {/* GRID */}
            {loadingBookmarks ? null : filteredBookmarks.length > 0 ? (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {filteredBookmarks.map((bookmark) => (
                  <BookmarkCard
                    key={bookmark.id}
                    bookmark={bookmark}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onTagClick={setSelectedTag}
                    onToggleFavorite={handleToggleFavorite}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center dark:border-slate-700 dark:bg-slate-900">
                <Bookmark size={42} className="mx-auto mb-4 text-slate-500" />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  No bookmarks found
                </h3>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  Try changing your search or filters.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setSelectedCollection("All");
                    setSelectedTag("");
                    setShowFavoritesOnly(false);
                  }}
                  className="mt-5 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </main>
      </div>


        {/* ADD / EDIT BOOKMARK MODAL */}
        {isModalOpen && (
          <BookmarkModal
            editingId={editingId}
            title={title}
            setTitle={setTitle}
            url={url}
            setUrl={setUrl}
            description={description}
            setDescription={setDescription}
            collection={collection}
            setCollection={setCollection}
            tagsInput={tagsInput}
            setTagsInput={setTagsInput}
            collections={collections}
            error={error}
            onSubmit={handleSubmit}
            onClose={closeModal}
            saving={saving}
          />
        )}

    </div>
  );
}

export default Dashboard;