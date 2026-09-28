import { Calendar } from "lucide-react";
import type { DanceClass } from "@/lib/types/database";
import {
  formatClassMetaDesktop,
  formatClassMetaMobile,
  formatWeeklyScheduleFull,
  formatWeeklyScheduleShort,
} from "@/lib/utils/date-format";
import { isFixedClass } from "@/lib/utils/class-type";

interface ClassScheduleMetaProps {
  danceClass: DanceClass;
}

/**
 * The metadata row under the class title on the detail page: a concrete
 * date for dated classes ("clases"/"proyectos"), or the recurring weekly
 * schedule for fixed classes ("fijas"), which have no single scheduled_date.
 */
export function ClassScheduleMeta({ danceClass }: ClassScheduleMetaProps) {
  const isFixed = isFixedClass(danceClass);

  return (
    <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-vino md:text-[13px] md:tracking-[0.16em]">
      <Calendar size={14} strokeWidth={1.75} />
      {isFixed && danceClass.weekday != null ? (
        <>
          <span className="md:hidden">
            {formatWeeklyScheduleShort(danceClass.weekday, danceClass.start_time)}
          </span>
          <span className="hidden md:inline">
            {formatWeeklyScheduleFull(
              danceClass.weekday,
              danceClass.start_time,
              danceClass.end_time,
            )}
          </span>
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
