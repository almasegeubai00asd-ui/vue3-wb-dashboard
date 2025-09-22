<template>
  <div>
    <nav class="navbar">
      <router-link to="/orders">Orders</router-link>
      <router-link to="/incomes">Incomes</router-link>
      <router-link to="/sales">Sales</router-link>
      <router-link to="/stocks">Stocks</router-link>
    </nav>
    <router-view />
  </div>
</template>

<script setup></script>

<style>
.navbar {
  display: flex;
  gap: 16px;
  padding: 12px;
  background-color: #f3f3f3;
  margin-bottom: 12px;
}

.navbar a {
  text-decoration: none;
  color: #333;
}

.navbar a.router-link-exact-active {
  font-weight: bold;
  color: #007bff;
}
</style>
