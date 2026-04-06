<template>
  <div
    ref="cardRef"
    class="glass rounded-3xl p-6 transition-all duration-300"
    :class="[hoverable && 'cursor-pointer hover:bg-white/10 hover:border-white/20', className]"
    :style="tiltStyle"
    @mousemove="hoverable ? onMouseMove($event) : undefined"
    @mouseleave="hoverable ? onMouseLeave() : undefined"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = withDefaults(
  defineProps<{
    hoverable?: boolean
    className?: string
  }>(),
  { hoverable: false, className: '' },
)

const cardRef = ref<HTMLDivElement | null>(null)
const rotateX = ref(0)
const rotateY = ref(0)

const tiltStyle = computed(() => {
  if (!props.hoverable) return {}
  return {
    transform: `perspective(800px) rotateX(${rotateX.value}deg) rotateY(${rotateY.value}deg) translateZ(0)`,
    transition: rotateX.value === 0 ? 'transform 0.5s ease' : 'transform 0.08s linear',
  }
})

function onMouseMove(e: MouseEvent) {
  const el = cardRef.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  const x = (e.clientX - rect.left) / rect.width - 0.5
  const y = (e.clientY - rect.top) / rect.height - 0.5
  rotateX.value = -y * 8
  rotateY.value = x * 8
}

function onMouseLeave() {
  rotateX.value = 0
  rotateY.value = 0
}
</script>
