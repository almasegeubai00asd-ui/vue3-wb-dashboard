// api/proxy.js
import fetch from 'node-fetch'

export default async function handler(req, res) {
  try {
    const BACKEND = process.env.BACKEND_URL || 'http://109.73.206.144:6969'
    
    // Берём путь запроса после /api
    const path = req.url.replace(/^\/api/, '') || '/'

    // Формируем URL на backend
    const url = new URL(BACKEND + '/api' + path)

    // Добавляем query параметры из запроса + ключ
    const params = new URLSearchParams(req.query)
    if (!params.has('key')) {
      params.set('key', process.env.VITE_API_KEY || '')
    }
    url.search = params.toString()

    // Настраиваем fetch
    const init = {
      method: req.method,
      headers: { ...req.headers },
    }

    if (req.method !== 'GET' && req.method !== 'HEAD') {
      init.body = JSON.stringify(req.body || {})
      init.headers['content-type'] = req.headers['content-type'] || 'application/json'
    }

    // Отправляем запрос на backend
    const proxied = await fetch(url.toString(), init)
    const text = await proxied.text()

    // Пробрасываем заголовки и статус
    proxied.headers.forEach((value, key) => res.setHeader(key, value))
    res.statusCode = proxied.status
    res.end(text)
  } catch (err) {
    res.statusCode = 500
    res.setHeader('content-type', 'application/json')
    res.end(JSON.stringify({ error: err.message }))
  }
}
