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
      <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-full">
            <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <div className="text-sm font-medium text-green-800">ログイン中</div>
            <p className="text-sm text-green-600">{email}</p>
          </div>
        </div>
        <button
          onClick={signOut}
          disabled={busy}
          className="px-4 py-2 text-sm font-medium text-green-700 bg-green-100 border border-green-300 rounded-md hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
        >
          ログアウト
        </button>
      </div>
    );
  }

  if (!showAuthForm) {
    return (
      <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-full">
            <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-blue-800">
              ログインして学習履歴を保存
            </p>
            <p className="text-xs text-blue-600">
              進捗管理と復習機能が利用できます
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowAuthForm(true)}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          ログイン
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-medium text-gray-900">アカウント</h3>
          <p className="text-sm text-gray-600">
            ログインまたは新規登録してください
          </p>
        </div>
        <button
          onClick={() => setShowAuthForm(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>

      {msg && (
        <div className={`mb-4 p-3 rounded-md ${
          msg.includes("エラー") || msg.includes("error") 
            ? "bg-red-50 border border-red-200 text-red-800" 
            : "bg-green-50 border border-green-200 text-green-800"
        }`}>
          {msg}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            メールアドレス
          </label>
          <input
            id="email"
            type="email"
            value={inputEmail}
            onChange={(e) => setInputEmail(e.target.value)}
            placeholder="your@email.com"
            disabled={busy}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            パスワード
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="パスワードを入力"
            disabled={busy}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={signIn}
            disabled={busy || !inputEmail || !password}
            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {busy ? "処理中..." : "ログイン"}
          </button>
          <button
            onClick={signUp}
            disabled={busy || !inputEmail || !password}
            className="flex-1 px-4 py-2 text-sm font-medium text-blue-600 bg-white border border-blue-600 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {busy ? "処理中..." : "新規登録"}
          </button>
        </div>
      </div>
    </div>
  );
}
