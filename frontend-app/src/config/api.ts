/** Base URL REST API (không có dấu / cuối) — khớp `VITE_API_BASE_URL` trong `.env` */
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8081/api";
