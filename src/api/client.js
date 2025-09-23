import axios from 'axios'

// Таймаут запросов (берётся из .env или Render)
const DEFAULT_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT) || 15000

// Базовый URL — теперь всегда через наш прокси /api
const DEFAULT_BASE = import.meta.env.VITE_API_BASE || '/api'

// Создаём экземпляр axios
const client = axios.create({
  baseURL: DEFAULT_BASE,
  timeout: DEFAULT_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Перехватчик запросов: добавляем API ключ, если он есть
client.interceptors.request.use(
  (cfg) => {
    const token = import.meta.env.VITE_API_KEY
    if (token) {
      if (!cfg.params) cfg.params = {}
      cfg.params.key = cfg.params.key || token
    }
    return cfg
  },
  (error) => Promise.reject(error)
)

// Перехватчик ответов: нормализуем ошибки
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
  }
)

// Удобная функция для GET запросов
export async function fetchEndpoint(endpoint, params = {}, opts = {}) {
  const limit = Math.min(params.limit || 500, 500)
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
  console.log('Fetching', path, { ...params, limit })

  try {
    const response = await client.get(path, {
      params: { ...params, limit },
      ...opts,
    })

    if (response && response.data !== undefined) return response.data
    return response
  } catch (err) {
    console.error('fetchEndpoint error:', err.status || err.message || err)
    throw err
  }
}

export default client
