import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getStaffMembershipsForUser, getStaffReservations } from "@/lib/data";
import { signOut } from "@/app/actions/auth";

export default async function StaffDashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const memberships = await getStaffMembershipsForUser(user.id);
  if (memberships.length === 0) redirect("/dashboard/customer");

  const reservationsByShop = await Promise.all(
    memberships.map(async (membership) => ({
      membership,
      reservations: await getStaffReservations(membership.id),
    }))
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">スタッフダッシュボード</p>
          <h1 className="text-2xl font-bold text-slate-900">担当予約一覧</h1>
        </div>
        <form action={signOut}>
          <button type="submit" className="text-sm text-slate-500 underline">
            ログアウト
          </button>
        </form>
      </div>

      {reservationsByShop.map(({ membership, reservations }) => (
        <section key={membership.id} className="mt-8">
          <h2 className="text-lg font-bold text-slate-900">{membership.shop.name}</h2>
          <ul className="mt-3 space-y-2">
            {reservations.map((reservation: any) => (
              <li key={reservation.id} className="rounded border border-slate-200 p-3">
                <p className="font-bold text-slate-900">
                  {new Date(reservation.start_at).toLocaleString("ja-JP")} - {reservation.service?.name}
                </p>
                <p className="text-sm text-slate-500">
                  お客様: {reservation.customer?.full_name || "不明"} / 状態: {reservation.status}
                </p>
                {reservation.note && <p className="mt-1 text-sm text-slate-600">メモ: {reservation.note}</p>}
              </li>
            ))}
            {reservations.length === 0 && <p className="text-sm text-slate-500">担当の予約はまだありません。</p>}
          </ul>
        </section>
      ))}
    </div>
  );
}
