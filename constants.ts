export const CLASS_LEVELS = [
  { levelNumber: 1, levelText: "Básico" },
  { levelNumber: 2, levelText: "Intermedio" },
  { levelNumber: 3, levelText: "Avanzado" },
];

export const WHATSAPP_URL = "https://wa.me/584246257045";

/**
 * Single source of truth for the class_type union and its user-facing copy.
 * The DB value for "clases sueltas" stays "clases" (zero data/query churn —
 * see supabase/migrations/017_fixed_classes.sql); only the label changed.
 */
export const CLASS_TYPES = {
  clases: {
    value: "clases",
    plural: "Clases sueltas",
    singular: "Clase suelta",
    checkoutTitle: "Clase",
    slug: "clases-sueltas",
    tagline: "Aprende, graba, sorpréndete.",
  },
  fijas: {
    value: "fijas",
    plural: "Clases fijas",
    singular: "Clase fija",
    checkoutTitle: "Clase fija",
    slug: "clases-fijas",
    tagline: "Tu clase de siempre, todas las semanas.",
  },
  proyectos: {
    value: "proyectos",
    plural: "Proyectos",
    singular: "Proyecto",
    checkoutTitle: "Proyecto",
    slug: "proyectos",
    tagline: "Experiencias temporales para vivir de lleno.",
  },
} as const;

/** Types the admin can create today. */
export const ACTIVE_CLASS_TYPES = ["clases", "fijas", "proyectos"] as const;
export type ActiveClassType = (typeof ACTIVE_CLASS_TYPES)[number];

/** "masterclass" is legacy: archived rows only, never offered or rendered. */
export type ClassType = ActiveClassType | "masterclass";

/** Occurrences of EACH weekly slot included in a fixed-class ("fijas") rolling
 * cycle — a class with 3 weekly slots sells cycles of 3 * SESSIONS_PER_CYCLE
 * sessions. See lib/utils/fixed-class-cycle.ts. */
export const SESSIONS_PER_CYCLE = 4;

/** 0 = domingo … 6 = sábado, matching JS Date.getUTCDay(). */
export const WEEKDAYS_ES = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
] as const;
