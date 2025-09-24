import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE, // http://109.73.206.144:6969
  timeout: import.meta.env.VITE_API_TIMEOUT || 15000,
});

// универсальная функция запроса
export async function fetchEndpoint(endpoint, params = {}) {
  try {
    const response = await api.get(`/${endpoint}`, {
      params: {
        ...params,
        key: import.meta.env.VITE_API_KEY, // всегда добавляем ключ
      },
    });

    return response.data;
  } catch (error) {
    console.error(`[fetchEndpoint] Error calling ${endpoint}:`, error);
    throw error;
  }
}
