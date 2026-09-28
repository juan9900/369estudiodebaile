import { CLASS_TYPES, type ActiveClassType, type ClassType } from "@/constants";
import type { DanceClass } from "@/lib/types/database";

/** Fixed classes ("clases fijas") have a recurring weekly schedule instead of a single date. */
export function isFixedClass(cls: Pick<DanceClass, "class_type">): boolean {
  return cls.class_type === "fijas";
}

/** Dated classes ("clases sueltas" and "proyectos") have a single scheduled_date. */
export function isDatedClass(cls: Pick<DanceClass, "class_type">): boolean {
  return cls.class_type === "clases" || cls.class_type === "proyectos";
}

/** Archived masterclass rows fall back to the "clases" copy — they're never rendered publicly. */
export function getClassTypeMeta(type: ClassType) {
  return CLASS_TYPES[type === "masterclass" ? "clases" : (type as ActiveClassType)];
}

export function getClassTypeLabel(type: ClassType): string {
  return getClassTypeMeta(type).plural;
}

export function getClassTypeHref(type: ClassType): string {
  return `/modalidades/${getClassTypeMeta(type).slug}`;
}
