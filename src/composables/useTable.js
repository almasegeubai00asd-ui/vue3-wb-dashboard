// src/composables/useTable.js
import { ref, computed } from 'vue'
import { fetchEndpoint } from '../api/client'

export function useTable(endpoint, defaultLimit = 10) {
  const rows = ref([])
  const total = ref(0)
  const page = ref(1)
  const limit = ref(defaultLimit)
  const loading = ref(false)
  const filters = ref({})

  async function load() {
    loading.value = true
    try {
      const params = { page: page.value, limit: limit.value, ...filters.value }

      const today = new Date().toISOString().split('T')[0]
      if (endpoint !== 'stocks') {
        if (!params.dateFrom) params.dateFrom = today
        if (!params.dateTo) params.dateTo = today
      } else {
        if (!params.dateFrom) params.dateFrom = today
      }

      console.log(`Fetching ${endpoint} with params:`, params)
      const data = await fetchEndpoint(endpoint, params)
      console.log('Response data:', data)

      if (Array.isArray(data)) {
        rows.value = data
        total.value = data.length
      } else if (data?.data && Array.isArray(data.data)) {
        rows.value = data.data
        total.value = data.total ?? data.meta?.total ?? data.data.length
      } else {
        rows.value = data.rows || data.items || []
        total.value = data.total ?? rows.value.length
      }
    } catch (err) {
      console.error('Error loading table:', err)
      rows.value = []
      total.value = 0
    } finally {
      loading.value = false
    }
  }

  const pages = computed(() => Math.max(1, Math.ceil(total.value / limit.value)))

  function setPage(p) {
    if (p < 1) p = 1
    if (p > pages.value) p = pages.value
    page.value = p
    return load()
  }

  function setFilters(obj) {
    filters.value = { ...filters.value, ...obj }
    page.value = 1
    return load()
  }

  function setLimit(l) {
    limit.value = l
    page.value = 1
    return load()
  }

  return { rows, total, page, limit, pages, loading, load, setPage, setFilters, setLimit }
}
