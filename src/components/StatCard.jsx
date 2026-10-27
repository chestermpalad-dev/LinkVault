function StatCard({ icon, label, value, accent = "indigo" }) {
  const accentClasses = {
    indigo: "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400",
    yellow: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
    emerald: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
    blue: "bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {label}
          </p>
          <h3 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            {value}
          </h3>
        </div>
        <div className={`rounded-xl p-3 ${accentClasses[accent] || accentClasses.indigo}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

export default StatCard;
