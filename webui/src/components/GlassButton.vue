<template>
  <button
    ref="btnRef"
    :type="type"
    :disabled="disabled || loading"
    class="relative overflow-hidden rounded-full px-6 py-3 font-semibold text-sm tracking-wide transition-all duration-200 select-none outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed"
    :class="[variantClass, className]"
    @mouseenter="onEnter"
    @mouseleave="onLeave"
    @click="emit('click', $event)"
  >
    <!-- Shimmer sweep on hover -->
    <span
      class="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/15 to-transparent transition-transform duration-500"
      :class="shimmerActive && 'translate-x-full'"
    />
    <!-- Content -->
    <span class="relative flex items-center justify-center gap-2">
      <span v-if="loading" class="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      <slot />
    </span>
  </button>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
    type?: 'button' | 'submit' | 'reset'
    disabled?: boolean
    loading?: boolean
    className?: string
  }>(),
  { variant: 'primary', type: 'button', disabled: false, loading: false, className: '' },
)

const emit = defineEmits<{ click: [e: MouseEvent] }>()

const btnRef = ref<HTMLButtonElement | null>(null)
const shimmerActive = ref(false)

const variantClass = computed(() => {
  switch (props.variant) {
    case 'primary':
      return 'bg-linear-to-r from-indigo-500 to-violet-500 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:brightness-110'
    case 'secondary':
      return 'glass text-white/90 hover:bg-white/10'
    case 'ghost':
      return 'border border-white/15 text-white/80 hover:border-white/30 hover:bg-white/5'
    case 'danger':
      return 'bg-linear-to-r from-rose-500 to-pink-500 text-white shadow-lg shadow-rose-500/25 hover:brightness-110'
    default:
      return ''
  }
})

function onEnter() {
  shimmerActive.value = true
}

function onLeave() {
  shimmerActive.value = false
}
</script>
