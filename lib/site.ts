export const SITE_NAME = "リザブシス";
export const SITE_DESCRIPTION =
  "整体院・美容院・飲食店など、業種を問わず使える汎用予約管理システム。お客さん・オーナー・スタッフでそれぞれ見える画面を分けています。";

const FALLBACK_BASE_URL = "http://localhost:3000";

export function resolveBaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL;
  if (!url) return FALLBACK_BASE_URL;
  try {
    new URL(url);
    return url;
  } catch {
    return FALLBACK_BASE_URL;
  }
}
