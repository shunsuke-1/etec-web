import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "./lib/supabaseClient";
import AuthPanel from "./features/auth/AuthPanel";

import HomePage from "./pages/HomePage";
import QuizPage from "./pages/QuizPage";
import ResultPage from "./pages/ResultPage";
import HistoryPage from "./pages/HistoryPage";
import ReviewPage from "./pages/ReviewPage";

export default function App() {
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const user = data.session?.user ?? null;
      setUserId(user?.id ?? null);
      setEmail(user?.email ?? null);
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user ?? null;
      setUserId(user?.id ?? null);
      setEmail(user?.email ?? null);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <header className="border-b border-gray-200 pb-6 mb-8 bg-white rounded-lg shadow-sm p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">ETEC Quiz</h1>
              <p className="text-gray-600 mt-1">
                エンベデッドシステムスペシャリスト試験対策
              </p>
            </div>
          </div>
          <div className="mt-6">
            <AuthPanel isLoggedIn={!!userId} email={email} />
          </div>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<HomePage userId={userId} />} />
            <Route path="/quiz" element={<QuizPage userId={userId} />} />
            <Route path="/result" element={<ResultPage userId={userId} />} />
            <Route path="/review" element={<ReviewPage userId={userId} />} />
            <Route path="/history" element={<HistoryPage userId={userId} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
