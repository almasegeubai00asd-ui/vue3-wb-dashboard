// src/api/client.js
import axios from 'axios'

const DEFAULT_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT) || 15000
const DEFAULT_BASE = import.meta.env.VITE_API_BASE || '/api'
const API_KEY = import.meta.env.VITE_API_KEY || null

const client = axios.create({
  baseURL: DEFAULT_BASE,
  timeout: DEFAULT_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Добавляем API-ключ (в headers и как fallback — в params)
client.interceptors.request.use(
  (config) => {
    if (API_KEY) {
      config.headers = config.headers || {}
      config.headers['Authorization'] = `Bearer ${API_KEY}`

      // если сервер ждёт key в query — добавим для GET-запросов
      const method = (config.method || 'get').toLowerCase()
      if (method === 'get') {
        config.params = config.params || {}
        if (!config.params.key) config.params.key = API_KEY
      }
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Нормализуем ошибки
client.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response) {
      const err = new Error(error.response.statusText || 'Request failed')
      err.status = error.response.status
      err.data = error.response.data
      return Promise.reject(err)
    }
    return Promise.reject(error)
  },
)

/**
 * Главная функция для useTable
 * @param {string} endpoint - путь (например 'orders' или '/orders')
 * @param {object} params - query параметры
 * @param {object} opts - доп. опции axios
 */
export async function fetchEndpoint(endpoint, params = {}, opts = {}) {
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`

  try {
    const response = await client.get(path, {
      params,
      ...opts,
    })

    // Обычно нужен response.data
    if (response && response.data !== undefined) return response.data
    return response
  } catch (err) {
    console.error('[fetchEndpoint error]', err.status || err.message || err)
    throw err
  }
}

export default client
