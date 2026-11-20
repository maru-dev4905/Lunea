// A plain Korean date and 24-hour time in the device's local time, e.g. "2026년 11월 19일 21:05".
// Written by hand so it does not depend on Intl support, which differs between runtimes.
export function formatRecordDate(date: Date): string {
  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 ${hh}:${mm}`;
}
