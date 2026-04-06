<template>
  <div class="max-w-screen-2xl mx-auto px-4 sm:px-8 py-10 sm:py-16">
    <!-- Page header -->
    <div ref="headerRef" class="mb-12 opacity-0">
      <h1 class="font-display font-bold text-4xl text-white mb-3">插件库</h1>
      <p class="text-white/50">发现社区打造的插件，扩展你的 Karin Bot。</p>
    </div>

    <!-- Search & filter bar -->
    <div ref="filterRef" class="mb-8 flex flex-col gap-4 opacity-0">
      <div class="relative flex-1">
        <svg class="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          :value="plugins.searchQuery"
          type="text"
          placeholder="搜索插件..."
          class="glass-input pl-11"
          @input="plugins.setSearch(($event.target as HTMLInputElement).value)"
        />
      </div>
      <div class="flex gap-2 items-center overflow-x-auto pb-1 scrollbar-hide">
        <button
          class="chip"
          :class="plugins.activeTag === null && 'chip-active'"
          @click="plugins.setTag(null)"
        >全部</button>
        <button
          v-for="tag in plugins.allTags"
          :key="tag"
          class="chip"
          :class="plugins.activeTag === tag && 'chip-active'"
          @click="plugins.setTag(tag)"
        >{{ tag }}</button>
      </div>
    </div>

    <!-- Results count -->
    <p class="text-sm text-white/30 mb-6">
      找到 {{ plugins.filteredPlugins.length }} 个插件
    </p>

    <!-- Plugin grid -->
    <TransitionGroup
      tag="div"
      name="plugin-list"
      class="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5"
      @before-leave="onBeforeLeave"
    >
      <GlassCard
        v-for="plugin in plugins.filteredPlugins"
        :key="plugin.id"
        :hoverable="true"
        class-name="flex flex-col gap-4 min-h-52"
      >
        <!-- Card header -->
        <div class="flex items-start justify-between gap-3">
          <div class="flex items-center gap-3 min-w-0">
            <img
              :src="plugin.authorAvatar"
              :alt="plugin.author"
              class="h-9 w-9 rounded-full ring-1 ring-white/10 shrink-0"
            />
            <div class="min-w-0">
              <h3 class="font-display font-semibold text-white text-sm truncate">{{ plugin.name }}</h3>
              <p class="text-xs text-white/40 truncate">作者：{{ plugin.author }}</p>
            </div>
          </div>
          <a
            :href="plugin.repoUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="shrink-0 text-white/30 hover:text-white/70 transition-colors"
            @click.stop
          >
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
            </svg>
          </a>
        </div>

        <!-- Description -->
        <p class="text-sm text-white/55 leading-relaxed flex-1">{{ plugin.description }}</p>

        <!-- Tags -->
        <div class="flex flex-wrap gap-1.5">
          <span v-for="tag in plugin.tags" :key="tag" class="chip text-xs">{{ tag }}</span>
        </div>

        <!-- Footer meta -->
        <div class="flex items-center justify-between text-xs text-white/30 pt-2 border-t border-white/6">
          <div class="flex items-center gap-3">
            <span v-if="plugin.language" class="flex items-center gap-1">
              <span class="h-2 w-2 rounded-full bg-indigo-400 inline-block" />
              {{ plugin.language }}
            </span>
            <span v-if="plugin.license">{{ plugin.license }}</span>
          </div>
          <span class="flex items-center gap-1">
            <span>⭐</span>
            {{ plugin.stars }}
          </span>
        </div>
      </GlassCard>
    </TransitionGroup>

    <!-- Empty state -->
    <div v-if="plugins.filteredPlugins.length === 0" class="text-center py-24 text-white/30">
      <div class="text-5xl mb-4">🔍</div>
      <p class="font-display font-medium text-lg text-white/40">未找到相关插件</p>
      <p class="text-sm mt-2">试试其他搜索关键词或标签。</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { gsap } from 'gsap'
import { usePluginsStore } from '@/stores/plugins'
import GlassCard from '@/components/GlassCard.vue'

const plugins = usePluginsStore()

const headerRef = ref<HTMLElement | null>(null)
const filterRef = ref<HTMLElement | null>(null)

// FLIP: 记录卡片离开前的位置，让它在原位淡出而不是跑到(0,0)
function onBeforeLeave(el: Element) {
  const htmlEl = el as HTMLElement
  const { left, top, width, height } = htmlEl.getBoundingClientRect()
  const parentRect = htmlEl.parentElement!.getBoundingClientRect()
  htmlEl.style.position = 'absolute'
  htmlEl.style.left = `${left - parentRect.left}px`
  htmlEl.style.top = `${top - parentRect.top}px`
  htmlEl.style.width = `${width}px`
  htmlEl.style.height = `${height}px`
}

onMounted(() => {
  gsap.set([headerRef.value, filterRef.value], { y: 20 })
  gsap.to([headerRef.value, filterRef.value], {
    opacity: 1,
    y: 0,
    duration: 0.6,
    ease: 'power3.out',
    stagger: 0.1,
  })
})
</script>

<style scoped>
/* Enter: spring in from below */
.plugin-list-enter-active {
  transition:
    opacity 0.45s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.45s cubic-bezier(0.16, 1, 0.3, 1);
}
/* Leave: absolute 定位后在原位淡出 */
.plugin-list-leave-active {
  position: absolute;
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
  pointer-events: none;
  z-index: 0;
}
.plugin-list-enter-from {
  opacity: 0;
  transform: scale(0.88) translateY(24px);
}
.plugin-list-leave-to {
  opacity: 0;
  transform: scale(0.94);
}
/* 剩余卡片滑到新位置 */
.plugin-list-move {
  transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1);
}
</style>
