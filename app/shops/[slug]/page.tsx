import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServices, getShopBySlug } from "@/lib/data";
import { BUSINESS_TYPES } from "@/lib/types";
import { createReservationAction } from "@/app/actions/customer";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const shop = await getShopBySlug(slug);
  if (!shop) return {};
  return {
    title: shop.name,
    description: shop.description ?? undefined,
    alternates: { canonical: `/shops/${shop.slug}` },
  };
}

export default async function ShopPublicPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { slug } = await params;
  const { error } = await searchParams;
  const shop = await getShopBySlug(slug);
  if (!shop) notFound();

  const services = await getServices(shop.id, true);
  const businessTypeLabel = BUSINESS_TYPES.find((type) => type.value === shop.business_type)?.label ?? "店舗";
  const boundReserve = createReservationAction.bind(null, shop.id, shop.slug);

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <p className="text-sm text-slate-500">{businessTypeLabel}</p>
      <h1 className="mt-1 text-2xl font-bold text-slate-900">{shop.name}</h1>
      {shop.description && <p className="mt-2 text-slate-600">{shop.description}</p>}
      <div className="mt-2 text-sm text-slate-500">
        {shop.address && <p>{shop.address}</p>}
        {shop.phone && <p>{shop.phone}</p>}
      </div>

      {error && <p className="mt-4 rounded bg-red-50 p-3 text-sm text-red-700">予約できませんでした。内容をご確認ください。</p>}

      <section className="mt-8">
        <h2 className="text-lg font-bold text-slate-900">ご予約</h2>
        <form action={boundReserve} className="mt-4 space-y-3 rounded border border-slate-200 p-4">
          <label className="block text-sm">
            メニュー
            <select name="serviceId" required className="mt-1 w-full rounded border border-slate-300 px-3 py-2">
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name}({service.duration_minutes}分 / {service.price.toLocaleString()}円)
                </option>
              ))}
            </select>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block text-sm">
              日付
              <input type="date" name="date" required className="mt-1 w-full rounded border border-slate-300 px-3 py-2" />
            </label>
            <label className="block text-sm">
              時間
              <input type="time" name="time" required className="mt-1 w-full rounded border border-slate-300 px-3 py-2" />
            </label>
          </div>
          <label className="block text-sm">
            ご要望など
            <textarea name="note" rows={2} className="mt-1 w-full rounded border border-slate-300 px-3 py-2" />
          </label>
          <button type="submit" className="w-full rounded bg-blue-600 py-2 font-bold text-white">
            予約する(ログインが必要です)
          </button>
        </form>
        {services.length === 0 && <p className="mt-2 text-sm text-slate-500">現在予約可能なメニューはありません。</p>}
      </section>
    </div>
  );
}
