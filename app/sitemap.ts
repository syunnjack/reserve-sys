import type { MetadataRoute } from "next";
import { listShops } from "@/lib/data";
import { resolveBaseUrl } from "@/lib/site";

// ログイン画面はサイトマップに載せない。中身がフォームだけで、
// 検索から来た人の役に立たないため、申告しても登録されない。
// 代わりに、公開されている店舗ページを載せる（king-sys と同じ扱い）。
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = resolveBaseUrl();

  // このルートはビルド時にも実行される。Supabase に届かないと
  // ビルドごと失敗するので、店舗が取れなくても固定ページだけは返す。
  let shops: Awaited<ReturnType<typeof listShops>> = [];
  try {
    shops = await listShops();
  } catch {
    shops = [];
  }

  return [
    { url: `${baseUrl}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${baseUrl}/signup`, changeFrequency: "monthly", priority: 0.5 },
    ...shops.map((shop) => ({
      url: `${baseUrl}/shops/${shop.slug}`,
      changeFrequency: "hourly" as const,
      priority: 0.8,
    })),
  ];
}
