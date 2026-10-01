import { Calendar } from "lucide-react";
import type { DanceClass, FixedClassSlot } from "@/lib/types/database";
import { formatClassMetaDesktop, formatClassMetaMobile } from "@/lib/utils/date-format";
import { formatSlotsFull, formatSlotsShort } from "@/lib/utils/fixed-class-slots";
import { isFixedClass } from "@/lib/utils/class-type";

interface ClassScheduleMetaProps {
  danceClass: DanceClass;
  /** Required for fixed classes ("fijas"): their full multi-day weekly schedule. */
  slots?: FixedClassSlot[];
}

/**
 * The metadata row under the class title on the detail page: a concrete
 * date for dated classes ("clases"/"proyectos"), or the full weekly
 * schedule for fixed classes ("fijas"), which have no single scheduled_date
 * and may meet on several days, each with its own time range.
 */
export function ClassScheduleMeta({ danceClass, slots }: ClassScheduleMetaProps) {
  const isFixed = isFixedClass(danceClass);

  return (
    <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-vino md:text-[13px] md:tracking-[0.16em]">
      <Calendar size={14} strokeWidth={1.75} />
      {isFixed && slots && slots.length > 0 ? (
        <>
          <span className="md:hidden">{formatSlotsShort(slots)}</span>
          <span className="hidden md:inline">{formatSlotsFull(slots)}</span>
        </>
      ) : (
        danceClass.scheduled_date && (
          <>
            <span className="md:hidden">
              {formatClassMetaMobile(
                danceClass.scheduled_date,
                danceClass.start_time,
              )}
            </span>
            <span className="hidden md:inline">
              {formatClassMetaDesktop(
                danceClass.scheduled_date,
                danceClass.start_time,
                danceClass.end_time,
              )}
            </span>
          </>
        )
      )}
    </div>
  );
}
