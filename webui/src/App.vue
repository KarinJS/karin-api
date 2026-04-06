<template>
  <ThreeBackground />
  <div class="noise" />
  <RouterView />
</template>

<script setup lang="ts">
import ThreeBackground from '@/components/ThreeBackground.vue'
import { RouterView } from 'vue-router'
</script>
