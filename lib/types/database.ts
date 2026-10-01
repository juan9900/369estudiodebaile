export type UserRole = "customer" | "admin";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

import type { ClassType } from "@/constants";

export interface DanceClass {
  id: string;
  title: string;
  description: string | null;
  instructor: string;
  /** Null for class_type = "fijas" (recurring weekly class, no single date). */
  scheduled_date: string | null;
  start_time: string;
  end_time: string;
  max_capacity: number;
  current_enrollment: number;
  price: number | null;
  genre: number;
  level: number;
  is_active: boolean;
  cancelled_at: string | null;
  created_by: string | null;
  created_at: string;
  // Detail-page fields (added in migration 002)
  image_url: string | null;
  video_url: string | null;
  instructor_bio: string | null;
  instructor_photo_url: string | null;
  dance_style: string | null;
  difficulty_level: "principiante" | "intermedio" | "avanzado" | null;
  song_title: string | null;
  song_artist: string | null;
  song_youtube_url: string | null;
  class_type: ClassType;
  /** For class_type = "fijas": weekday of the earliest slot, mirrored from fixed_class_slots by a DB trigger. 0=domingo..6=sábado (matches JS getUTCDay()). Read fixed_class_slots directly for the full weekly schedule. */
  weekday: number | null;
  instructor_instagram_url: string | null;
  use_genre_as_title: boolean;
  /** For class_type = "fijas": earliest date the class can be taught. No session/cycle starts before this date. */
  starts_on: string | null;
  /** Timestamp from which the class is visible on the public site. NULL = visible as soon as is_active. */
  published_at: string | null;
}

/** A weekly meeting time for a class_type = "fijas" class — see supabase/migrations/018_fixed_class_slots.sql. */
export interface FixedClassSlot {
  id: string;
  class_id: string;
  weekday: number;
  start_time: string;
  end_time: string;
}

export type RegistrationStatus = "pending" | "confirmed" | "cancelled";
export type PaymentMethod = "zelle" | "binance" | "bs" | "efectivo";

export interface Registration {
  id: string;
  user_id: string | null;
  class_id: string;
  status: RegistrationStatus;
  notes: string | null;
  created_at: string;
  payment_method: PaymentMethod | null;
  transaction_id: string | null;
  contact_name: string;
  contact_lastname: string;
  contact_phone: string;
  contact_email: string;
  money_returned: boolean;
  discount_applied: boolean;
  paid_amount: number | null;
  promo_pack: number | null;
  purchase_id: string | null;
  /** Fixed-class ("fijas") purchases only: date of the first session in this rolling cycle. */
  cycle_start_date: string | null;
  /** Fixed-class ("fijas") purchases only: date of the last session in this rolling cycle. */
  cycle_end_date: string | null;
  /** Sessions covered by this cycle: SESSIONS_PER_CYCLE * number of weekly slots on the class. */
  cycle_sessions: number | null;
}

export type PromoDiscountType =
  | "none"
  | "percent"
  | "free_classes"
  | "fixed_price";

export interface PromoPackRow {
  id: string;
  size: number;
  label: string;
  discount_type: PromoDiscountType;
  discount_value: number | null;
  note: string | null;
  valid_from: string | null;
  valid_until: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface StudioSettings {
  id: string;
  opening_time: string;
  closing_time: string;
  cash_deposit_percentage: number;
  updated_at: string;
}

// Joined types used in views
export interface RegistrationWithClass extends Registration {
  classes: Pick<
    DanceClass,
    | "id"
    | "title"
    | "instructor"
    | "class_type"
    | "weekday"
    | "scheduled_date"
    | "start_time"
    | "end_time"
    | "price"
    | "starts_on"
  > & {
    /** Only populated when the join requests it (fixed-class registrations). */
    fixed_class_slots?: Pick<FixedClassSlot, "weekday" | "start_time" | "end_time">[];
  };
}

export interface RegistrationWithProfile extends Registration {
  profiles: Pick<Profile, "full_name" | "email" | "phone">;
}
