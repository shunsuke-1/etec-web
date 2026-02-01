import { useEffect, useMemo, useState } from "react";
import type { Question, QuestionLevel } from "../types/quiz";
import { fetchQuestionsByLevel } from "./api";

type Props = {
  level: QuestionLevel;
};

type AnswerState = {
  selectedChoiceId: number | null;
  isCorrect: boolean | null;
};

export default function QuizScreen({ level }: Props) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState<AnswerState>({
    selectedChoiceId: null,
    isCorrect: null,
  });

  // 集計用：各問題の回答結果を持つ（DB保存は次のStep）
  const [results, setResults] = useState<
    { questionId: number; selectedChoiceId: number; isCorrect: boolean }[]
  >([]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      setIndex(0);
      setAnswer({ selectedChoiceId: null, isCorrect: null });
      setResults([]);

      try {
        const qs = await fetchQuestionsByLevel(level);
        setQuestions(qs);
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      } finally {
        setLoading(false);
      }
    })();
  }, [level]);

  const current = questions[index];

  const score = useMemo(
    () => results.filter((r) => r.isCorrect).length,
    [results],
  );

  if (loading) return <p>読み込み中...</p>;
  if (error) return <p style={{ color: "crimson" }}>Error: {error}</p>;
  if (!current) return <p>このレベルの問題がありません。</p>;

  const isAnswered = answer.selectedChoiceId !== null;

  const onSelect = (choiceId: number) => {
    if (isAnswered) return; // 1問につき1回だけ回答

    const picked = current.choices.find((c) => c.id === choiceId);
    if (!picked) return;

    const isCorrect = picked.is_correct;

    setAnswer({ selectedChoiceId: choiceId, isCorrect });

    setResults((prev) => [
      ...prev,
      { questionId: current.id, selectedChoiceId: choiceId, isCorrect },
    ]);
  };

  const onNext = () => {
    if (!isAnswered) return;

    setIndex((i) => i + 1);
    setAnswer({ selectedChoiceId: null, isCorrect: null });
  };

  const isLast = index === questions.length - 1;

  return (
    <div style={{ marginTop: 16 }}>
      <div
        style={{ display: "flex", justifyContent: "space-between", gap: 12 }}
      >
        <p>
          {index + 1} / {questions.length}
        </p>
        <p>
          正解：{score} / {results.length}
        </p>
      </div>

      <h2 style={{ marginTop: 8 }}>{current.prompt}</h2>

      <ol style={{ paddingLeft: 18 }}>
        {current.choices.map((c) => {
          const selected = answer.selectedChoiceId === c.id;
          const showCorrect = isAnswered && c.is_correct;
          const showWrong = isAnswered && selected && !c.is_correct;

          return (
            <li key={c.id} style={{ margin: "10px 0" }}>
              <button
                onClick={() => onSelect(c.id)}
                disabled={isAnswered}
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: "10px 12px",
                  borderRadius: 10,
                  border: "1px solid #ccc",
                  background: selected ? "#f2f2f2" : "white",
                  cursor: isAnswered ? "default" : "pointer",
                }}
              >
                {c.label}
                {showCorrect && <span style={{ marginLeft: 8 }}>✅</span>}
                {showWrong && <span style={{ marginLeft: 8 }}>❌</span>}
              </button>
            </li>
          );
        })}
      </ol>

      {isAnswered && (
        <div
          style={{
            marginTop: 12,
            padding: 12,
            border: "1px solid #ddd",
            borderRadius: 12,
          }}
        >
          <p style={{ margin: 0, fontWeight: 700 }}>
            {answer.isCorrect ? "正解！" : "不正解"}
          </p>
          {current.explanation && (
            <p style={{ marginTop: 8, marginBottom: 0 }}>
              {current.explanation}
            </p>
          )}
        </div>
      )}

      <div style={{ marginTop: 14, display: "flex", gap: 12 }}>
        {!isLast ? (
          <button onClick={onNext} disabled={!isAnswered}>
            次へ
          </button>
        ) : (
          <button
            onClick={() =>
              alert(`終了！ 正解数 ${score} / ${questions.length}`)
            }
            disabled={!isAnswered}
          >
            結果へ（仮）
          </button>
        )}
      </div>
    </div>
  );
}
