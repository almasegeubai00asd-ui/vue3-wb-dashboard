import axios from 'axios'

// Таймаут запроса
const DEFAULT_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT) || 15000

// Базовый URL для фронтенда — /api, чтобы шёл через Node-прокси
const DEFAULT_BASE = import.meta.env.VITE_API_BASE || '/api'

const client = axios.create({
  baseURL: DEFAULT_BASE,
  timeout: DEFAULT_TIMEOUT,
  headers: { 'Content-Type': 'application/json' },
})

// Интерцептор запросов — добавляем ключ API
client.interceptors.request.use(cfg => {
  const token = import.meta.env.VITE_API_KEY
  if (token) {
    if (!cfg.params) cfg.params = {}
    // Если ключ уже есть в params, не добавляем повторно
    if (!cfg.params.key) cfg.params.key = token
  }
  console.log('[client] Request URL:', cfg.baseURL + cfg.url, 'Params:', cfg.params)
  return cfg
}, error => Promise.reject(error))

// Интерцептор ответов — обрабатываем ошибки
client.interceptors.response.use(
  res => res,
  error => {
    if (error.response) {
      const err = new Error(error.response.statusText || 'Request failed')
      err.status = error.response.status
      err.data = error.response.data
      console.error('[client] Response error:', err.status, err.data)
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
  const limit = Math.min(params.limit || 500, 500)
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`

  try {
    const response = await client.get(path, { params: { ...params, limit }, ...opts })
    return response.data !== undefined ? response.data : response
  } catch (err) {
    console.error('[client] fetchEndpoint error:', err.status || err.message || err)
    throw err
  }
}

export default client
