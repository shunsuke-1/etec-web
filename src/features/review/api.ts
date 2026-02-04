import { supabase } from "../../lib/supabaseClient";
import type { Question } from "../../types/quiz";

/**
 * 最新Attemptの「間違えた問題」だけ取得
 */
export async function fetchLatestIncorrectQuestions(
  userId: string
): Promise<Question[]> {
  // 1) 最新の attempt を1件取得
  const { data: latestAttempt, error: attemptError } = await supabase
    .from("attempts")
    .select("id")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (attemptError) throw new Error(attemptError.message);
  if (!latestAttempt) return [];

  // 2) その attempt の「不正解 answer」から question_id を取得
  const { data: wrongAnswers, error: answerError } = await supabase
    .from("answers")
    .select("question_id")
    .eq("attempt_id", latestAttempt.id)
    .eq("is_correct", false);

  if (answerError) throw new Error(answerError.message);
  if (!wrongAnswers || wrongAnswers.length === 0) return [];

  const questionIds = wrongAnswers.map((a) => a.question_id);

  // 3) 問題本体 + choices を取得
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