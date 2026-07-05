"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  updateThemeSchema,
  updateCustomCssSchema,
  updateLayoutSchema,
} from "@/lib/validations";
import type { ThemeConfig } from "@/types/database";

export async function updateAppearance(theme: ThemeConfig) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "認証が必要です" };

  const parsed = updateThemeSchema.safeParse(theme);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  // Read existing theme to preserve custom_css and layout
  const { data: profile } = await supabase
    .from("profiles")
    .select("theme")
    .eq("id", user.id)
    .single();

  const existingTheme = (profile?.theme as Record<string, unknown>) ?? {};

  const merged = {
    ...existingTheme,
    ...parsed.data,
  };

  const { error } = await supabase
    .from("profiles")
    .update({ theme: merged })
    .eq("id", user.id);

  if (error) return { error: "テーマの更新に失敗しました" };

  revalidatePath("/dashboard/appearance");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function updateCustomCss(customCss: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "認証が必要です" };

  const parsed = updateCustomCssSchema.safeParse({ custom_css: customCss });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  // Merge into existing theme JSONB
  const { data: profile } = await supabase
    .from("profiles")
    .select("theme")
    .eq("id", user.id)
    .single();

  const existingTheme = (profile?.theme as Record<string, unknown>) ?? {};

  const merged = {
    ...existingTheme,
    custom_css: parsed.data.custom_css,
  };

  const { error } = await supabase
    .from("profiles")
    .update({ theme: merged })
    .eq("id", user.id);

  if (error) return { error: "カスタムCSSの更新に失敗しました" };

  revalidatePath("/dashboard/appearance");
  return { success: true };
}

export async function updateLayout(layout: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "認証が必要です" };

  const parsed = updateLayoutSchema.safeParse({ layout });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  // Merge into existing theme JSONB
  const { data: profile } = await supabase
    .from("profiles")
    .select("theme")
    .eq("id", user.id)
    .single();

  const existingTheme = (profile?.theme as Record<string, unknown>) ?? {};

  const merged = {
    ...existingTheme,
    layout: parsed.data.layout,
  };

  const { error } = await supabase
    .from("profiles")
    .update({ theme: merged })
    .eq("id", user.id);

  if (error) return { error: "レイアウトの更新に失敗しました" };

  revalidatePath("/dashboard/appearance");
  return { success: true };
}

export async function getAppearance() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "認証が必要です", data: null };

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("theme")
    .eq("id", user.id)
    .single();

  if (error) return { error: "テーマの取得に失敗しました", data: null };
  return { data: profile?.theme };
}
