export const isValidAadhaar = aadhaar => {
  const regex = /^[2-9][0-9]{3}(\s?[0-9]{4}){2}$/;
  return regex.test(aadhaar);
};

export const isOtpFilled = otp => {
  return otp.every(digit => digit !== '');
};


export function getMonthKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`; // 2026-01
}

export function getMonthLabel(date = new Date()) {
  return date.toLocaleString("en-US", {
    month: "short",
    year: "numeric",
  }); // Jan 2026
}

export function addMonths(date, delta) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + delta);
  return d;
}

function isFutureMonth(date) {
  const now = new Date();
  return (
    date.getFullYear() > now.getFullYear() ||
    (date.getFullYear() === now.getFullYear() &&
      date.getMonth() > now.getMonth())
  );
}

export function getShortMonthKey(date = new Date()) {
  return date
    .toLocaleString("en-US", { month: "short" })
    .toLowerCase(); // jan, feb, mar
}

export function getWeekdayName(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { weekday: "long" });
}

