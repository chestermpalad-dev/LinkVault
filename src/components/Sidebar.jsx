import {
  Bookmark,
  LayoutGrid,
  Heart,
  Folder,
  Plus,
  LogOut,
} from "lucide-react";

function Sidebar({
  bookmarks,
  collections,
  stats,
  selectedCollection,
  setSelectedCollection,
  showFavoritesOnly,
  setShowFavoritesOnly,
  openAddModal,
  onLogout,
}) {
  const inactive = "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10";

  return (
    <aside className="hidden h-screen w-72 shrink-0 sticky top-0 flex-col border-r border-slate-200 bg-white p-5 transition-colors dark:border-slate-800 dark:bg-slate-950 lg:flex">
      <div className="mb-9 flex items-center gap-3">
        <div className="rounded-xl bg-indigo-600 p-3 text-white">
          <Bookmark size={22} />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">LinkVault</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Bookmarks dashboard</p>
        </div>
      </div>

      <nav aria-label="Main navigation" className="space-y-2">
        <button
          type="button"
          onClick={() => {
            setSelectedCollection("All");
            setShowFavoritesOnly(false);
          }}
          className={`flex w-full cursor-pointer items-center justify-between rounded-xl px-4 py-3 text-left font-medium transition-colors ${
            !showFavoritesOnly && selectedCollection === "All"
              ? "bg-indigo-600 text-white"
              : inactive
          }`}
        >
          <span className="flex items-center gap-3"><LayoutGrid size={18} />All Bookmarks</span>
          <span className="text-xs opacity-75">{bookmarks.length}</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setShowFavoritesOnly(true);
            setSelectedCollection("All");
          }}
          className={`flex w-full cursor-pointer items-center justify-between rounded-xl px-4 py-3 text-left font-medium transition-colors ${
            showFavoritesOnly ? "bg-indigo-600 text-white" : inactive
          }`}
        >
          <span className="flex items-center gap-3"><Heart size={18} />Favorites</span>
          <span className="text-xs opacity-75">{stats.favorites}</span>
        </button>
      </nav>

      <div className="mt-9 min-h-0 flex-1 overflow-y-auto">
        <h3 className="mb-3 flex items-center gap-2 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          <Folder size={14} />My Collections
        </h3>

        <div className="space-y-1">
          {collections.filter((item) => item !== "All").map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => {
                setSelectedCollection(item);
                setShowFavoritesOnly(false);
              }}
              className={`flex w-full cursor-pointer items-center justify-between rounded-xl px-4 py-3 text-left transition-colors ${
                selectedCollection === item && !showFavoritesOnly
                  ? "bg-indigo-50 font-semibold text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300"
                  : inactive
              }`}
            >
              <span className="truncate">{item}</span>
              <span className="ml-2 text-xs opacity-70">
                {bookmarks.filter((b) => b.collection === item).length}
              </span>
            </button>
          ))}
        </div>
      </div>


{/* SIDEBAR BOTTOM ACTIONS */}
<div className="mt-auto space-y-3 pt-6">

  {/* ADD BOOKMARK */}
  <button
    type="button"
    onClick={openAddModal}
    className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-medium text-white transition hover:bg-indigo-500"
  >
    <Plus size={18} />
    Add Bookmark
  </button>

  {/* LOGOUT */}
  <button
    type="button"
    onClick={onLogout}
    className="flex w-full cursor-pointer items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 font-medium text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-slate-800 dark:text-slate-300 dark:hover:border-red-500/20 dark:hover:bg-red-500/10 dark:hover:text-red-400"
  >
    <LogOut size={18} />
    <span>Logout</span>
  </button>

</div>

    </aside>
  );
}

export default Sidebar;
