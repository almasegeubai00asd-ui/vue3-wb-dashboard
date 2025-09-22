<template>
  <div class="pagination">
    <button @click="change(current-1)" :disabled="current <= 1">Prev</button>

    <!-- Выбор страницы вручную -->
    <span>Page: </span>
  
 
    <span>/ {{ pages }}</span>
    <button @click="change(current+1)" :disabled="current >= pages">Next</button>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  current: { type: Number, required: true },
  pages: { type: Number, required: true }
})
const emit = defineEmits(['change'])

const inputPage = ref(props.current)

// Синхронизируем input с текущей страницей
watch(() => props.current, (val) => { inputPage.value = val })

function change(p) {
  if (p >= 1 && p <= props.pages) emit('change', p)
}

function jumpToPage() {
  if (inputPage.value >= 1 && inputPage.value <= props.pages) {
    emit('change', inputPage.value)
  }
}
</script>

<style>
.pagination { display:flex; gap:8px; align-items:center; margin-top:12px }
input { text-align: center; }
</style>
