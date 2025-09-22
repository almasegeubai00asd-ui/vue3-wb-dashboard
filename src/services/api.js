import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_HOST,
  headers: {
    'Authorization': import.meta.env.VITE_API_KEY
  }
})

export default api