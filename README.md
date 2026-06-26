# link-in-bio

SNSプロフィールのリンクを1ページにまとめる、Linktreeの完全OSS代替。

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/postcabinets-jp/link-in-bio&env=NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY&envDescription=Supabase%20project%20credentials&project-name=link-in-bio&repository-name=link-in-bio)

---

## なぜ link-in-bio？

Linktreeは7,000万人が使うサービスですが、デザインカスタマイズ・アナリティクス・カスタムドメインはすべて有料プラン（月額$5〜24）。このプロジェクトはその機能を**すべて無料でセルフホスト**できます。

| 機能 | Linktree無料 | link-in-bio |
|---|---|---|
| テーマカスタマイズ | 制限あり（有料） | 無制限・無料 |
| カラー変更 | 有料のみ | 無料 |
| クリックアナリティクス | 7日間のみ | 30日間（拡張可） |
| カスタムドメイン | 有料 | 自前インフラで対応可 |
| データの所有権 | Linktreeのサーバー | 自分のSupabase |

---

## 機能

- リンクの追加・編集・削除・ドラッグ&ドロップ並べ替え
- 5種類のテーマ + カラーフルカスタマイズ（背景・ボタン・テキスト）
- 4種類のボタンスタイル（角丸・ピル・スクエア・アウトライン）
- クリックアナリティクス（日別推移・リンク別・流入元）
- SNSアイコンリンク（X / Instagram / YouTube / TikTok / LinkedIn / GitHub）
- OGP / SEOメタタグ設定
- メール・パスワード認証 + Google OAuth
- 公開プロフィールページ（`/[username]`）
- モバイルファースト設計（375px〜対応）
- Vercel + Supabase 1クリックデプロイ

---

## Quick Start（セルフホスト）

### 必要なもの
- [Vercel](https://vercel.com) アカウント
- [Supabase](https://supabase.com) アカウント（無料プランで十分）

### 手順

1. **Supabaseプロジェクト作成**
   - [supabase.com](https://supabase.com) でプロジェクトを作成
   - `Settings > API` から `Project URL` と `anon key` をコピー

2. **DBスキーマ適用**
   - `supabase/migrations/001_initial_schema.sql` を Supabase SQL Editor で実行

3. **Vercelデプロイ**
   - 上の「Deploy with Vercel」ボタンをクリック
   - 環境変数 `NEXT_PUBLIC_SUPABASE_URL`、`NEXT_PUBLIC_SUPABASE_ANON_KEY` を設定
   - デプロイ完了

### ローカル開発

```bash
git clone https://github.com/postcabinets-jp/link-in-bio
cd link-in-bio

cp .env.example .env.local
# .env.local に Supabase の接続情報を記入

npm install
npm run dev
```

---

## Tech Stack

- [Next.js 16](https://nextjs.org) (App Router, TypeScript strict)
- [Supabase](https://supabase.com) (PostgreSQL + Auth + RLS)
- [Tailwind CSS v4](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com)
- [@dnd-kit](https://dndkit.com) (ドラッグ&ドロップ)
- [Recharts](https://recharts.org) (アナリティクスグラフ)
- [Vercel](https://vercel.com) (デプロイ)

---

## 環境変数

| 変数 | 説明 |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `NEXT_PUBLIC_APP_URL` | 本番URL（例: `https://yourdomain.com`） |

---

## ロードマップ

- [ ] アバター画像アップロード（Supabase Storage）
- [ ] カスタムドメイン設定UI
- [ ] リンクのスケジュール表示/非表示
- [ ] メール収集フォーム連携

---

## License

MIT License — 商用利用可。詳細は [LICENSE](./LICENSE) を参照。

---

Built by [POST CABINETS](https://postcabinets.co.jp)
