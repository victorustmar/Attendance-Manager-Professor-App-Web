import axios from "axios";
export const API_BASE = "http://86.120.164.67:54321";
//export const API_BASE = "http://192.168.10.2:5000";
export const api = axios.create({
  baseURL: API_BASE, // or wherever you keep your URL
});

// on *every* 401 we clear auth and force-reload to /login
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.clear();
      // if you’re using <BrowserRouter>, this reload still goes to your SPA’s “/” route:
      window.location.href = "/";
    }
    return Promise.reject(err);
  }
);
