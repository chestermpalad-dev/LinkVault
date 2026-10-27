import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { supabase } from "./lib/supabase";
import Landing from "./pages/Landing";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";

function AppRoutes() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    // Check the current Supabase Auth session when the page opens.
    supabase.auth.getUser().then(({ data, error }) => {
      if (!active) return;
      setUser(error ? null : data.user);
      setLoading(false);
    }).catch(() => {
      if (active) setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active) setUser(session?.user ?? null);
    });
    return () => { active = false; subscription.unsubscribe(); };
  }, []);

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-[#080d1c] text-sm text-slate-300">Loading LinkVault...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={<Landing user={user} />} />
      <Route path="/login" element={user ? <Navigate to="/app" replace /> : <AuthPage mode="login" />} />
      <Route path="/signup" element={user ? <Navigate to="/app" replace /> : <AuthPage mode="signup" />} />
      <Route path="/app" element={user ? <Dashboard key={user.id} user={user} /> : <Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return <BrowserRouter><AppRoutes /></BrowserRouter>;
}
