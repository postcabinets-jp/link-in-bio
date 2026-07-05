"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  createLinkSchema,
  updateLinkSchema,
  deleteLinkSchema,
  toggleLinkSchema,
  reorderLinksSchema,
} from "@/lib/validations";

export async function createLink(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "認証が必要です" };

  const parsed = createLinkSchema.safeParse({
    title: (formData.get("title") as string)?.trim(),
    url: (formData.get("url") as string)?.trim(),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { title, url } = parsed.data;

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
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "認証が必要です" };

  const parsed = updateLinkSchema.safeParse({
    id,
    title: (formData.get("title") as string)?.trim(),
    url: (formData.get("url") as string)?.trim(),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { error } = await supabase
    .from("links")
    .update({ title: parsed.data.title, url: parsed.data.url })
    .eq("id", parsed.data.id)
    .eq("user_id", user.id);

  if (error) return { error: "更新に失敗しました" };

  revalidatePath("/dashboard");
  return { success: true };
}

export async function deleteLink(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "認証が必要です" };

  const parsed = deleteLinkSchema.safeParse({ id });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { error } = await supabase
    .from("links")
    .delete()
    .eq("id", parsed.data.id)
    .eq("user_id", user.id);

  if (error) return { error: "削除に失敗しました" };

  revalidatePath("/dashboard");
  return { success: true };
}

export async function toggleLink(id: string, is_active: boolean) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "認証が必要です" };

  const parsed = toggleLinkSchema.safeParse({ id, is_active });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { error } = await supabase
    .from("links")
    .update({ is_active: parsed.data.is_active })
    .eq("id", parsed.data.id)
    .eq("user_id", user.id);

  if (error) return { error: "更新に失敗しました" };

  revalidatePath("/dashboard");
  return { success: true };
}

export async function reorderLinks(orderedIds: string[]) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "認証が必要です" };

  const parsed = reorderLinksSchema.safeParse({ orderedIds });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const results = await Promise.all(
    parsed.data.orderedIds.map((id, index) =>
      supabase
        .from("links")
        .update({ sort_order: index })
        .eq("id", id)
        .eq("user_id", user.id)
    )
  );

  if (results.some(({ error }) => error))
    return { error: "並び替えに失敗しました" };

  revalidatePath("/dashboard");
  return { success: true };
}

export async function getLinks() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "認証が必要です", data: null };

  const { data, error } = await supabase
    .from("links")
    .select("*")
    .eq("user_id", user.id)
    .order("sort_order");

  if (error) return { error: "リンクの取得に失敗しました", data: null };
  return { data };
}
