// src/api/client.js
import axios from 'axios'

// Таймаут запроса в миллисекундах, берется из .env или 15000 по умолчанию
const DEFAULT_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT) || 15000

// Базовый URL API, по умолчанию прокси на /api
const DEFAULT_BASE = import.meta.env.VITE_API_BASE || '/api'

// Создаем экземпляр Axios
const client = axios.create({
  baseURL: DEFAULT_BASE,
  timeout: DEFAULT_TIMEOUT,
  headers: { 'Content-Type': 'application/json' },
})

// Интерцептор запросов — удаляем добавление ключа на фронте
// (ключ добавляется только на сервере через proxy.js)
client.interceptors.request.use(
  cfg => cfg,
  error => Promise.reject(error)
)

// Интерцептор ответов — обрабатываем ошибки
client.interceptors.response.use(
  res => res,
  error => {
    if (error.response) {
      const err = new Error(error.response.statusText || 'Request failed')
      err.status = error.response.status
      err.data = error.response.data
      return Promise.reject(err)
    }
    return Promise.reject(error)
  }
)

/**
 * Универсальная функция для вызова API
 * @param {string} endpoint - путь API ('orders', 'sales', etc.)
 * @param {object} params - query-параметры
 * @param {object} opts - дополнительные настройки Axios
 * @returns {Promise<any>}
 */
export async function fetchEndpoint(endpoint, params = {}, opts = {}) {
  const limit = Math.min(params.limit || 500, 500) // ограничение на 500 элементов
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`

  try {
    const response = await client.get(path, { params: { ...params, limit }, ...opts })
    return response.data
  } catch (err) {
    console.error('fetchEndpoint error:', err.status || err.message || err)
    throw err
  }
}

export default client
