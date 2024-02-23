<script setup>
import { computed } from 'vue'
import { useLayout } from '@/layout/composables/layout'

//const { layoutConfig, onMenuToggle } = useLayout()
const { onMenuToggle } = useLayout()

const logoUrl = computed(() => {
  //return `layout/images/${layoutConfig.darkTheme.value ? 'logo-white' : 'logo-dark'}.svg`
  return 'layout/images/COPASI.png'
})
</script>

<template>
  <div class="layout-topbar">
    <router-link to="/" class="layout-topbar-logo">
      <img :src="logoUrl" alt="logo" />
      <span>COPASI Vue3</span>
    </router-link>

    <button class="p-link layout-menu-button layout-topbar-button" @click="onMenuToggle()">
      <i class="pi pi-bars"></i>
    </button>
  </div>
</template>

<style lang="scss" scoped></style>
