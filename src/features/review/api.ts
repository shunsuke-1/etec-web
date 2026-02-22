import { supabase } from "../../lib/supabaseClient";
import type { Question } from "../../types/quiz";

/**
 * 問題ごとに最新の回答が「不正解」の問題だけ取得
 * 同じ問題は1回だけ返す
 */
export async function fetchLatestIncorrectQuestions(
  userId: string
): Promise<Question[]> {
  const { data: answers, error: answerError } = await supabase
    .from("answers")
    .select("id, question_id, is_correct, answered_at")
    .eq("user_id", userId)
    .order("answered_at", { ascending: false })
    .order("id", { ascending: false });

  if (answerError) throw new Error(answerError.message);
  if (!answers || answers.length === 0) return [];

  const latestByQuestion = new Map<number, { is_correct: boolean }>();
  for (const answer of answers) {
    if (!latestByQuestion.has(answer.question_id)) {
      latestByQuestion.set(answer.question_id, { is_correct: answer.is_correct });
    }
  }

  const questionIds = Array.from(latestByQuestion.entries())
    .filter(([, v]) => v.is_correct === false)
    .map(([id]) => id);

  if (questionIds.length === 0) return [];

  // 問題本体 + choices を取得
  const { data: questions, error: qError } = await supabase
    .from("questions")
    .select(`
      id, level, category, prompt, explanation,
      choices ( id, label, is_correct )
    `)
    .in("id", questionIds)
    .order("id", { ascending: true });

  if (qError) throw new Error(qError.message);

  return (questions ?? []) as unknown as Question[];
}
