import { useEffect, useState } from "react";
import { Routes, Route, Navigate, Link } from "react-router-dom";
import { supabase } from "./lib/supabaseClient";
import AuthPanel from "./features/auth/AuthPanel";

import HomePage from "./pages/HomePage";
import QuizPage from "./pages/QuizPage";
import ResultPage from "./pages/ResultPage";
import ExplanationPage from "./pages/ExplanationPage";
import HistoryPage from "./pages/HistoryPage";
import HistoryDetailPage from "./pages/HistoryDetailPage";
import ReviewPage from "./pages/ReviewPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import ContactPage from "./pages/ContactPage";
import AboutPage from "./pages/AboutPage";

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
    <div className="min-h-screen bg-[#edf0f2] flex flex-col">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex w-full max-w-[1240px] items-start justify-between gap-4 px-6 py-5">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-black sm:text-[2.8rem]">
              ETEC EXAM
            </h1>
            <p className="mt-2 text-lg text-gray-500">ETEC試験対策</p>
          </div>
          <AuthPanel isLoggedIn={!!userId} email={email} />
        </div>
      </header>

      <div className="mx-auto w-full max-w-[1240px] flex-1 px-6 py-10">
        <main>
          <Routes>
            <Route path="/" element={<HomePage userId={userId} />} />
            <Route path="/quiz" element={<QuizPage userId={userId} />} />
            <Route path="/result" element={<ResultPage userId={userId} />} />
            <Route
              path="/explanation"
              element={<ExplanationPage userId={userId} />}
            />
            <Route path="/review" element={<ReviewPage userId={userId} />} />
            <Route path="/history" element={<HistoryPage userId={userId} />} />
            <Route
              path="/history/:attemptId"
              element={<HistoryDetailPage userId={userId} />}
            />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>

      <footer className="border-t border-gray-200 bg-white/80">
        <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-3 px-6 py-6 text-sm text-gray-600 sm:flex-row sm:items-center sm:justify-between">
          <nav className="flex flex-wrap items-center gap-4">
            <Link
              to="/privacy"
              className="transition-colors hover:text-[#2f74c0]"
            >
              プライバシーポリシー
            </Link>
            <Link
              to="/contact"
              className="transition-colors hover:text-[#2f74c0]"
            >
              お問い合わせ
            </Link>
            <Link
              to="/about"
              className="transition-colors hover:text-[#2f74c0]"
            >
              運営者情報
            </Link>
          </nav>
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} ETEC Quiz
          </p>
        </div>
      </footer>
    </div>
  );
}
