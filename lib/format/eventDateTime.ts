import { enUS, ko } from 'date-fns/locale';
import { formatInTimeZone } from 'date-fns-tz';

// TIXX events are Korea-only; render in KST regardless of the server
// container's local timezone (Cloud Run defaults to UTC).
const EVENT_TIME_ZONE = 'Asia/Seoul';

// Port of apps/mobile/src/utils/eventDateTime.ts formatEventDateRangeLabel.
export function formatEventDateRangeLabel(
  startDateTime: Date | null,
  displayEndDateTime: Date | null,
  language: 'KO' | 'EN'
): { formattedDate: string; formattedTime: string } {
  if (!startDateTime || !displayEndDateTime) {
    return { formattedDate: '-', formattedTime: '-' };
  }

  const locale = language === 'KO' ? ko : enUS;
  const fmt = (date: Date, pattern: string) =>
    formatInTimeZone(date, EVENT_TIME_ZONE, pattern, { locale });

  const [startYear, startMonth, startDay] = fmt(startDateTime, 'yyyy-MM-dd').split('-');
  const [endYear, endMonth, endDay] = fmt(displayEndDateTime, 'yyyy-MM-dd').split('-');
  const sameYear = startYear === endYear;
  const sameDay = sameYear && startMonth === endMonth && startDay === endDay;

  let formattedDate: string;
  if (sameDay) {
    formattedDate = fmt(startDateTime, 'yyyy.MM.dd(E)');
  } else if (sameYear) {
    formattedDate = `${fmt(startDateTime, 'yyyy.MM.dd(E)')} - ${fmt(displayEndDateTime, 'MM.dd(E)')}`;
  } else {
    formattedDate = `${fmt(startDateTime, 'yyyy.MM.dd(E)')} - ${fmt(displayEndDateTime, 'yyyy.MM.dd(E)')}`;
  }

  const formattedTime = `${fmt(startDateTime, 'HH:mm')} - ${fmt(displayEndDateTime, 'HH:mm')}`;

  return { formattedDate, formattedTime };
}

/** Parses the API's separate date/time strings as a UTC instant, matching
 * how the mobile app does `parseISO(\`${date}T${time}Z\`)`. */
export function parseEventDateTime(date: string, time: string): Date {
  return new Date(`${date}T${time}Z`);
}

/** If the event's time-of-day wraps past midnight, the mobile app displays
 * the end date shifted back a day so the range reads correctly. */
export function resolveDisplayEndDateTime(start: Date, end: Date): Date {
  const startMinutes = start.getUTCHours() * 60 + start.getUTCMinutes();
  const endMinutes = end.getUTCHours() * 60 + end.getUTCMinutes();
  if (startMinutes > endMinutes) {
    const adjusted = new Date(end);
    adjusted.setUTCDate(adjusted.getUTCDate() - 1);
    return adjusted;
  }
  return end;
}
