<template>
  <nav
    class="glass-nav fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4"
    :class="scrolled && 'scrolled'"
  >
    <!-- Logo -->
    <RouterLink to="/" class="flex items-center gap-2 no-underline group">
      <div class="relative h-8 w-8">
        <div class="absolute inset-0 rounded-xl bg-linear-to-br from-indigo-500 to-violet-500 opacity-90 shadow-lg shadow-indigo-500/30 group-hover:shadow-indigo-500/60 transition-shadow duration-300" />
        <span class="absolute inset-0 flex items-center justify-center text-white font-bold text-sm font-display">K</span>
      </div>
      <span class="font-display font-bold text-lg text-white/90 tracking-tight">Karin</span>
      <span class="text-xs px-2 py-0.5 rounded-full glass border border-indigo-500/40 text-indigo-300 font-medium">Plugin Hub</span>
    </RouterLink>

    <!-- Nav links (desktop) -->
    <div class="hidden md:flex items-center gap-1">
      <RouterLink
        v-for="link in navLinks"
        :key="link.to"
        :to="link.to"
        class="relative px-4 py-2 rounded-full text-sm font-medium text-white/70 hover:text-white transition-colors duration-200 no-underline"
        active-class="text-white"
      >
        <span class="relative z-10">{{ link.label }}</span>
        <span class="router-link-active-indicator absolute inset-0 rounded-full glass opacity-0 transition-opacity duration-200" />
      </RouterLink>
    </div>

    <!-- Right side -->
    <div class="flex items-center gap-3">
      <template v-if="auth.isLoggedIn">
        <img
          :src="auth.user!.avatar_url"
          :alt="auth.user!.login"
          class="h-8 w-8 rounded-full ring-2 ring-indigo-500/40"
        />
        <span class="hidden md:block text-sm text-white/70 font-display">{{ auth.user!.login }}</span>
        <button
          class="text-white/40 hover:text-white/80 text-xs transition-colors"
          @click="auth.logout()"
        >退出</button>
      </template>
      <template v-else>
        <GlassButton variant="primary" class-name="text-xs" @click="auth.loginWithGitHub()">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
          </svg>
          GitHub 登录
        </GlassButton>
      </template>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import GlassButton from '@/components/GlassButton.vue'

const auth = useAuthStore()
const scrolled = ref(false)

const navLinks = [
  { to: '/', label: '首页' },
  { to: '/plugins', label: '插件库' },
  { to: '/submit', label: '提交插件' },
]

function onScroll() {
  scrolled.value = window.scrollY > 20
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  auth.fetchUser()
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<style scoped>
.router-link-active .router-link-active-indicator {
  opacity: 1;
}
</style>
