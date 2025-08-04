import axios from "axios";

const api = axios.create({
  baseURL: "https://backend.webcheap-in.workers.dev",
  withCredentials: true,
});

export default api;