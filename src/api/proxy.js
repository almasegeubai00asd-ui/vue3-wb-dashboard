// api/proxy.js
export default async function handler(req, res) {
  try {
    const BACKEND = process.env.BACKEND_URL || 'https://api.example.com'
    const path = (req.url || '').replace(/^\/api/, '') || '/'
    const url = BACKEND + path

    const init = {
      method: req.method,
      headers: { ...req.headers },
    }

    if (req.method !== 'GET' && req.method !== 'HEAD') {
      init.body = JSON.stringify(req.body ?? {})
      init.headers['content-type'] = req.headers['content-type'] || 'application/json'
    }

    const proxied = await fetch(url, init)
    const text = await proxied.text()

    proxied.headers.forEach((value, key) => res.setHeader(key, value))
    res.statusCode = proxied.status
    res.end(text)
  } catch (err) {
    res.statusCode = 500
    res.setHeader('content-type', 'application/json')
    res.end(JSON.stringify({ error: err.message }))
  }
}
