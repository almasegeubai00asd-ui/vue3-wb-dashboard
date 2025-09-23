import axios from 'axios'

const DEFAULT_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT) || 15000
const DEFAULT_BASE = import.meta.env.VITE_API_BASE || '/api'

const client = axios.create({
  baseURL: DEFAULT_BASE,
  timeout: DEFAULT_TIMEOUT,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor to attach API key if present
client.interceptors.request.use(cfg => {
  const token = import.meta.env.VITE_API_KEY
  if (token) {
    // attach as query param for GET requests or in headers for others
    if (!cfg.params) cfg.params = {}
    cfg.params.key = cfg.params.key || token
  }
  return cfg
}, error => Promise.reject(error))

// Response interceptor to unwrap common response shapes
client.interceptors.response.use(res => res, error => {
  // Normalize error shape
  if (error.response) {
    const err = new Error(error.response.statusText || 'Request failed')
    err.status = error.response.status
    err.data = error.response.data
    return Promise.reject(err)
  }
  return Promise.reject(error)
})

export async function fetchEndpoint(endpoint, params = {}, opts = {}) {
  const limit = Math.min(params.limit || 500, 500)
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
  console.log('Fetching', path, { ...params, limit })

  try {
    const response = await client.get(path, {
      params: {
        ...params,
        limit
      },
      // allow caller to override axios config
      ...opts
    })

    // If the API wraps data in { data: ... } or returns directly
    if (response && response.data !== undefined) return response.data
    return response
  } catch (err) {
    // Log minimal info and rethrow for caller to handle
    console.error('fetchEndpoint error:', err.status || err.message || err)
    throw err
  }
}

export default client
