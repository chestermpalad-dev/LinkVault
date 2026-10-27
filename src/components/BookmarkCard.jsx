import {
  Star,
  Pencil,
  Trash2,
  ExternalLink,
  Folder,
  Tag,
  Globe,
} from "lucide-react";

function BookmarkCard({
  bookmark,
  onEdit,
  onDelete,
  onTagClick,
  onToggleFavorite,
}) {
  return (
    <article className="group min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-500/40 dark:hover:shadow-black/20">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <div className="shrink-0 rounded-xl border border-indigo-100 bg-indigo-50 p-3 text-indigo-600 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-400">
            <Globe size={20} />
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-lg font-semibold text-slate-900 dark:text-white">
              {bookmark.title}
            </h3>
            <p className="truncate text-sm text-slate-500 dark:text-slate-400">
              {bookmark.url.replace(/^https?:\/\//, "")}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-0.5">
          <button
            type="button"
            onClick={() => onToggleFavorite(bookmark.id)}
            aria-label={`${bookmark.favorite ? "Remove from" : "Add to"} favorites: ${bookmark.title}`}
            title={bookmark.favorite ? "Remove from favorites" : "Add to favorites"}
            className={`cursor-pointer rounded-lg p-2 transition-colors ${
              bookmark.favorite
                ? "text-amber-500 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-400/10"
                : "text-slate-400 hover:bg-slate-100 hover:text-amber-500 dark:text-slate-400 dark:hover:bg-slate-800"
            }`}
          >
            <Star size={17} fill={bookmark.favorite ? "currentColor" : "none"} />
          </button>

          <button
            type="button"
            onClick={() => onEdit(bookmark)}
            aria-label={`Edit ${bookmark.title}`}
            title="Edit bookmark"
            className="cursor-pointer rounded-lg p-2 text-slate-500 transition-colors hover:bg-indigo-50 hover:text-indigo-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-indigo-400"
          >
            <Pencil size={17} />
          </button>

          <button
            type="button"
            onClick={() => onDelete(bookmark.id)}
            aria-label={`Delete ${bookmark.title}`}
            title="Delete bookmark"
            className="cursor-pointer rounded-lg p-2 text-slate-500 transition-colors hover:bg-rose-50 hover:text-rose-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-rose-400"
          >
            <Trash2 size={17} />
          </button>
        </div>
      </div>

      <p className="mt-4 line-clamp-2 min-h-12 text-sm leading-6 text-slate-600 dark:text-slate-300">
        {bookmark.description || "No description added for this bookmark."}
      </p>

      <div className="mt-4 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
        <Folder size={15} className="text-indigo-600 dark:text-indigo-400" />
        <span>{bookmark.collection}</span>
      </div>

      <div className="mt-4 flex min-h-8 flex-wrap gap-2">
        {bookmark.tags?.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => onTagClick(tag)}
            className="inline-flex cursor-pointer items-center gap-1 rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 transition-colors hover:bg-indigo-100 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-indigo-500/15 dark:hover:text-indigo-300"
          >
            <Tag size={11} />
            {tag}
          </button>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
        <span className="text-xs text-slate-500 dark:text-slate-400">
          {bookmark.createdAt && !Number.isNaN(new Date(bookmark.createdAt).getTime())
            ? new Date(bookmark.createdAt).toLocaleDateString()
            : "Recently added"}
        </span>

        <a
          href={bookmark.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 transition-colors hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          Visit
          <ExternalLink size={15} />
        </a>
      </div>
    </article>
  );
}

export default BookmarkCard;
