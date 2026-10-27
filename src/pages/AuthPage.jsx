import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Bookmark, Eye, EyeOff, LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { supabase } from "../lib/supabase";

function AuthPage({ mode }) {
  const isSignup = mode === "signup";
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");
    if (isSignup && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Use a password with at least 6 characters.");
      return;
    }

    setBusy(true);
    try {
      if (isSignup) {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: email.trim().toLowerCase(),
          password,
          options: {
            data: { full_name: fullName.trim() },
            emailRedirectTo: `${window.location.origin}/login`,
          },
        });
        if (signUpError) throw signUpError;
        if (data.session) {
          navigate("/app", { replace: true });
        } else {
          setSuccess("Check your email for the confirmation link. After confirming, you can log in.");
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password,
        });
        if (signInError) throw signInError;
        navigate("/app", { replace: true });
      }
    } catch (err) {
      setError(err?.message || "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid min-h-screen bg-[#080d1c] text-white lg:grid-cols-2">
      <div className="flex min-h-screen flex-col px-5 py-7 sm:px-10 lg:px-14">
        <Link to="/" className="inline-flex w-fit items-center gap-2 text-xl font-bold tracking-tight"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600"><Bookmark size={21}/></span>LinkVault<span className="-ml-2 text-indigo-400">.</span></Link>
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-14">
          <Link to="/" className="mb-8 inline-flex items-center gap-2 self-start text-sm text-slate-400 hover:text-white"><ArrowLeft size={16}/> Back to home</Link>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{isSignup ? "Create your account" : "Welcome back"}</h1>
          <p className="mt-3 text-sm leading-7 text-slate-400">{isSignup ? "Save your first link and start building your personal library." : "Sign in to pick up right where you left off."}</p>
          <div className="mt-8 space-y-3">
            {error && <div role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div>}
            {success && <div role="status" className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm leading-6 text-emerald-200">{success}</div>}
          </div>
          <form className="mt-5 space-y-5" onSubmit={handleSubmit}>
            {isSignup && <div><label htmlFor="name" className="mb-2 block text-sm font-medium text-slate-300">Full name</label><input id="name" type="text" autoComplete="name" value={fullName} onChange={(e)=>setFullName(e.target.value)} maxLength={100} required placeholder="Your name" className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-sm text-white outline-none placeholder:text-slate-600 focus:border-indigo-400"/></div>}
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-300">Email address</label>
              <div className="relative"><Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"/><input id="email" type="email" autoComplete="email" value={email} onChange={(e)=>setEmail(e.target.value)} required placeholder="you@example.com" className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-3.5 pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-indigo-400"/></div>
            </div>
            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-300">Password</label>
              <div className="relative"><LockKeyhole size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"/><input id="password" type={showPassword ? "text" : "password"} autoComplete={isSignup ? "new-password" : "current-password"} minLength={6} value={password} onChange={(e)=>setPassword(e.target.value)} required placeholder="At least 6 characters" className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-3.5 pl-11 pr-12 text-sm text-white outline-none placeholder:text-slate-600 focus:border-indigo-400"/><button type="button" onClick={()=>setShowPassword((old)=>!old)} aria-label={showPassword ? "Hide password" : "Show password"} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">{showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}</button></div>
            </div>
            {isSignup && <div><label htmlFor="confirm" className="mb-2 block text-sm font-medium text-slate-300">Confirm password</label><input id="confirm" type="password" autoComplete="new-password" minLength={6} value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} required placeholder="Repeat your password" className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-sm text-white outline-none placeholder:text-slate-600 focus:border-indigo-400"/></div>}
            <button type="submit" disabled={busy} className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3.5 text-sm font-bold transition hover:bg-indigo-500 disabled:cursor-wait disabled:opacity-60">{busy ? "Please wait..." : isSignup ? "Create account" : "Sign in"} {!busy && <ArrowRight size={17}/>}</button>
          </form>
          <p className="mt-7 text-center text-sm text-slate-400">{isSignup ? "Already have an account?" : "New to LinkVault?"} <Link className="font-semibold text-indigo-300 hover:text-indigo-200" to={isSignup ? "/login" : "/signup"}>{isSignup ? "Sign in" : "Create an account"}</Link></p>
          <p className="mt-8 text-center text-xs leading-6 text-slate-500">Your account is managed by Supabase Authentication. Bookmarks are private to your account.</p>
        </div>
      </div>
      <div className="relative hidden overflow-hidden border-l border-white/[0.07] bg-[#0d1430] p-14 lg:flex lg:flex-col lg:justify-center">
        <div className="absolute -right-48 -top-48 h-[700px] w-[700px] rounded-full bg-indigo-600/20 blur-[100px]"/>
        <div className="relative mx-auto max-w-md"><span className="mb-7 inline-flex rounded-2xl bg-indigo-400/10 p-5 text-indigo-300"><ShieldCheck size={30}/></span><h2 className="text-4xl font-bold leading-tight">Your favorite corners of the internet. <span className="text-indigo-300">One secure home.</span></h2><p className="mt-6 text-base leading-8 text-slate-400">Collections, tags, favorites, and powerful search—synced to your private cloud database.</p>
          <div className="mt-10 grid grid-cols-2 gap-4">{["Save links", "Organize collections", "Search by tags", "Access anywhere"].map((item)=><div key={item} className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-4 text-sm text-slate-200"><span className="mr-2 text-indigo-300">✓</span>{item}</div>)}</div>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
