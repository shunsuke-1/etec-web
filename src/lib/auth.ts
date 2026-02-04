import { supabase } from "./supabaseClient";

export async function getLoggedInUserId(): Promise<string | null> {
  const { data } = await supabase.auth.getSession();
  return data.session?.user?.id ?? null;
}