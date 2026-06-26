"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function signUp(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const username = formData.get("username") as string;

  // Validate username
  if (!/^[a-zA-Z0-9_]{3,30}$/.test(username)) {
    return { error: "ユーザーネームは3〜30文字の英数字とアンダースコアのみ使用できます" };
  }

  // Check username uniqueness
  const { data: existing } = await supabase
    .from("profiles")
    .select("username")
    .eq("username", username.toLowerCase())
    .single();

  if (existing) {
    return { error: "このユーザーネームはすでに使用されています" };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username: username.toLowerCase() },
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (data.user) {
    // Create profile
    const { error: profileError } = await supabase.from("profiles").insert({
      id: data.user.id,
      username: username.toLowerCase(),
      display_name: username,
    });

    if (profileError) {
      return { error: "プロフィールの作成に失敗しました" };
    }
  }

  revalidatePath("/");
  redirect("/dashboard");
}

export async function signIn(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: "メールアドレスまたはパスワードが正しくありません" };
  }

  revalidatePath("/");
  redirect("/dashboard");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function resetPassword(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get("email") as string;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?next=/dashboard/settings`,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: "パスワードリセットメールを送信しました" };
}
