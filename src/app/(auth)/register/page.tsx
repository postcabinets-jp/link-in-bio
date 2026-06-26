"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const username = (formData.get("username") as string).toLowerCase().trim();

    if (!/^[a-zA-Z0-9_]{3,30}$/.test(username)) {
      setError("ユーザーネームは3〜30文字の英数字とアンダースコアのみ使用できます");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("パスワードは8文字以上で入力してください");
      setLoading(false);
      return;
    }

    const supabase = createClient();

    // Check username uniqueness
    const { data: existing } = await supabase
      .from("profiles")
      .select("username")
      .eq("username", username)
      .single();

    if (existing) {
      setError("このユーザーネームはすでに使用されています");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username } },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      await supabase.from("profiles").insert({
        id: data.user.id,
        username,
        display_name: username,
      });
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
      <h1 className="text-xl font-semibold text-gray-900 mb-6">新規登録</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="username">ユーザーネーム</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm select-none">
              link-in-bio.vercel.app/
            </span>
            <Input
              id="username"
              name="username"
              type="text"
              required
              className="pl-[168px]"
              placeholder="yourname"
              pattern="[a-zA-Z0-9_]{3,30}"
            />
          </div>
          <p className="text-xs text-gray-400">英数字とアンダースコアのみ（3〜30文字）</p>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">メールアドレス</Label>
          <Input id="email" name="email" type="email" required autoComplete="email" />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password">パスワード</Label>
          <Input id="password" name="password" type="password" required autoComplete="new-password" minLength={8} />
          <p className="text-xs text-gray-400">8文字以上</p>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "登録中..." : "アカウントを作成"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        すでにアカウントをお持ちの方は{" "}
        <Link href="/login" className="font-medium text-gray-900 hover:underline">
          ログイン
        </Link>
      </p>
    </div>
  );
}
