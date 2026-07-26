import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getShopByOwner, getServices, getStaffMembers, getShopReservations } from "@/lib/data";
import { BUSINESS_TYPES } from "@/lib/types";
import { createShopAction, createServiceAction, toggleServiceAction, inviteStaffAction } from "@/app/actions/owner";
import { signOut } from "@/app/actions/auth";

export default async function OwnerDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const shop = await getShopByOwner(user.id);

  if (!shop) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16">
        <h1 className="text-2xl font-bold text-slate-900">お店を開設する</h1>
        <p className="mt-2 text-sm text-slate-600">
          整体院・美容院・飲食店など、業種を問わず利用できます。
        </p>
        {error && <p className="mt-3 rounded bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <form action={createShopAction} className="mt-6 space-y-4">
          <label className="block text-sm">
            店舗名
            <input name="name" required className="mt-1 w-full rounded border border-slate-300 px-3 py-2" />
          </label>
          <label className="block text-sm">
            業種
            <select name="businessType" className="mt-1 w-full rounded border border-slate-300 px-3 py-2">
              {BUSINESS_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            紹介文
            <textarea name="description" rows={3} className="mt-1 w-full rounded border border-slate-300 px-3 py-2" />
          </label>
          <label className="block text-sm">
            住所
            <input name="address" className="mt-1 w-full rounded border border-slate-300 px-3 py-2" />
          </label>
          <label className="block text-sm">
            電話番号
            <input name="phone" className="mt-1 w-full rounded border border-slate-300 px-3 py-2" />
          </label>
          <button type="submit" className="w-full rounded bg-blue-600 py-2 font-bold text-white">
            開設する
          </button>
        </form>
      </div>
    );
  }

  const [services, staff, reservations] = await Promise.all([
    getServices(shop.id),
    getStaffMembers(shop.id),
    getShopReservations(shop.id),
  ]);

  const boundCreateService = createServiceAction.bind(null, shop.id);
  const boundInviteStaff = inviteStaffAction.bind(null, shop.id);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">オーナーダッシュボード</p>
          <h1 className="text-2xl font-bold text-slate-900">{shop.name}</h1>
          <a href={`/shops/${shop.slug}`} className="text-sm text-blue-600">
            店舗ページを見る: /shops/{shop.slug}
          </a>
        </div>
        <form action={signOut}>
          <button type="submit" className="text-sm text-slate-500 underline">
            ログアウト
          </button>
        </form>
      </div>

      <section className="mt-10">
        <h2 className="text-lg font-bold text-slate-900">メニュー管理</h2>
        <ul className="mt-3 space-y-2">
          {services.map((service) => (
            <li key={service.id} className="flex items-center justify-between rounded border border-slate-200 p-3">
              <div>
                <p className="font-bold text-slate-900">{service.name}</p>
                <p className="text-sm text-slate-500">
                  {service.duration_minutes}分 / {service.price.toLocaleString()}円
                </p>
              </div>
              <form action={toggleServiceAction.bind(null, service.id, !service.is_active)}>
                <button type="submit" className="text-sm text-blue-600">
                  {service.is_active ? "非公開にする" : "公開する"}
                </button>
              </form>
            </li>
          ))}
        </ul>
        <form action={boundCreateService} className="mt-4 grid gap-2 rounded border border-slate-200 p-4 sm:grid-cols-2">
          <input name="name" placeholder="メニュー名" required className="rounded border border-slate-300 px-3 py-2 sm:col-span-2" />
          <input name="durationMinutes" type="number" placeholder="所要時間(分)" defaultValue={60} required className="rounded border border-slate-300 px-3 py-2" />
          <input name="price" type="number" placeholder="料金(円)" defaultValue={0} required className="rounded border border-slate-300 px-3 py-2" />
          <textarea name="description" placeholder="説明" className="rounded border border-slate-300 px-3 py-2 sm:col-span-2" />
          <button type="submit" className="rounded bg-blue-600 py-2 font-bold text-white sm:col-span-2">
            メニューを追加
          </button>
        </form>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-bold text-slate-900">スタッフ管理</h2>
        <ul className="mt-3 space-y-2">
          {staff.map((member) => (
            <li key={member.id} className="rounded border border-slate-200 p-3">
              <p className="font-bold text-slate-900">{member.display_name || member.email}</p>
              <p className="text-sm text-slate-500">
                {member.email} / {member.user_id ? "登録済み" : "招待中(未ログイン)"}
              </p>
            </li>
          ))}
        </ul>
        <form action={boundInviteStaff} className="mt-4 grid gap-2 rounded border border-slate-200 p-4 sm:grid-cols-2">
          <input name="email" type="email" placeholder="スタッフのメールアドレス" required className="rounded border border-slate-300 px-3 py-2" />
          <input name="displayName" placeholder="表示名" className="rounded border border-slate-300 px-3 py-2" />
          <button type="submit" className="rounded bg-blue-600 py-2 font-bold text-white sm:col-span-2">
            招待する
          </button>
        </form>
        <p className="mt-2 text-xs text-slate-500">
          招待したメールアドレスでスタッフが新規登録すると、自動的にこのお店のスタッフとして紐づきます。
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-bold text-slate-900">予約一覧</h2>
        <ul className="mt-3 space-y-2">
          {reservations.map((reservation: any) => (
            <li key={reservation.id} className="rounded border border-slate-200 p-3">
              <p className="font-bold text-slate-900">
                {new Date(reservation.start_at).toLocaleString("ja-JP")} - {reservation.service?.name}
              </p>
              <p className="text-sm text-slate-500">
                お客様: {reservation.customer?.full_name || reservation.customer?.email} / 担当:{" "}
                {reservation.staff?.display_name || "未指定"} / 状態: {reservation.status}
              </p>
            </li>
          ))}
          {reservations.length === 0 && <p className="text-sm text-slate-500">まだ予約がありません。</p>}
        </ul>
      </section>
    </div>
  );
}
