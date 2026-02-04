import { supabase } from "../../lib/supabaseClient";
import type { QuestionLevel } from "../../types/quiz";

export async function createAttempt(params: {
  userId: string;
  level: QuestionLevel;
  totalQuestions: number;
}): Promise<number> {
  const { data, error } = await supabase
    .from("attempts")
    .insert({
      user_id: params.userId,
      level: params.level,
      total_questions: params.totalQuestions,
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);
  return data.id as number;
}

export async function insertAnswer(params: {
  userId: string;
  attemptId: number;
  questionId: number;
  choiceId: number;
  isCorrect: boolean;
}): Promise<void> {
  const { error } = await supabase.from("answers").insert({
    user_id: params.userId,
    attempt_id: params.attemptId,
    question_id: params.questionId,
    choice_id: params.choiceId,
    is_correct: params.isCorrect,
  });

  if (error) throw new Error(error.message);
}

export async function finishAttempt(params: {
  userId: string;
  attemptId: number;
  correctCount: number;
  finishedAt?: string;
}): Promise<void> {
  const { error } = await supabase
    .from("attempts")
    .update({
      correct_count: params.correctCount,
      finished_at: params.finishedAt ?? new Date().toISOString(),
    })
    .eq("id", params.attemptId)
    .eq("user_id", params.userId);

  if (error) throw new Error(error.message);
}