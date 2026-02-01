import { supabase } from "../../lib/supabaseClient";
import type { Question, QuestionLevel } from "../../types/quiz";

export async function fetchQuestionsByLevel(level: QuestionLevel): Promise<Question[]> {
  // choices をネストして取ります（Supabaseの join 機能）
  const { data, error } = await supabase
    .from("questions")
    .select(`
      id, level, category, prompt, explanation,
      choices ( id, label, is_correct )
    `)
    .eq("level", level)
    .order("id", { ascending: true });

  if (error) throw new Error(error.message);

  // choices の順序を揃えたい場合は後で order 追加します（まずは動けばOK）
  return (data ?? []) as unknown as Question[];
}