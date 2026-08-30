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

      {/* 本文が3枚のカードだけで274字しかなく、何ができるサービスなのかHTMLから読み取れなかった。
          実装している範囲だけを書く。まだ無い機能は書かない。 */}
      <section className="mt-16 space-y-8 text-slate-700">
        <div>
          <h2 className="text-xl font-bold text-slate-900">使い始めるまで</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-6">
            <li>メールアドレスで登録します。クレジットカードは要りません。</li>
            <li>お店の名前とURL（slug）を決めると、公開ページが作られます。</li>
            <li>メニューを登録します。所要時間と料金を入れておくと、予約時にそのまま表示されます。</li>
            <li>スタッフがいる場合は、メールアドレスで招待します。招待されたスタッフは、自分の担当予約だけを見られます。</li>
          </ol>
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-900">予約の受け方</h2>
          <p className="mt-3">
            お客さんは、お店の公開ページからメニューと日時を選んで予約します。
            空いている時間は、登録済みの予約とスタッフの割り当てから計算して表示されます。
            予約はお客さん側からも取り消せます。
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-900">見える画面が3つに分かれています</h2>
          <p className="mt-3">
            同じ画面を権限で出し分けるのではなく、お客さん・オーナー・スタッフでそれぞれ別の画面を用意しています。
            スタッフには他の人の担当予約や売上は見えません。
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-900">今の状態について</h2>
          <p className="mt-3">
            まだ試作の段階です。今できるのは、お店の開設、メニューの登録と公開の切り替え、
            スタッフの招待、予約の受付と取り消しまでです。
            オンライン決済や、メール・SMSでのリマインダーはまだありません。
          </p>
        </div>
      </section>
    </div>
  );
}
