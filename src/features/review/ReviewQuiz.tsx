import { useEffect, useState } from "react";
import type { Question } from "../../types/quiz";
import { fetchLatestIncorrectQuestions } from "./api";
import Markdown from "../../components/ui/markdown";
import { Button } from "../../components/ui/button";

type Props = {
  userId: string;
};

type AnswerState = {
  selectedChoiceId: number | null;
  isCorrect: boolean | null;
};

export default function ReviewQuiz({ userId }: Props) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState<AnswerState>({
    selectedChoiceId: null,
    isCorrect: null,
  });

  // const results = useMemo(
  //   () =>
  //     questions
  //       .slice(0, index + 1)
  //       .filter((_, i) => i < index && answer.isCorrect),
  //   [index, answer.isCorrect, questions],
  // );

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      setIndex(0);
      setAnswer({ selectedChoiceId: null, isCorrect: null });

      try {
        const qs = await fetchLatestIncorrectQuestions(userId);
        setQuestions(qs);
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      } finally {
        setLoading(false);
      }
    })();
  }, [userId]);

  const current = questions[index];

  if (loading) return <p>読み込み中...</p>;
  if (error) return <p style={{ color: "crimson" }}>Error: {error}</p>;
  if (!current) return <p>最新の結果に「間違い問題」はありません 🎉</p>;

  const isAnswered = answer.selectedChoiceId !== null;
  const isLast = index === questions.length - 1;

  const onSelect = (choiceId: number) => {
    if (isAnswered) return;
    const picked = current.choices.find((c) => c.id === choiceId);
    if (!picked) return;
    setAnswer({ selectedChoiceId: choiceId, isCorrect: picked.is_correct });
  };

  const onNext = () => {
    if (!isAnswered) return;
    setIndex((i) => i + 1);
    setAnswer({ selectedChoiceId: null, isCorrect: null });
  };

  return (
    <div style={{ marginTop: 16 }}>
      <p>
        {index + 1} / {questions.length}（最新の間違い）
      </p>

      <h2>{current.prompt}</h2>

      <ol>
        {current.choices.map((c) => {
          const selected = answer.selectedChoiceId === c.id;
          const showCorrect = isAnswered && c.is_correct;
          const showWrong = isAnswered && selected && !c.is_correct;

          return (
            <li key={c.id} style={{ margin: "8px 0" }}>
              <button
                onClick={() => onSelect(c.id)}
                disabled={isAnswered}
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: 10,
                  borderRadius: 8,
                  border: "1px solid #ccc",
                  background: selected ? "#f2f2f2" : "white",
                }}
              >
                {c.label}
                {showCorrect && " ✅"}
                {showWrong && " ❌"}
              </button>
            </li>
          );
        })}
      </ol>

      {isAnswered && (
        <div style={{ marginTop: 10 }}>
          <strong>{answer.isCorrect ? "正解！" : "不正解"}</strong>
          {current.explanation && <Markdown content={current.explanation} />}
        </div>
      )}

      <div style={{ marginTop: 12 }}>
        {!isLast ? (
          <>
            <Button onClick={onNext} disabled={!isAnswered} className="w-full">
              次の問題へ
            </Button>
            {!isAnswered && (
              <p className="text-xs text-muted-foreground text-center mt-2">
                回答すると次へ進めます
              </p>
            )}
          </>
        ) : (
          <div className="text-sm text-muted-foreground text-center">
            最後の問題です。回答したら復習は完了です。
          </div>
        )}
      </div>
    </div>
  );
}
