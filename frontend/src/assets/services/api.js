import axios from "axios";

export const API_URL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") ||
  "http://127.0.0.1:8000";

const api = axios.create({
  baseURL: API_URL,
});

export default api;