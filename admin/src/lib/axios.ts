import axios from "axios";

const api = axios.create({
  baseURL: process.env.PUBLIC_API_BASE_URL || "http://localhost:8787",
  withCredentials: true
});

export default api;