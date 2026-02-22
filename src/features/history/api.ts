import { supabase } from "../../lib/supabaseClient";
import type { QuestionLevel } from "../../types/quiz";

const LEVEL_ORDER: QuestionLevel[] = ["beginner", "intermediate", "advanced"];
const MAX_HISTORY_PER_LEVEL = 2;

function pickLatestAttemptsPerLevel<T extends { level: QuestionLevel }>(
  attempts: T[],
  maxPerLevel: number,
): T[] {
  const counts: Record<QuestionLevel, number> = {
    beginner: 0,
    intermediate: 0,
    advanced: 0,
  };

  return attempts.filter((attempt) => {
    if (counts[attempt.level] >= maxPerLevel) {
      return false;
    }
    counts[attempt.level] += 1;
    return true;
  });
}

export async function createAttempt(params: {
  userId: string;
  level: QuestionLevel;
  totalQuestions: number;
}): Promise<number> {
  // First, create the new attempt
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

  // Then, clean up old attempts - keep only the latest N attempts per level
  try {
    // Get all attempts for this user, ordered by creation date (newest first)
    const { data: allAttempts, error: fetchError } = await supabase
      .from("attempts")
      .select("id, level, created_at")
      .eq("user_id", params.userId)
      .order("created_at", { ascending: false });

    if (fetchError) {
      console.warn("Failed to fetch attempts for cleanup:", fetchError.message);
    } else if (allAttempts && allAttempts.length > 0) {
      const validAttempts = allAttempts.filter(
        (attempt): attempt is { id: number; level: QuestionLevel; created_at: string } =>
          LEVEL_ORDER.includes(attempt.level as QuestionLevel),
      );
      const keptAttempts = pickLatestAttemptsPerLevel(
        validAttempts,
        MAX_HISTORY_PER_LEVEL,
      );
      const keptIds = new Set(keptAttempts.map((attempt) => attempt.id));
      const attemptsToDelete = validAttempts
        .filter((attempt) => !keptIds.has(attempt.id))
        .map((attempt) => attempt.id);

      if (attemptsToDelete.length > 0) {
        // First delete related answers
        const { error: answersDeleteError } = await supabase
          .from("answers")
          .delete()
          .in("attempt_id", attemptsToDelete);

        if (answersDeleteError) {
          console.warn("Failed to delete old answers:", answersDeleteError.message);
        }

        // Then delete the old attempts
        const { error: attemptsDeleteError } = await supabase
          .from("attempts")
          .delete()
          .in("id", attemptsToDelete);

        if (attemptsDeleteError) {
          console.warn("Failed to delete old attempts:", attemptsDeleteError.message);
        } else {
          console.log(
            `Cleaned up ${attemptsToDelete.length} old attempts for user ${params.userId}`,
          );
        }
      }
    }
  } catch (cleanupError) {
    // Don't fail the attempt creation if cleanup fails
    console.warn("Attempt cleanup failed:", cleanupError);
  }

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

type AttemptRow = {
  id: number;
  level: QuestionLevel;
  correct_count: number | null;
  total_questions: number;
  created_at: string;
  finished_at: string | null;
};

export async function fetchAttemptHistory(userId: string): Promise<AttemptRow[]> {
  const { data, error } = await supabase
    .from("attempts")
    .select("id, level, correct_count, total_questions, created_at, finished_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  const rows = (data ?? []) as AttemptRow[];
  return pickLatestAttemptsPerLevel(rows, MAX_HISTORY_PER_LEVEL);
}

type AttemptDetailRow = {
  id: number;
  level: QuestionLevel;
  correct_count: number | null;
  total_questions: number;
  created_at: string;
  finished_at: string | null;
};

type AnswerRow = {
  id: number;
  question_id: number;
  choice_id: number;
  is_correct: boolean;
};

type QuestionRow = {
  id: number;
  prompt: string;
  explanation: string | null;
  choices: { id: number; label: string; is_correct: boolean }[];
};

export async function fetchAttemptDetail(params: {
  userId: string;
  attemptId: number;
}): Promise<{
  attempt: AttemptDetailRow;
  items: {
    questionId: number;
    prompt: string;
    explanation: string | null;
    selectedChoiceLabel: string;
    correctChoiceLabel: string;
    isCorrect: boolean;
  }[];
}> {
  const { data: attempt, error: attemptError } = await supabase
    .from("attempts")
    .select("id, level, correct_count, total_questions, created_at, finished_at")
    .eq("id", params.attemptId)
    .eq("user_id", params.userId)
    .single();

  if (attemptError) throw new Error(attemptError.message);
  if (!attempt) throw new Error("試験履歴が見つかりません。");

  const { data: answers, error: answersError } = await supabase
    .from("answers")
    .select("id, question_id, choice_id, is_correct")
    .eq("attempt_id", params.attemptId)
    .eq("user_id", params.userId)
    .order("id", { ascending: true });

  if (answersError) throw new Error(answersError.message);
  if (!answers || answers.length === 0) {
    return { attempt: attempt as AttemptDetailRow, items: [] };
  }

  const questionIds = answers.map((a) => a.question_id);
  const { data: questions, error: questionsError } = await supabase
    .from("questions")
    .select("id, prompt, explanation, choices ( id, label, is_correct )")
    .in("id", questionIds);

  if (questionsError) throw new Error(questionsError.message);

  const questionMap = new Map<number, QuestionRow>();
  (questions ?? []).forEach((q) => questionMap.set(q.id, q as QuestionRow));

  const items = (answers as AnswerRow[]).map((answer) => {
    const question = questionMap.get(answer.question_id);
    const choices = question?.choices ?? [];
    const selected = choices.find((c) => c.id === answer.choice_id);
    const correct = choices.find((c) => c.is_correct);

    return {
      questionId: answer.question_id,
      prompt: question?.prompt ?? "問題が見つかりません",
      explanation: question?.explanation ?? null,
      selectedChoiceLabel: selected?.label ?? "選択肢が見つかりません",
      correctChoiceLabel: correct?.label ?? "正解が見つかりません",
      isCorrect: answer.is_correct,
    };
  });

  return { attempt: attempt as AttemptDetailRow, items };
}
