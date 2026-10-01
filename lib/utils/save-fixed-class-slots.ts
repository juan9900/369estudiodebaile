import type { SupabaseClient } from "@supabase/supabase-js";

export interface SlotInput {
  weekday: number;
  start_time: string;
  end_time: string;
}

/**
 * Replaces every fixed_class_slots row for `classId` with `slots`. A full
 * delete + insert is simpler and safer than diffing — the client has no
 * stable row ids to diff against, and the admin is the only writer, so a
 * schedule edit is rare and never concurrent. The classes.weekday/
 * start_time/end_time mirror is kept in sync by a DB trigger (see
 * supabase/migrations/018_fixed_class_slots.sql) — nothing else to do here.
 */
export async function saveFixedClassSlots(
  supabase: SupabaseClient,
  classId: string,
  slots: SlotInput[],
) {
  const { error: deleteError } = await supabase
    .from("fixed_class_slots")
    .delete()
    .eq("class_id", classId);
  if (deleteError) throw deleteError;

  if (slots.length === 0) return;

  const { error: insertError } = await supabase
    .from("fixed_class_slots")
    .insert(slots.map((slot) => ({ class_id: classId, ...slot })));
  if (insertError) throw insertError;
}
