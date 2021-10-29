declare module "time-ago" {
  export function ago(date: Date | string | number): string;

  export function mintoread(
    text: string,
    altcmt?: string | null | undefined,
    wordsPerMinute?: number
  ): string;

  // convert to ms: seconds, minutes, hours, days, weeks, months, years
  export function timefriendly(time: string): number;
}
