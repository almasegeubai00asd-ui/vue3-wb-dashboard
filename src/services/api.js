import axios from "axios";

const DEFAULT_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT) || 15000;

// ⬅️ В .env.production у тебя должно быть VITE_API_BASE=/api
const DEFAULT_BASE = import.meta.env.VITE_API_BASE || "/api";

const client = axios.create({
  baseURL: DEFAULT_BASE,
  timeout: DEFAULT_TIMEOUT,
  headers: { "Content-Type": "application/json" },
});

// Перехватчик запросов — добавляем API-ключ
client.interceptors.request.use(
  (cfg) => {
    const token = import.meta.env.VITE_API_KEY;
    if (token) {
      if (!cfg.params) cfg.params = {};
      cfg.params.key = cfg.params.key || token;
    }
    return cfg;
  },
  (error) => Promise.reject(error)
);

// Перехватчик ответов — обработка ошибок
client.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response) {
      const err = new Error(error.response.statusText || "Request failed");
      err.status = error.response.status;
      err.data = error.response.data;
      return Promise.reject(err);
    }
    return Promise.reject(error);
  }
);

/**
 * Универсальная функция для вызова API
 */
export async function fetchEndpoint(endpoint, params = {}, opts = {}) {
  const limit = Math.min(params.limit || 500, 500);
  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

  try {
    const response = await client.get(path, {
      params: { ...params, limit },
      ...opts,
    });
    return response.data !== undefined ? response.data : response;
  } catch (err) {
    console.error("fetchEndpoint error:", err.status || err.message || err);
    throw err;
  }
}

export default client;
