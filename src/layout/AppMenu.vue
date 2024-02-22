<script setup>
import { ref } from 'vue'

import AppMenuItem from './AppMenuItem.vue'

const model = ref([
  {
    label: 'Home',
    items: [{ label: 'Home', icon: 'pi pi-fw pi-home', to: '/' }]
  },
  {
    label: 'Model',
    items: [
      { label: 'Compartments', icon: 'pi pi-fw', to: '/compartments' },
      { label: 'Species', icon: 'pi pi-fw', to: '/species' },
      { label: 'Reactions', icon: 'pi pi-fw', to: '/reactions' },
      { label: 'Global Parameters', icon: 'pi pi-fw', to: '/parameters' },
      { label: 'Events', icon: 'pi pi-fw', to: '/events' }
    ]
  },
  {
    label: 'Tasks',
    items: [
      { label: 'Time Course', icon: 'pi pi-fw', to: '/timeCourse' },
      { label: 'Steady State', icon: 'pi pi-fw', to: '/steadyState' }
    ]
  },
  {
    label: 'Get Started',
    items: [
      {
        label: 'COPASI Home',
        icon: 'pi pi-fw pi-question',
        url: 'https://copasi.org',
        target: '_blank'
      },
      {
        label: 'View Source',
        icon: 'pi pi-fw pi-search',
        url: 'https://github.com/copasi/copasi',
        target: '_blank'
      }
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
