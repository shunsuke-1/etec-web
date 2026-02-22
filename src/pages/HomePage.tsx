import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { QuestionLevel } from "../types/quiz";

type Props = {
  userId: string | null;
};

const levelLabels: Record<QuestionLevel, string> = {
  beginner: "初級",
  intermediate: "中級",
  advanced: "上級",
};

export default function HomePage({ userId }: Props) {
  const navigate = useNavigate();
  const [level, setLevel] = useState<QuestionLevel>("beginner");

  return (
    <div className="space-y-8">
      <div className="grid items-center gap-8 py-3 md:grid-cols-2">
        <div className="space-y-3">
          <h2 className="text-4xl font-extrabold tracking-tight text-black sm:text-4xl">
            今すぐスタート!
          </h2>
          <p className="text-lg font-medium text-gray-600">
            難易度を選んで模擬試験を始めよう
          </p>
        </div>

        <div className="flex items-center justify-center">
          <div className="w-full max-w-[420px] rounded-3xl border border-slate-200 bg-white/70 p-6 shadow-sm backdrop-blur">
            <p className="text-center text-sm font-semibold tracking-[0.2em] text-slate-500">
              LEARNING CYCLE
            </p>
            <div className="mt-5 grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-2">
              <div className="rounded-xl bg-[#4f63be]/10 px-3 py-3 text-center">
                <p className="text-sm font-bold text-[#4f63be]">模擬試験</p>
              </div>
              <svg
                className="h-4 w-4 text-slate-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 12h14m-4-4 4 4-4 4"
                />
              </svg>
              <div className="rounded-xl bg-slate-100 px-3 py-3 text-center">
                <p className="text-sm font-bold text-slate-700">弱点分析</p>
              </div>
              <svg
                className="h-4 w-4 text-slate-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 12h14m-4-4 4 4-4 4"
                />
              </svg>
              <div className="rounded-xl bg-[#d8784e]/10 px-3 py-3 text-center">
                <p className="text-sm font-bold text-[#d8784e]">復習</p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
              <svg
                className="h-4 w-4 animate-spin [animation-duration:6s]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h5M20 20v-5h-5M5.5 9A8 8 0 0 1 19 6.5M18.5 15A8 8 0 0 1 5 17.5"
                />
              </svg>
              <span>繰り返し学習で合格力を高める</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-[24px] border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-slate-100 p-7 shadow-[0_10px_35px_rgba(15,23,42,0.08)] lg:min-h-[430px]">
          <div className="mb-8 flex items-center gap-5">
            <div className="rounded-2xl border border-[#4f63be]/30 bg-[#4f63be]/10 p-3 text-[#4f63be] shadow-inner">
              <svg
                className="h-14 w-14"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 6h16v10H4z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 20h6"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-3xl font-black tracking-tight text-slate-900 sm:text-[2rem]">
                模擬試験
              </h3>
              <p className="text-base font-medium text-slate-500 sm:text-lg">
                実際の試験形式でチャレンジ
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-lg font-bold tracking-tight text-slate-700">
                難易度を選択
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as QuestionLevel)}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base font-semibold text-slate-800 shadow-sm transition-all focus:border-[#2f74c0] focus:outline-none focus:ring-4 focus:ring-[#2f74c0]/20 sm:text-lg"
              >
                {Object.entries(levelLabels).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => navigate(`/quiz?level=${level}`)}
              className="w-full rounded-xl bg-gradient-to-r from-[#2f74c0] to-[#3e89da] px-4 py-4 text-xl font-bold text-white shadow-[0_10px_25px_rgba(47,116,192,0.35)] transition-all hover:-translate-y-0.5 hover:from-[#2b6cb3] hover:to-[#387ec9] hover:shadow-[0_14px_30px_rgba(47,116,192,0.42)] focus:outline-none focus:ring-4 focus:ring-[#2f74c0]/25 sm:text-2xl"
            >
              試験を開始する
            </button>
          </div>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white p-7 shadow-[0_10px_35px_rgba(15,23,42,0.08)] lg:min-h-[430px]">
          <div className="mb-8 flex items-center gap-5">
            <div className="rounded-2xl border border-[#e7a383]/40 bg-[#fff2eb] p-3 text-[#e29471] shadow-inner">
              <svg
                className="h-14 w-14"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M5 19V5m7 14V9m7 10V3"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-3xl font-black tracking-tight text-slate-900 sm:text-[2rem]">
                学習履歴
              </h3>
              <p className="text-base font-medium text-slate-500 sm:text-lg">
                今までの成績をチェック&ミスを復習
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => navigate("/history")}
              disabled={!userId}
              className={`flex w-full items-center gap-4 rounded-2xl border px-5 py-4 text-left transition-colors ${
                userId
                  ? "border-gray-300 bg-white hover:bg-gray-50"
                  : "cursor-not-allowed border-gray-200 bg-[#edf1f4] text-gray-600"
              }`}
            >
              <div className="rounded-full bg-[#84b9e5] p-3 text-white">
                <svg
                  className="h-7 w-7"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v5l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <div className="text-xl font-bold text-slate-900 sm:text-2xl">
                  過去の結果を見る
                </div>
                <div className="text-sm text-slate-600 sm:text-base">
                  今までの試験結果をチェック
                </div>
              </div>
              {!userId && (
                <svg
                  className="ml-auto h-7 w-7 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11V8a3 3 0 00-6 0v3m-2 0h10a1 1 0 011 1v6a1 1 0 01-1 1H7a1 1 0 01-1-1v-6a1 1 0 011-1z"
                  />
                </svg>
              )}
            </button>

            <button
              onClick={() => navigate("/review")}
              disabled={!userId}
              className={`flex w-full items-center gap-4 rounded-2xl border px-5 py-4 text-left transition-colors ${
                userId
                  ? "border-gray-300 bg-white hover:bg-gray-50"
                  : "cursor-not-allowed border-gray-200 bg-[#edf1f4] text-gray-600"
              }`}
            >
              <div className="rounded-full bg-[#84b9e5] p-3 text-white">
                <svg
                  className="h-7 w-7"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </div>
              <div>
                <div className="text-xl font-bold text-slate-900 sm:text-2xl">
                  復習する
                </div>
                <div className="text-sm text-slate-600 sm:text-base">
                  直近のミスを見直す
                </div>
              </div>
              {!userId && (
                <svg
                  className="ml-auto h-7 w-7 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11V8a3 3 0 00-6 0v3m-2 0h10a1 1 0 011 1v6a1 1 0 01-1 1H7a1 1 0 01-1-1v-6a1 1 0 011-1z"
                  />
                </svg>
              )}
            </button>
          </div>

          {!userId && (
            <div className="mt-5 rounded-2xl border border-[#e8b1ab] bg-[#f9e7e4] p-4">
              <div className="flex items-center justify-center gap-3 text-sm font-semibold text-[#c25748] sm:text-base">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span>上記の機能はログイン後に利用可能です</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
