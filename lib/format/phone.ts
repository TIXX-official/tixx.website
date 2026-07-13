import { parsePhoneNumber } from 'libphonenumber-js';

// Port of apps/mobile/src/utils/formatters.ts formatPhone.
export function formatPhone(phone: string): string {
  try {
    const parsed = parsePhoneNumber(phone, 'KR');
    return parsed.formatNational().replace(/-/g, ' ');
  } catch {
    return phone;
  }
}
