export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
}

export interface Shop {
  id: number;
  owner_id: string;
  slug: string;
  name: string;
  business_type: string;
  description: string | null;
  address: string | null;
  phone: string | null;
}

export interface Service {
  id: number;
  shop_id: number;
  name: string;
  duration_minutes: number;
  price: number;
  description: string | null;
  is_active: boolean;
}

export interface StaffMember {
  id: number;
  shop_id: number;
  email: string;
  user_id: string | null;
  display_name: string | null;
}

export interface Reservation {
  id: number;
  shop_id: number;
  service_id: number;
  staff_id: number | null;
  customer_id: string;
  start_at: string;
  end_at: string;
  status: "confirmed" | "cancelled" | "completed";
  note: string | null;
}

export const BUSINESS_TYPES = [
  { value: "seitai", label: "整体院・接骨院" },
  { value: "hair_salon", label: "美容院・理容室" },
  { value: "restaurant", label: "飲食店" },
  { value: "other", label: "その他" },
];
