import axios from "axios";

// ============================================================
// API BASE URL
//
// VITE_API_URL is baked into the build at build time (Vite env
// vars are compile-time, not runtime). If it isn't set:
//
//   - In dev (`npm run dev`), fall back to the local backend on
//     port 5000 — that's almost certainly what you're running.
//   - In a production build (`npm run build`), falling back to
//     "http://localhost:5000/api" would make every deployed
//     visitor's browser try to call THEIR OWN machine, which
//     can never work. Fall back to a same-origin relative
//     "/api" path instead, which works when the API is
//     reverse-proxied under the same domain as the frontend —
//     a common deployment setup. Either way, the correct fix
//     for a real deployment is to set VITE_API_URL to your
//     actual backend URL in client/.env *before* building.
// ============================================================

const resolveBaseURL = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  if (import.meta.env.PROD) {
    console.warn(
      "VITE_API_URL was not set at build time — falling back to a same-origin \"/api\" path. " +
        "Set VITE_API_URL in client/.env to your deployed backend URL and rebuild if this is wrong."
    );
    return "/api";
  }

  return "http://localhost:5000/api";
};

// ============================================================
// AXIOS API INSTANCE
// ============================================================

const api = axios.create({
  baseURL: resolveBaseURL(),
});

// ============================================================
// REQUEST INTERCEPTOR
// ============================================================

api.interceptors.request.use(
  (config) => {

    const token =
      localStorage.getItem("token");

    if (token) {

      config.headers =
        config.headers || {};

      config.headers.Authorization =
        `Bearer ${token}`;

    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);

// ============================================================
// RESPONSE INTERCEPTOR
// ============================================================

api.interceptors.response.use(
  (response) => {
    return response;
  },

  (error) => {

    if (
      error?.response?.status === 401
    ) {

      console.warn(
        "API: Unauthorized request"
      );

    }

    return Promise.reject(error);
  }
);

// ============================================================
// EXPORT
// ============================================================

export default api;