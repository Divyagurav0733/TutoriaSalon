import { DAY_NAMES, MONTH_NAMES } from "./constants";

export const formatDate = (d) => {
  const date = typeof d === "string" ? parseDate(d) : d;
  return `${DAY_NAMES[date.getDay()]}, ${date.getDate()} ${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`;
};

export const dateStr = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export const parseDate = (s) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
};

export const addDays = (d, n) => {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
};

export const hoursUntil = (dateString, timeSlot) => {
  const [h, mi] = timeSlot.split(":").map(Number);
  const dt = parseDate(dateString);
  dt.setHours(h, mi, 0, 0);
  return (dt - Date.now()) / 3600000;
};

// Get next N days starting from today
export const getUpcomingDates = (count = 7) => {
  const dates = [];
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  for (let i = 0; i < count; i++) {
    dates.push(new Date(d));
    d.setDate(d.getDate() + 1);
  }
  return dates;
};

export const formatTime12 = (time24) => {
  const [h, m] = time24.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, "0")} ${suffix}`;
};

export const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);
