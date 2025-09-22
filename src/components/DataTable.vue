<template>
  <table class="data-table" v-if="rows && rows.length">
    <thead>
      <tr>
        <th v-for="col in columns" :key="col.key">{{ col.label }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(r, idx) in rows" :key="r.id ?? r._id ?? idx">
        <td v-for="col in columns" :key="col.key">{{ getValue(r, col.key) }}</td>
      </tr>
    </tbody>
  </table>
  <div v-else>No data</div>
</template>

<script setup>
import { defineProps } from 'vue'
const props = defineProps({ rows: { type: Array, default: () => [] }, columns: { type: Array, default: () => [] } })
function getValue(row, key) {
  const keys = key.split('.')
  return keys.reduce((acc, k) => (acc ? acc[k] : undefined), row)
}
</script>

<style>
.data-table { width:100%; border-collapse: collapse }
.data-table th, .data-table td { border:1px solid #ddd; padding:8px; text-align:left }
.data-table thead { background:#f7f7f7 }
</style>
