"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "認証が必要です" };

  const display_name = (formData.get("display_name") as string).trim();
  const bio = (formData.get("bio") as string).trim();

  const { error } = await supabase
    .from("profiles")
    .update({ display_name, bio })
    .eq("id", user.id);

  if (error) return { error: "更新に失敗しました" };

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/settings");
  return { success: true };
}

export async function updateTheme(theme: Record<string, string>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "認証が必要です" };

  const { error } = await supabase
    .from("profiles")
    .update({ theme })
    .eq("id", user.id);

  if (error) return { error: "テーマの更新に失敗しました" };

  revalidatePath("/dashboard/appearance");
  return { success: true };
}

export async function updateSeo(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "認証が必要です" };

  const seo = {
    title: (formData.get("seo_title") as string).trim(),
    description: (formData.get("seo_description") as string).trim(),
  };

  const { error } = await supabase
    .from("profiles")
    .update({ seo })
    .eq("id", user.id);

  if (error) return { error: "SEO設定の更新に失敗しました" };

  revalidatePath("/dashboard/settings");
  return { success: true };
}

export async function upsertSocialLink(platform: string, url: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "認証が必要です" };

  if (url.trim() === "") {
    // Delete if empty
    await supabase
      .from("social_links")
      .delete()
      .eq("user_id", user.id)
      .eq("platform", platform);
  } else {
    try {
      new URL(url);
    } catch {
      return { error: "有効なURLを入力してください" };
    }

    const { data: existing } = await supabase
      .from("social_links")
      .select("id")
      .eq("user_id", user.id)
      .eq("platform", platform)
      .single();

    if (existing) {
      await supabase
        .from("social_links")
        .update({ url })
        .eq("user_id", user.id)
        .eq("platform", platform);
    } else {
      await supabase.from("social_links").insert({
        user_id: user.id,
        platform,
        url,
      });
    }
  }

  revalidatePath("/dashboard/settings");
  return { success: true };
}
