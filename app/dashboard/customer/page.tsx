import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getCustomerReservations } from "@/lib/data";
import { signOut } from "@/app/actions/auth";
import { cancelReservationAction } from "@/app/actions/customer";

export default async function CustomerDashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const reservations = await getCustomerReservations(user.id);

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">マイページ</p>
          <h1 className="text-2xl font-bold text-slate-900">予約履歴</h1>
        </div>
        <form action={signOut}>
          <button type="submit" className="text-sm text-slate-500 underline">
            ログアウト
          </button>
        </form>
      </div>

      <ul className="mt-6 space-y-3">
        {reservations.map((reservation: any) => (
          <li key={reservation.id} className="rounded border border-slate-200 p-4">
            <p className="font-bold text-slate-900">{reservation.shop?.name}</p>
            <p className="mt-1 text-sm text-slate-600">
              {new Date(reservation.start_at).toLocaleString("ja-JP")} / {reservation.service?.name}(
              {reservation.service?.duration_minutes}分)
            </p>
            <p className="text-sm text-slate-500">状態: {reservation.status}</p>
            {reservation.status === "confirmed" && (
              <form action={cancelReservationAction.bind(null, reservation.id)} className="mt-2">
                <button type="submit" className="text-sm text-red-600">
                  キャンセルする
                </button>
              </form>
            )}
          </li>
        ))}
        {reservations.length === 0 && <p className="text-sm text-slate-500">まだ予約がありません。</p>}
      </ul>
    </div>
  );
}
