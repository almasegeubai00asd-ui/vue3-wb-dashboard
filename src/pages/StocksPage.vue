<template>
  <div class="page">
    <h1>Stocks</h1>

    <div class="filters">
      <label>Date: <input type="date" v-model="filters.date" /></label>
      <label>Warehouse: <input v-model="filters.warehouse_name" placeholder="Склад" /></label>
    </div>

    <div class="content">
      <div class="table-container">
        <DataTable :rows="rows" :columns="columns" />
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
import { Chart, registerables } from 'chart.js'
Chart.register(...registerables)

const endpoint = 'stocks'
const { rows, load } = useTable(endpoint, 500)

// Колонки таблицы
const columns = [
  { key: 'nm_id', label: 'NM ID' },
  { key: 'date', label: 'Date' },
  { key: 'warehouse_name', label: 'Warehouse' },
  { key: 'quantity', label: 'Quantity' }
]

// Фильтры
const filters = ref({
  date: '',
  warehouse_name: ''
})

// Автозагрузка данных
onMounted(async () => {
  await load()
  renderChart()
})

// Если хочешь фильтровать по складу и дате
watch(filters, () => {
  setFilters({ dateFrom: filters.value.date, warehouse_name: filters.value.warehouse_name })
})

// График по количеству
const chartRef = ref(null)
let chartInstance = null
function renderChart() {
  if (!chartRef.value || !rows.value.length) return
  const labels = rows.value.map(r => r.date ?? '')
  const data = rows.value.map(r => Number(r.quantity ?? 0))
  if (chartInstance) chartInstance.destroy()
  chartInstance = new Chart(chartRef.value, {
    type: 'bar',
    data: { labels, datasets: [{ label: 'Quantity', data }] },
    options: { responsive: true, maintainAspectRatio: false }
  })
}

// Перерисовка графика при изменении данных
watch(rows, renderChart)
</script>

<style>
.page { padding: 12px }
.filters { margin-bottom: 12px; display: flex; gap: 8px; flex-wrap: wrap; }
.content { display: flex; gap: 20px; }
.table-container { flex: 1 }
.chart-container { width: 45%; min-height: 300px }
</style>
