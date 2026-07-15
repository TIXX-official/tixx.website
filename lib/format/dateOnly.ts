import { formatInTimeZone } from 'date-fns-tz';
import { parseEventDateTime } from './eventDateTime';

/** `yyyy.MM.dd` in KST, used by compact list rows (EventListItem). */
export function formatInTimeZoneSafe(date: string, time: string): string {
  return formatInTimeZone(parseEventDateTime(date, time), 'Asia/Seoul', 'yyyy.MM.dd');
}
