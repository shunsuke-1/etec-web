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
      {/* Welcome Section */}
      <div className="text-center py-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          学習を始めましょう
        </h2>
        <p className="text-gray-600 text-lg">
          レベルを選択して模擬試験を開始するか、過去の学習履歴を確認できます
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Quiz Section */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-100 rounded-lg">
              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">模擬試験</h3>
              <p className="text-gray-600">実際の試験形式で学習効果を確認</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                難易度レベル
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as QuestionLevel)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              試験を開始
            </button>
          </div>
        </div>

        {/* Learning History Section */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-green-100 rounded-lg">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">学習履歴</h3>
              <p className="text-gray-600">過去の成績と間違いを振り返り</p>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => navigate("/history")}
              disabled={!userId}
              className={`w-full text-left p-4 rounded-lg border transition-colors ${
                userId
                  ? "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  : "border-gray-100 bg-gray-50 cursor-not-allowed"
              }`}
            >
              <div className="flex items-center gap-3">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <div>
                  <div className="font-medium text-gray-900">履歴を見る</div>
                  <div className="text-sm text-gray-500">過去の試験結果を確認</div>
                </div>
                {!userId && (
                  <svg className="h-4 w-4 text-gray-400 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                )}
              </div>
            </button>

            <button
              onClick={() => navigate("/review")}
              disabled={!userId}
              className={`w-full text-left p-4 rounded-lg border transition-colors ${
                userId
                  ? "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  : "border-gray-100 bg-gray-50 cursor-not-allowed"
              }`}
            >
              <div className="flex items-center gap-3">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <div>
                  <div className="font-medium text-gray-900">間違い見直し</div>
                  <div className="text-sm text-gray-500">最新の間違いを復習</div>
                </div>
                {!userId && (
                  <svg className="h-4 w-4 text-gray-400 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                )}
              </div>
            </button>
          </div>

          {!userId && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 text-sm text-blue-800">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>ログインすると履歴機能が利用できます</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
