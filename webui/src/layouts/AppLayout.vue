<template>
  <div class="flex min-h-screen flex-col">
    <NavBar />
    <main class="flex-1 pt-20">
      <RouterView v-slot="{ Component }">
        <Transition name="page">
          <component :is="Component" :key="route.path" />
        </Transition>
      </RouterView>
    </main>
    <footer v-if="showFooter" class="mt-auto border-t border-white/8 py-10 font-body">
      <div class="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-white/30">
        <span class="font-display font-medium text-white/40">Karin Plugin Hub</span>
        <span class="hidden sm:block">开源插件注册中心 &mdash; 由社区共建</span>
        <span>&copy; {{ new Date().getFullYear() }} &middot; MIT License</span>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import NavBar from '@/components/NavBar.vue'
import { RouterView, useRoute } from 'vue-router'

const route = useRoute()
const showFooter = computed(() => route.path !== '/')
</script>

<style scoped>
.page-enter-active,
.page-leave-active {
  transition: opacity 0.18s ease;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
}
</style>
