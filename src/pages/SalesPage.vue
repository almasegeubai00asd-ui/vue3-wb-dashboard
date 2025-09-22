<template>
  <div class="page">
    <h1>Sales</h1>

    <!-- Filters -->
    <div class="filters">
      <label>Article: <input v-model="filters.supplier_article" placeholder="Артикул" /></label>
      <label>From: <input type="date" v-model="filters.dateFrom" /></label>
      <label>To: <input type="date" v-model="filters.dateTo" /></label>
      <button @click="applyFilters">Apply</button>
      <button @click="resetFilters">Reset</button>
    </div>

    <div class="content">
      <div class="table-container">
        <DataTable :rows="filteredRows" :columns="columns" />

        <!-- Pagination -->
        <Pagination :current="page" :pages="pages" @change="onPageChange" />

        <!-- Ручной ввод страницы -->
        <div style="margin-top:8px;">
          Go to page:
          <input type="number" v-model.number="inputPage" :min="1" :max="pages" style="width:60px;" />
          <button @click="jumpToPage">Go</button>
        </div>
      </div>

      <div class="chart-container">
        <canvas ref="chartRef"></canvas>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useTable } from '../composables/useTable'
import DataTable from '../components/DataTable.vue'
import Pagination from '../components/Pagination.vue'
import { Chart, registerables } from 'chart.js'
Chart.register(...registerables)

const endpoint = 'sales'
const { rows, page, pages, setPage, setFilters } = useTable(endpoint, 10)

// Колонки таблицы
const columns = [
  { key: 'sale_id', label: 'ID' },
  { key: 'date', label: 'Date' },
  { key: 'supplier_article', label: 'Article' },
  { key: 'total_price', label: 'Total' }
]

// Фильтры
const filters = ref({
  supplier_article: '',
  dateFrom: '2025-09-01',
  dateTo: '2025-09-20'
})

// Ручной ввод страницы
const inputPage = ref(1)

// Автоприменяем фильтры при монтировании
onMounted(() => setFilters({
  dateFrom: filters.value.dateFrom,
  dateTo: filters.value.dateTo
}))

function applyFilters() {
  setFilters({
    dateFrom: filters.value.dateFrom,
    dateTo: filters.value.dateTo
  })
}

function resetFilters() {
  filters.value = { supplier_article: '', dateFrom: '', dateTo: '' }
  setFilters({ dateFrom: '', dateTo: '' })
}

function onPageChange(p) { 
  setPage(p)
  inputPage.value = p
}

function jumpToPage() {
  if(inputPage.value >= 1 && inputPage.value <= pages.value) {
    setPage(inputPage.value)
  }
}

// **Фильтрация по supplier_article на фронте**
const filteredRows = computed(() => {
  if (!filters.value.supplier_article) return rows.value
  return rows.value.filter(r => r.supplier_article.includes(filters.value.supplier_article))
})

// График по total_price (только отфильтрованные строки)
const chartRef = ref(null)
let chartInstance = null

function renderChart() {
  if (!chartRef.value) return
  const labels = filteredRows.value.map(r => r.date ?? '')
  const data = filteredRows.value.map(r => Number(r.total_price ?? 0))
  if (chartInstance) chartInstance.destroy()
  chartInstance = new Chart(chartRef.value, {
    type: 'bar',
    data: { labels, datasets: [{ label: 'Total', data }] },
    options: { responsive: true, maintainAspectRatio: false }
  })
}

// Перерисовываем график при изменении данных или фильтров
watch([rows, filters], renderChart)
</script>

<style>
.page { padding: 12px }
.filters { margin-bottom: 12px; display: flex; gap: 8px; flex-wrap: wrap; }
.content { display: flex; gap: 20px; }
.table-container { flex: 1 }
.chart-container { width: 45%; min-height: 300px }
</style>
