// src/services/api.js
import axios from "axios";

// Базовый URL берём из переменных окружения (vite использует import.meta.env)
const API_BASE = import.meta.env.VITE_API_BASE || "/api";
const API_KEY = import.meta.env.VITE_API_KEY;

const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
});

// Добавляем ключ по умолчанию
api.interceptors.request.use((config) => {
  config.params = {
    ...(config.params || {}),
    key: API_KEY,
  };
  return config;
});

export default api;
