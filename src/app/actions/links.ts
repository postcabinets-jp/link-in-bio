"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createLink(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "認証が必要です" };

  const title = (formData.get("title") as string).trim();
  const url = (formData.get("url") as string).trim();

  if (!title || !url) return { error: "タイトルとURLは必須です" };

  // Validate URL
  try {
    new URL(url);
  } catch {
    return { error: "有効なURLを入力してください" };
  }

  // Get current max sort_order
  const { data: existing } = await supabase
    .from("links")
    .select("sort_order")
    .eq("user_id", user.id)
    .order("sort_order", { ascending: false })
    .limit(1)
    .single();

  const sort_order = existing ? existing.sort_order + 1 : 0;

  const { error } = await supabase.from("links").insert({
    user_id: user.id,
    title,
    url,
    sort_order,
  });

  if (error) return { error: "リンクの追加に失敗しました" };

  revalidatePath("/dashboard");
  return { success: true };
}

export async function updateLink(id: string, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "認証が必要です" };

  const title = (formData.get("title") as string).trim();
  const url = (formData.get("url") as string).trim();

  if (!title || !url) return { error: "タイトルとURLは必須です" };

  try {
    new URL(url);
  } catch {
    return { error: "有効なURLを入力してください" };
  }

  const { error } = await supabase
    .from("links")
    .update({ title, url })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { error: "更新に失敗しました" };

  revalidatePath("/dashboard");
  return { success: true };
}

export async function deleteLink(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "認証が必要です" };

  const { error } = await supabase
    .from("links")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { error: "削除に失敗しました" };

  revalidatePath("/dashboard");
  return { success: true };
}

export async function toggleLink(id: string, is_active: boolean) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "認証が必要です" };

  const { error } = await supabase
    .from("links")
    .update({ is_active })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { error: "更新に失敗しました" };

  revalidatePath("/dashboard");
  return { success: true };
}

export async function reorderLinks(orderedIds: string[]) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "認証が必要です" };

  const results = await Promise.all(
    orderedIds.map((id, index) =>
      supabase.from("links").update({ sort_order: index }).eq("id", id).eq("user_id", user.id)
    )
  );

  if (results.some(({ error }) => error)) return { error: "並び替えに失敗しました" };

  revalidatePath("/dashboard");
  return { success: true };
}
