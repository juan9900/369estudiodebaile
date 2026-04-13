import type { DanceClass } from "@/lib/types/database";

export function getClassDisplayTitle(cls: DanceClass): string {
  return cls.use_genre_as_title ? String(cls.genre) : cls.title;
}
