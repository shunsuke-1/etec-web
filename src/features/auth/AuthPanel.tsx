import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";

type Props = {
  isLoggedIn: boolean;
  email?: string | null;
};

export default function AuthPanel({ isLoggedIn, email }: Props) {
  const [inputEmail, setInputEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [showAuthForm, setShowAuthForm] = useState(false);

  const signUp = async () => {
    if (!inputEmail || !password) {
      setMsg("メールアドレスとパスワードを入力してください");
      return;
    }

    setBusy(true);
    setMsg(null);
    try {
      const { error } = await supabase.auth.signUp({
        email: inputEmail,
        password,
      });
      if (error) throw error;

      setMsg("登録しました！ログインできるか試してください");
      setInputEmail("");
      setPassword("");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  };

  const signIn = async () => {
    if (!inputEmail || !password) {
      setMsg("メールアドレスとパスワードを入力してください");
      return;
    }

    setBusy(true);
    setMsg(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: inputEmail,
        password,
      });
      if (error) throw error;

      setMsg("ログインしました！");
      setInputEmail("");
      setPassword("");
      setShowAuthForm(false);
    } catch (e) {
      setMsg(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  };

  const signOut = async () => {
    setBusy(true);
    setMsg(null);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setMsg("ログアウトしました");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  };

  if (isLoggedIn) {
    return (
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-medium text-gray-700">ログイン中</p>
          <p className="text-xs text-gray-500">{email}</p>
        </div>
        <button
          onClick={signOut}
          disabled={busy}
          className="rounded-xl bg-gray-700 px-5 py-2 text-sm font-semibold text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
        >
          ログアウト
        </button>
      </div>
    );
  }

  if (!showAuthForm) {
    return (
      <div>
        <button
          onClick={() => setShowAuthForm(true)}
          className="rounded-2xl bg-[#4f63be] px-8 py-3 text-2xl font-semibold text-white transition-colors hover:bg-[#4558ad] focus:outline-none focus:ring-2 focus:ring-[#4f63be] focus:ring-offset-2"
        >
          ログイン
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowAuthForm(false)}
        className="rounded-2xl bg-[#4f63be] px-8 py-3 text-2xl font-semibold text-white transition-colors hover:bg-[#4558ad] focus:outline-none focus:ring-2 focus:ring-[#4f63be] focus:ring-offset-2"
      >
        ログイン
      </button>
      <div className="absolute right-0 top-[calc(100%+12px)] z-20 w-80 rounded-xl border border-gray-200 bg-white p-4 shadow-lg">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-800">アカウント</h3>
          <button
            onClick={() => setShowAuthForm(false)}
            className="text-sm text-gray-500 hover:text-gray-700"
            aria-label="ログインフォームを閉じる"
          >
            ✕
          </button>
        </div>

        {msg && (
          <div className={`mb-3 rounded-md border px-3 py-2 text-xs ${
            msg.includes("エラー") || msg.includes("error")
              ? "border-red-200 bg-red-50 text-red-800"
              : "border-green-200 bg-green-50 text-green-800"
          }`}>
            {msg}
          </div>
        )}

        <div className="space-y-3">
          <input
            id="email"
            type="email"
            value={inputEmail}
            onChange={(e) => setInputEmail(e.target.value)}
            placeholder="メールアドレス"
            disabled={busy}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="パスワード"
            disabled={busy}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <div className="flex gap-2">
            <button
              onClick={signIn}
              disabled={busy || !inputEmail || !password}
              className="flex-1 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busy ? "処理中..." : "ログイン"}
            </button>
            <button
              onClick={signUp}
              disabled={busy || !inputEmail || !password}
              className="flex-1 rounded-md border border-blue-600 bg-white px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busy ? "処理中..." : "新規登録"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
