import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-gray-100 px-6 py-4 flex items-center justify-between max-w-5xl mx-auto">
        <span className="font-bold text-xl tracking-tight text-gray-900">link-in-bio</span>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
            ログイン
          </Link>
          <Link href="/register">
            <Button size="sm">無料で始める</Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
        <span className="inline-block text-xs font-semibold tracking-widest text-gray-400 uppercase mb-4">
          Open Source · Self-Hostable
        </span>
        <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 leading-tight tracking-tight">
          あなたのリンクを<br className="hidden sm:block" />
          <span className="text-gray-500">一ページに。</span>
        </h1>
        <p className="mt-6 text-lg text-gray-500 max-w-xl mx-auto leading-relaxed">
          Linktreeの完全OSS代替。SNSプロフィールのリンクを1つのURLにまとめ、
          デザインを自由にカスタマイズ。Vercel + Supabaseで自分のインフラに展開できます。
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/register">
            <Button size="lg" className="w-full sm:w-auto">
              無料で始める
            </Button>
          </Link>
          <a
            href="https://github.com/postcabinets-jp/link-in-bio"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2">
              <GitHubIcon className="w-4 h-4" />
              GitHub で見る
            </Button>
          </a>
        </div>
        <div className="mt-6">
          <a
            href="https://vercel.com/new/clone?repository-url=https://github.com/postcabinets-jp/link-in-bio&env=NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY&envDescription=Supabase project credentials&project-name=link-in-bio&repository-name=link-in-bio"
            target="_blank"
            rel="noopener noreferrer"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://vercel.com/button" alt="Deploy with Vercel" className="mx-auto h-9" />
          </a>
        </div>
      </section>

      {/* Demo preview */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="bg-gray-50 rounded-2xl border border-gray-200 p-8 flex justify-center">
          <div
            className="w-full max-w-xs rounded-xl border border-gray-200 shadow-lg p-6 text-center"
            style={{ backgroundColor: "#fafaf8", fontFamily: "Georgia, serif" }}
          >
            <div className="w-16 h-16 rounded-full bg-gray-900 text-white flex items-center justify-center text-2xl font-bold mx-auto mb-3">
              Y
            </div>
            <p className="font-bold text-gray-900">田中 雪</p>
            <p className="text-xs text-gray-500 mt-1 mb-5">フォトグラファー｜東京</p>
            {["📷 最新作品集", "🛒 プリント販売中", "📅 撮影予約受付"].map((label) => (
              <div
                key={label}
                className="w-full rounded-full text-sm py-2.5 mb-2.5 font-medium"
                style={{ backgroundColor: "#2d2d2d", color: "#fafaf8" }}
              >
                {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-gray-100 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Linktreeとの違い</h2>
          <div className="grid sm:grid-cols-3 gap-8">
            {FEATURES.map((f) => (
              <div key={f.title} className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="text-2xl mb-3">{f.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature list */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">すべての機能が無料</h2>
        <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
          {FEATURE_LIST.map((f) => (
            <div key={f} className="flex items-center gap-3 text-sm text-gray-700">
              <svg className="w-4 h-4 text-gray-900 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {f}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-900 text-white">
        <div className="max-w-5xl mx-auto px-6 py-16 text-center">
          <h2 className="text-3xl font-bold mb-4">自分のリンクページを今すぐ作る</h2>
          <p className="text-gray-400 mb-8">
            登録不要でも、Vercelへの1クリックデプロイで自分のインフラに展開できます
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 w-full sm:w-auto">
                無料アカウントを作成
              </Button>
            </Link>
            <a
              href="https://vercel.com/new/clone?repository-url=https://github.com/postcabinets-jp/link-in-bio&env=NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY&envDescription=Supabase project credentials&project-name=link-in-bio&repository-name=link-in-bio"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900 w-full sm:w-auto">
                Vercelにデプロイ
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 px-6 py-8">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-400">
          <span>link-in-bio — MIT License</span>
          <div className="flex gap-6">
            <a href="https://github.com/postcabinets-jp/link-in-bio" target="_blank" rel="noopener noreferrer" className="hover:text-gray-600">GitHub</a>
            <a href="https://postcabinets.co.jp" target="_blank" rel="noopener noreferrer" className="hover:text-gray-600">POST CABINETS</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

const FEATURES = [
  {
    icon: "🎨",
    title: "フルカスタマイズ無料",
    desc: "テーマ・カラー・フォント・ボタンスタイルをすべて無料でカスタマイズ。Linktreeは有料プランでしか変更できない機能が最初から使えます。",
  },
  {
    icon: "📊",
    title: "アナリティクス完備",
    desc: "クリック数・日別推移・リファラー・国別をダッシュボードで確認。データは自分のSupabaseに蓄積されるので完全にコントロール可能。",
  },
  {
    icon: "🚀",
    title: "自分のインフラで動く",
    desc: "Vercel + Supabaseに1クリックでデプロイ。月額0円から運用でき、カスタムドメインにも対応。データは自分のDBに残ります。",
  },
];

const FEATURE_LIST = [
  "リンクの追加・編集・削除",
  "ドラッグ&ドロップで並べ替え",
  "テーマ（5種類）選択",
  "カラーカスタマイズ（背景・ボタン・テキスト）",
  "ボタンスタイル（4種類）選択",
  "クリックアナリティクス",
  "SNSアイコンリンク（6種類）",
  "OGP / SEOメタタグ設定",
  "Google OAuthログイン",
  "モバイルファースト設計",
  "Vercelワンクリックデプロイ",
  "MITライセンス（商用利用可）",
];

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}
