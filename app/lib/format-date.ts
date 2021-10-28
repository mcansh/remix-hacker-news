import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInMonths,
  format,
} from "date-fns";

function formatDate(date: Date) {
  const now = new Date();

  const days = differenceInDays(now, date);

  if (days > 0) {
    if (days > 64) {
      const months = differenceInMonths(now, date);

      if (months > 12) {
        return format(date, "MMM dd, yyyy");
      }

      return `${months} months`;
    }
  }

  let minutes = differenceInMinutes(now, date);

  if (minutes >= 60) {
    let hours = differenceInHours(now, date);
    return `${hours} hours`;
  }

  return `${minutes} minutes`;
}

export { formatDate };
