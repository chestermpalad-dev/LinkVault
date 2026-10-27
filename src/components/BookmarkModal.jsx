import { useEffect } from "react";
import { X } from "lucide-react";

function BookmarkModal({
  editingId,
  title,
  setTitle,
  url,
  setUrl,
  description,
  setDescription,
  collection,
  setCollection,
  tagsInput,
  setTagsInput,
  collections,
  error,
  onSubmit,
  onClose,
  saving = false,
}) {
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500";
  const labelClass = "mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm" role="presentation">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="bookmark-modal-title"
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 text-slate-900 shadow-2xl dark:border-slate-700 dark:bg-slate-900 dark:text-white sm:p-8"
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 id="bookmark-modal-title" className="text-2xl font-bold tracking-tight">
              {editingId ? "Edit Bookmark" : "Add Bookmark"}
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Save useful links and organize them into collections.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close bookmark form"
            className="cursor-pointer rounded-xl p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
          ><X size={20} /></button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="bookmark-title" className={labelClass}>Website Name</label>
              <input id="bookmark-title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. React Documentation" className={inputClass} required autoFocus />
            </div>
            <div>
              <label htmlFor="bookmark-url" className={labelClass}>Website URL</label>
              <input id="bookmark-url" type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://react.dev" className={inputClass} required />
            </div>
          </div>
          <div>
            <label htmlFor="bookmark-description" className={labelClass}>Description</label>
            <textarea id="bookmark-description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="Short note about this website..." className={inputClass} />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="bookmark-collection" className={labelClass}>Collection</label>
              <input id="bookmark-collection" type="text" list="bookmark-collection-options" value={collection} onChange={(e) => setCollection(e.target.value)} placeholder="e.g. Development" className={inputClass} />
              <datalist id="bookmark-collection-options">
                {collections.filter((item) => item !== "All").map((item) => <option key={item} value={item} />)}
              </datalist>
            </div>
            <div>
              <label htmlFor="bookmark-tags" className={labelClass}>Tags</label>
              <input id="bookmark-tags" type="text" value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} placeholder="react, javascript, tutorial" className={inputClass} />
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Separate tags using commas.</p>
            </div>
          </div>
          {error && <p role="alert" className="text-sm text-rose-600 dark:text-rose-400">{error}</p>}
          <div className="flex flex-wrap justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="cursor-pointer rounded-xl border border-slate-200 px-5 py-3 font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">Cancel</button>
            <button type="submit" disabled={saving} className="cursor-pointer disabled:cursor-wait disabled:opacity-60 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition-colors hover:bg-indigo-500">{saving ? "Saving..." : editingId ? "Update Bookmark" : "Save Bookmark"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BookmarkModal;
