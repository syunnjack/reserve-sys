import { createServiceRoleClient } from "@/lib/supabase/server";
import type { Reservation, Service, Shop, StaffMember } from "@/lib/types";

export async function getShopByOwner(ownerId: string): Promise<Shop | null> {
  const supabase = createServiceRoleClient();
  const { data } = await supabase.from("rsv_shops").select("*").eq("owner_id", ownerId).maybeSingle();
  return data;
}

export async function getShopBySlug(slug: string): Promise<Shop | null> {
  const supabase = createServiceRoleClient();
  const { data } = await supabase.from("rsv_shops").select("*").eq("slug", slug).maybeSingle();
  return data;
}

export async function getShopById(shopId: number): Promise<Shop | null> {
  const supabase = createServiceRoleClient();
  const { data } = await supabase.from("rsv_shops").select("*").eq("id", shopId).maybeSingle();
  return data;
}

export async function createShop(params: {
  ownerId: string;
  name: string;
  slug: string;
  businessType: string;
  description?: string;
  address?: string;
  phone?: string;
}): Promise<{ shop: Shop | null; error: string | null }> {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("rsv_shops")
    .insert({
      owner_id: params.ownerId,
      name: params.name,
      slug: params.slug,
      business_type: params.businessType,
      description: params.description ?? null,
      address: params.address ?? null,
      phone: params.phone ?? null,
    })
    .select("*")
    .single();
  if (error) return { shop: null, error: error.code === "23505" ? "このURL(スラッグ)は既に使われています。" : "作成に失敗しました。" };
  return { shop: data, error: null };
}

export async function getServices(shopId: number, activeOnly = false): Promise<Service[]> {
  const supabase = createServiceRoleClient();
  let query = supabase.from("rsv_services").select("*").eq("shop_id", shopId).order("id");
  if (activeOnly) query = query.eq("is_active", true);
  const { data } = await query;
  return data ?? [];
}

export async function createService(params: {
  shopId: number;
  name: string;
  durationMinutes: number;
  price: number;
  description?: string;
}) {
  const supabase = createServiceRoleClient();
  const { error } = await supabase.from("rsv_services").insert({
    shop_id: params.shopId,
    name: params.name,
    duration_minutes: params.durationMinutes,
    price: params.price,
    description: params.description ?? null,
  });
  return { error: error ? "メニューの追加に失敗しました。" : null };
}

export async function setServiceActive(serviceId: number, isActive: boolean) {
  const supabase = createServiceRoleClient();
  await supabase.from("rsv_services").update({ is_active: isActive }).eq("id", serviceId);
}

export async function getStaffMembers(shopId: number): Promise<StaffMember[]> {
  const supabase = createServiceRoleClient();
  const { data } = await supabase.from("rsv_staff_members").select("*").eq("shop_id", shopId).order("id");
  return data ?? [];
}

export async function inviteStaff(shopId: number, email: string, displayName?: string) {
  const supabase = createServiceRoleClient();
  const { data: profile } = await supabase.from("rsv_profiles").select("id").eq("email", email).maybeSingle();
  const { error } = await supabase.from("rsv_staff_members").insert({
    shop_id: shopId,
    email,
    display_name: displayName ?? null,
    user_id: profile?.id ?? null,
  });
  return { error: error ? (error.code === "23505" ? "既に招待済みのメールアドレスです。" : "招待に失敗しました。") : null };
}

export async function getStaffMembershipsForUser(userId: string): Promise<Array<StaffMember & { shop: Shop }>> {
  const supabase = createServiceRoleClient();
  const { data } = await supabase
    .from("rsv_staff_members")
    .select("*, shop:rsv_shops(*)")
    .eq("user_id", userId);
  return (data ?? []) as Array<StaffMember & { shop: Shop }>;
}

export async function linkStaffInvitesForNewUser(userId: string, email: string) {
  const supabase = createServiceRoleClient();
  await supabase.from("rsv_staff_members").update({ user_id: userId }).eq("email", email).is("user_id", null);
}

export async function createReservation(params: {
  shopId: number;
  serviceId: number;
  staffId: number | null;
  customerId: string;
  startAt: string;
  endAt: string;
  note?: string;
}) {
  const supabase = createServiceRoleClient();
  const { error } = await supabase.from("rsv_reservations").insert({
    shop_id: params.shopId,
    service_id: params.serviceId,
    staff_id: params.staffId,
    customer_id: params.customerId,
    start_at: params.startAt,
    end_at: params.endAt,
    note: params.note ?? null,
  });
  return { error: error ? "予約に失敗しました。" : null };
}

export async function getShopReservations(shopId: number) {
  const supabase = createServiceRoleClient();
  const { data } = await supabase
    .from("rsv_reservations")
    .select("*, service:rsv_services(name), customer:rsv_profiles(full_name, email, phone), staff:rsv_staff_members(display_name, email)")
    .eq("shop_id", shopId)
    .order("start_at", { ascending: true });
  return data ?? [];
}

export async function getStaffReservations(staffId: number) {
  const supabase = createServiceRoleClient();
  const { data } = await supabase
    .from("rsv_reservations")
    .select("*, service:rsv_services(name), customer:rsv_profiles(full_name, phone)")
    .eq("staff_id", staffId)
    .order("start_at", { ascending: true });
  return data ?? [];
}

export async function getCustomerReservations(customerId: string) {
  const supabase = createServiceRoleClient();
  const { data } = await supabase
    .from("rsv_reservations")
    .select("*, service:rsv_services(name, duration_minutes, price), shop:rsv_shops(name, slug)")
    .eq("customer_id", customerId)
    .order("start_at", { ascending: false });
  return data ?? [];
}

export async function cancelReservation(reservationId: number) {
  const supabase = createServiceRoleClient();
  await supabase.from("rsv_reservations").update({ status: "cancelled" }).eq("id", reservationId);
}

export async function getReservationsForAvailability(shopId: number, staffId: number | null, dateStart: string, dateEnd: string): Promise<Reservation[]> {
  const supabase = createServiceRoleClient();
  let query = supabase
    .from("rsv_reservations")
    .select("*")
    .eq("shop_id", shopId)
    .neq("status", "cancelled")
    .gte("start_at", dateStart)
    .lt("start_at", dateEnd);
  if (staffId) query = query.eq("staff_id", staffId);
  const { data } = await query;
  return data ?? [];
}
