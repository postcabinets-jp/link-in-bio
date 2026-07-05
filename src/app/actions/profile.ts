"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  updateProfileSchema,
  updateSeoSchema,
  upsertSocialLinkSchema,
  updateAvatarSchema,
  updateThemeSchema,
} from "@/lib/validations";

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "認証が必要です" };

  const parsed = updateProfileSchema.safeParse({
    display_name: (formData.get("display_name") as string)?.trim(),
    bio: (formData.get("bio") as string)?.trim(),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      display_name: parsed.data.display_name ?? null,
      bio: parsed.data.bio ?? null,
    })
    .eq("id", user.id);

  if (error) return { error: "更新に失敗しました" };

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/settings");
  return { success: true };
}

export async function updateAvatar(avatarUrl: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "認証が必要です" };

  const parsed = updateAvatarSchema.safeParse({ avatar_url: avatarUrl });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { error } = await supabase
    .from("profiles")
    .update({ avatar_url: parsed.data.avatar_url || null })
    .eq("id", user.id);

  if (error) return { error: "アバターの更新に失敗しました" };

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/settings");
  return { success: true };
}

export async function updateTheme(theme: Record<string, string>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "認証が必要です" };

  const parsed = updateThemeSchema.safeParse(theme);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { error } = await supabase
    .from("profiles")
    .update({ theme: parsed.data })
    .eq("id", user.id);

  if (error) return { error: "テーマの更新に失敗しました" };

  revalidatePath("/dashboard/appearance");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function updateSeo(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "認証が必要です" };

  const parsed = updateSeoSchema.safeParse({
    title: (formData.get("seo_title") as string)?.trim(),
    description: (formData.get("seo_description") as string)?.trim(),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { error } = await supabase
    .from("profiles")
    .update({ seo: parsed.data })
    .eq("id", user.id);

  if (error) return { error: "SEO設定の更新に失敗しました" };

  revalidatePath("/dashboard/settings");
  return { success: true };
}

export async function upsertSocialLink(platform: string, url: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "認証が必要です" };

  const parsed = upsertSocialLinkSchema.safeParse({ platform, url: url.trim() });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { platform: validPlatform, url: validUrl } = parsed.data;

  if (validUrl === "") {
    // Delete if empty
    await supabase
      .from("social_links")
      .delete()
      .eq("user_id", user.id)
      .eq("platform", validPlatform);
  } else {
    const { data: existing } = await supabase
      .from("social_links")
      .select("id")
      .eq("user_id", user.id)
      .eq("platform", validPlatform)
      .single();

    if (existing) {
      await supabase
        .from("social_links")
        .update({ url: validUrl })
        .eq("user_id", user.id)
        .eq("platform", validPlatform);
    } else {
      await supabase.from("social_links").insert({
        user_id: user.id,
        platform: validPlatform,
        url: validUrl,
      });
    }
  }

  revalidatePath("/dashboard/settings");
  return { success: true };
}

export async function getProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "認証が必要です", data: null };

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) return { error: "プロフィールの取得に失敗しました", data: null };
  return { data };
}
