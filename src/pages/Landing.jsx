import { Link } from "react-router-dom";
import {
  ArrowRight, ArrowUpRight, Bookmark, Check, Cloud, Folder,
  Heart, Layers3, LockKeyhole, Search, ShieldCheck, Sparkles, Tags,
} from "lucide-react";

const demo = [
  { name: "React Documentation", url: "react.dev", group: "Development", tags: ["react", "docs"], symbol: "⚛" },
  { name: "Tailwind CSS", url: "tailwindcss.com", group: "Design", tags: ["css", "ui"], symbol: "✦" },
  { name: "MDN Web Docs", url: "developer.mozilla.org", group: "Learning", tags: ["web", "reference"], symbol: "{ }" },
];

function Landing({ user }) {
  const primaryPath = user ? "/app" : "/signup";
  return (
    <div className="min-h-screen bg-[#080d1c] font-sans text-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[700px] overflow-hidden">
        <div className="absolute left-1/2 top-[-440px] h-[1000px] w-[1100px] -translate-x-1/2 rounded-full bg-indigo-600/15 blur-[115px]" />
      </div>
      <div className="relative">
        <header className="border-b border-white/[0.07]">
          <nav className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-5 py-5 sm:px-8" aria-label="Main navigation">
            <Link to="/" className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white"><Bookmark size={22} /></span>
              <span className="text-xl font-bold tracking-tight">LinkVault<span className="text-indigo-400">.</span></span>
            </Link>
            <div className="flex items-center gap-2 sm:gap-4">
              <a href="#features" className="hidden px-2 py-2 text-sm text-slate-400 hover:text-white sm:inline">Features</a>
              {user ? (
                <Link to="/app" className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold hover:bg-indigo-500">Dashboard <ArrowRight size={16}/></Link>
              ) : (
                <>
                  <Link to="/login" className="rounded-xl px-3 py-2.5 text-sm font-medium text-slate-300 hover:text-white">Log in</Link>
                  <Link to="/signup" className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold hover:bg-indigo-500">Get started <ArrowRight size={15}/></Link>
                </>
              )}
            </div>
          </nav>
        </header>

        <main>
          <section className="mx-auto max-w-7xl px-5 pb-20 pt-16 sm:px-8 md:pb-28 md:pt-24">
            <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-400/10 px-4 py-2 text-xs font-semibold tracking-wide text-indigo-200"><Sparkles size={14}/> Your corner of the internet, organized</span>
              <h1 className="mt-7 text-4xl font-bold leading-[1.13] tracking-tight sm:text-6xl md:text-[68px]">
                Save what inspires you.<br/>
                <span className="bg-gradient-to-r from-indigo-300 via-violet-300 to-cyan-300 bg-clip-text text-transparent">Find it in seconds.</span>
              </h1>
              <p className="mt-6 max-w-xl text-base leading-8 text-slate-400 sm:text-lg">Say goodbye to messy browser tabs. Keep every useful link in one beautiful, private workspace—organized by collection, searchable by tag, and available whenever you sign in.</p>
              <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
                <Link to={primaryPath} className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-semibold shadow-lg shadow-indigo-500/25 transition hover:-translate-y-0.5 hover:bg-indigo-500">
                  {user ? "Open my bookmarks" : "Start bookmarking for free"} <ArrowRight size={17}/>
                </Link>
                <a href="#features" className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-semibold text-slate-200 transition hover:bg-white/10">Explore features <ArrowUpRight size={17}/></a>
              </div>
              <p className="mt-6 flex items-center gap-2 text-xs text-slate-500"><Check size={15} className="text-emerald-400"/> No installation required · Works in your browser</p>
            </div>

            <div className="relative mx-auto mt-16 max-w-5xl overflow-hidden rounded-[26px] border border-indigo-300/15 bg-[#0f172b] p-3 shadow-[0_30px_100px_rgba(0,0,0,0.5)] sm:p-5 md:mt-20">
              <div className="flex items-center gap-2 border-b border-white/10 pb-4">
                <div className="h-2.5 w-2.5 rounded-full bg-red-400/70"/><div className="h-2.5 w-2.5 rounded-full bg-amber-400/70"/><div className="h-2.5 w-2.5 rounded-full bg-emerald-400/70"/>
                <span className="ml-3 text-xs text-slate-500">LinkVault / Dashboard Preview</span>
              </div>
              <div className="grid gap-5 py-5 md:grid-cols-[190px_1fr]">
                <aside className="hidden space-y-3 border-r border-white/10 pr-4 text-sm md:block">
                  <div className="mb-6 flex items-center gap-2 font-semibold"><Bookmark size={18} className="text-indigo-400"/> My workspace</div>
                  <div className="rounded-lg bg-indigo-500/15 px-3 py-2 text-indigo-300"><Layers3 size={15} className="mr-2 inline"/>All bookmarks</div>
                  <div className="px-3 py-2 text-slate-400"><Heart size={15} className="mr-2 inline"/>Favorites</div>
                  <div className="pt-4 text-xs uppercase tracking-widest text-slate-600">Collections</div>
                  <div className="px-3 py-2 text-slate-400">Development</div><div className="px-3 py-2 text-slate-400">Design</div><div className="px-3 py-2 text-slate-400">Learning</div>
                </aside>
                <div>
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <div><div className="text-xl font-bold">All bookmarks</div><p className="mt-1 text-xs text-slate-500">Your best links, always within reach.</p></div>
                    <span className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold">+ Add bookmark</span>
                  </div>
                  <div className="mb-4 flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3 text-xs text-slate-500"><Search size={16}/> Search bookmarks, tags, and collections...</div>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {demo.map((site)=> (
                      <div key={site.url} className="rounded-xl border border-white/10 bg-white/[0.035] p-4">
                        <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 font-semibold text-indigo-300">{site.symbol}</div>
                        <div className="truncate text-sm font-semibold">{site.name}</div>
                        <div className="mt-1 truncate text-xs text-slate-500">{site.url}</div>
                        <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-400"><Folder size={12}/>{site.group}</div>
                        <div className="mt-3 flex flex-wrap gap-1">{site.tags.map(t=><span key={t} className="rounded-md bg-white/10 px-2 py-1 text-[10px] text-slate-300">#{t}</span>)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="features" className="border-t border-white/[0.07] bg-[#0b1122] py-20 sm:py-24">
            <div className="mx-auto max-w-7xl px-5 sm:px-8">
              <div className="mb-10 max-w-xl"><p className="mb-3 text-sm font-semibold text-indigo-400">MADE FOR CURIOUS MINDS</p><h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Everything worth saving, all in one place.</h2><p className="mt-4 text-slate-400">A focused set of tools to turn random links into a personal library.</p></div>
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  { icon: Folder, title: "Collections that make sense", body: "Group links into projects, topics, or whatever fits your workflow." },
                  { icon: Tags, title: "Find anything instantly", body: "Search by title or URL and filter with the tags you create." },
                  { icon: ShieldCheck, title: "Your bookmarks, your account", body: "Sign in securely and access your own cloud-saved collection." },
                ].map(({icon:Icon,title,body}) => (
                  <div key={title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-7">
                    <span className="mb-6 inline-flex rounded-xl bg-indigo-500/10 p-3 text-indigo-300"><Icon size={22}/></span>
                    <h3 className="mb-3 text-lg font-bold">{title}</h3>
                    <p className="text-sm leading-7 text-slate-400">{body}</p>
                  </div>
                ))}
              </div>
              <div className="mt-10 flex flex-wrap items-center gap-5 text-xs text-slate-500"><span className="inline-flex items-center gap-2"><Cloud size={15}/> Cloud database</span><span className="inline-flex items-center gap-2"><LockKeyhole size={15}/> Private bookmarks</span><span className="inline-flex items-center gap-2"><Check size={15}/> Dark and light modes</span></div>
            </div>
          </section>
          <section className="px-5 py-20 text-center sm:px-8 sm:py-24"><h2 className="text-3xl font-bold sm:text-4xl">Make your internet yours.</h2><p className="mt-4 text-slate-400">Start building a library you’ll actually use.</p><Link to={primaryPath} className="mt-8 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 font-semibold hover:bg-indigo-500">{user ? "Go to dashboard" : "Create a free account"}<ArrowRight size={18}/></Link></section>
        </main>
        <footer className="border-t border-white/10 px-5 py-6 text-center text-xs text-slate-500">© {new Date().getFullYear()} LinkVault · Built with React, Tailwind CSS, and Supabase</footer>
      </div>
    </div>
  );
}

export default Landing;
