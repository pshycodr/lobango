import axios from "axios";

declare const process: {
  env: {
    BACKEND_URL?: string;
    [key: string]: string | undefined;
  };
};

const api = axios.create({
  baseURL: process.env.BACKEND_URL || "http://localhost:8787",
  withCredentials: true,
});

export default api;
