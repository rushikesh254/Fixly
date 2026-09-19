import axios from "axios";

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:1337";

// in-memory + localStorage copy of the access token so the axios
// interceptor can attach it even before React state has hydrated.
let accessToken = localStorage.getItem("accessToken") || null;

export const getAccessToken = () => accessToken;

export const setAccessToken = (token) => {
  accessToken = token || null;
  if (accessToken) {
    localStorage.setItem("accessToken", accessToken);
  } else {
    localStorage.removeItem("accessToken");
  }
};

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  withCredentials: true, // send httpOnly refreshToken cookie
});

api.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// If the access token has expired, refresh it once and retry the request.
// Other requests that fail with 401 while a refresh is in flight are queued
// and retried after the new token is available.
let isRefreshing = false;
let waitQueue = [];

const isAuthUrl = (url = "") =>
  url.includes("/auth/login") ||
  url.includes("/auth/refresh-token") ||
  url.includes("/auth/google-login");

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    // an admin can block an account at any time; the backend answers 403 on
    // every authenticated request, so force the client offline without waiting
    // for the access token to expire.
    if (error.response?.status === 403) {
      const message = error.response.data?.message || "";
      if (/blocked|deleted|no longer exists/i.test(message)) {
        setAccessToken(null);
        window.dispatchEvent(new Event("auth:logout"));
      }
    }

    if (error.response?.status === 401 && original && !original._retry && !isAuthUrl(original.url)) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          waitQueue.push({ config: original, resolve, reject });
        });
      }

      original._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axios.post(
          `${API_BASE_URL}/api/auth/refresh-token`,
          {},
          { withCredentials: true },
        );
        setAccessToken(data.accessToken);

        waitQueue.forEach(({ config: queuedConfig, resolve }) => {
          resolve(api(queuedConfig));
        });
        waitQueue = [];

        return api(original);
      } catch (refreshError) {
        setAccessToken(null);
        waitQueue.forEach(({ reject }) => reject(refreshError));
        waitQueue = [];
        window.dispatchEvent(new Event("auth:logout"));
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default api;