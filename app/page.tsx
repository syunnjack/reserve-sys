import Link from "next/link";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

export default function Home() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-bold text-slate-900">{SITE_NAME}</h1>
      <p className="mt-3 text-lg text-slate-600">{SITE_DESCRIPTION}</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-slate-200 p-4">
          <p className="font-bold text-slate-900">お客さん</p>
          <p className="mt-1 text-sm text-slate-600">お店のページからメニューを選んで予約。予約履歴もいつでも確認できます。</p>
        </div>
        <div className="rounded-lg border border-slate-200 p-4">
          <p className="font-bold text-slate-900">オーナー</p>
          <p className="mt-1 text-sm text-slate-600">お店を開設し、メニュー・スタッフ・予約状況をまとめて管理できます。</p>
        </div>
        <div className="rounded-lg border border-slate-200 p-4">
          <p className="font-bold text-slate-900">スタッフ</p>
          <p className="mt-1 text-sm text-slate-600">オーナーから招待されたメールアドレスで登録すると、自分の担当予約だけを確認できます。</p>
        </div>
      </div>

      <div className="mt-8 flex gap-4">
        <Link href="/signup" className="rounded bg-blue-600 px-6 py-3 font-bold text-white">
          無料で始める
        </Link>
        <Link href="/login" className="rounded border border-slate-300 px-6 py-3 font-bold text-slate-700">
          ログイン
        </Link>
      </div>
    </div>
  );
}
