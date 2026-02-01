import { useState } from "react";
import type { QuestionLevel } from "./types/quiz";
import QuizScreen from "./features/quiz/QuizScreen";

const levelLabels: Record<QuestionLevel, string> = {
  beginner: "初級",
  intermediate: "中級",
  advanced: "上級",
};

export default function App() {
  const [level, setLevel] = useState<QuestionLevel>("beginner");

  return (
    <div
      style={{
        padding: 24,
        fontFamily: "system-ui",
        maxWidth: 720,
        margin: "0 auto",
      }}
    >
      <h1>ETEC Quiz</h1>

      <label>
        レベル：
        <select
          value={level}
          onChange={(e) => setLevel(e.target.value as QuestionLevel)}
          style={{ marginLeft: 8 }}
        >
          {Object.entries(levelLabels).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </label>

      <QuizScreen level={level} />
    </div>
  );
}
