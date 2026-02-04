import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import type { QuestionLevel } from "../types/quiz";
import QuizScreen from "../features/quiz/QuizScreen";
import { PageHeader } from "../components/layout/PageHeader";

type Props = {
  userId: string | null;
};

const isLevel = (x: string | null): x is QuestionLevel =>
  x === "beginner" || x === "intermediate" || x === "advanced";

const levelLabels: Record<QuestionLevel, string> = {
  beginner: "初級",
  intermediate: "中級", 
  advanced: "上級",
};

export default function QuizPage({ userId }: Props) {
  const [params] = useSearchParams();

  const level = useMemo<QuestionLevel>(() => {
    const q = params.get("level");
    return isLevel(q) ? q : "beginner";
  }, [params]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="模擬試験"
        subtitle={`難易度: ${levelLabels[level]}`}
        showBackButton
        backTo="/"
      />

      <QuizScreen level={level} userId={userId} />
    </div>
  );
}
