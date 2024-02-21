<script setup>
import { ref } from 'vue'

import AppMenuItem from './AppMenuItem.vue'

const model = ref([
  {
    label: 'Home',
    items: [{ label: 'Home', icon: 'pi pi-fw pi-home', to: '/' }]
  },
  {
    label: 'Tasks',
    items: [
      { label: 'SteadyState', icon: 'pi pi-fw', to: '/steadyState' },
    ]
  },
  {
    label: 'About',
    items: [
      { label: 'About', icon: 'pi pi-fw pi-id-card', to: '/about' },
    ]
  }
])
</script>

<template>
  <ul class="layout-menu">
    <template v-for="(item, i) in model" :key="item">
      <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
      <li v-if="item.separator" class="menu-separator"></li>
    </template>
  </ul>
</template>

<style lang="scss" scoped></style>
