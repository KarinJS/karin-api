<template>
  <div class="max-w-3xl mx-auto px-6 py-16">
    <!-- Page header -->
    <div ref="headerRef" class="mb-10 opacity-0">
      <h1 class="font-display font-bold text-4xl text-white mb-3">提交插件</h1>
      <p class="text-white/50">选择一个 GitHub 仓库，将其提交至 Karin 插件中心。</p>
    </div>

    <!-- Step indicators -->
    <div ref="stepsRef" class="mb-10 flex items-center gap-3 opacity-0">
      <div v-for="(step, i) in steps" :key="i" class="flex items-center gap-3">
        <div class="flex items-center gap-2">
          <div class="step-dot" :class="currentStep > i ? 'done' : currentStep === i ? 'active' : ''" />
          <span class="text-xs font-medium" :class="currentStep === i ? 'text-white/80' : 'text-white/30'">{{ step }}</span>
        </div>
        <div v-if="i < steps.length - 1" class="h-px w-8 bg-white/10" />
      </div>
    </div>

    <!-- ── Step 0: GitHub login ────────────────────────────────── -->
    <Transition name="step" mode="out-in">
      <div v-if="currentStep === 0" key="login">
        <GlassCard class-name="gradient-border text-center py-14">
          <div class="pointer-events-none absolute inset-0 bg-linear-to-br from-indigo-600/8 via-violet-600/4 to-transparent rounded-3xl" />
          <div class="relative">
            <div class="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-linear-to-br from-indigo-500/20 to-violet-500/20 border border-white/10">
              <svg class="h-10 w-10 text-white/80" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
              </svg>
            </div>
            <h2 class="font-display font-bold text-2xl text-white mb-2">连接 GitHub</h2>
            <p class="text-white/50 text-sm mb-8 max-w-sm mx-auto">使用 GitHub 账号登录，以浏览你的仓库并提交插件。</p>
            <GlassButton variant="primary" class-name="px-8 py-3" @click="auth.loginWithGitHub()">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
              </svg>
              GitHub 登录
            </GlassButton>
          </div>
        </GlassCard>
      </div>

      <!-- ── Step 1: Select repository ───────────────────────── -->
      <div v-else-if="currentStep === 1" key="repos">
        <GlassCard class-name="mb-4">
          <div class="flex items-center gap-3 mb-4">
            <img :src="auth.user!.avatar_url" class="h-8 w-8 rounded-full" />
            <span class="text-white/80 font-medium text-sm font-display">{{ auth.user!.login }}</span>
            <span class="ml-auto text-xs text-white/30">已加载 {{ auth.repos.length }} 个仓库</span>
          </div>
          <input
            v-model="repoSearch"
            type="text"
            placeholder="搜索仓库..."
            class="glass-input"
          />
        </GlassCard>

        <div v-if="auth.loading" class="text-center py-16 text-white/30">
          <div class="inline-block h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent mb-4" />
          <p class="text-sm">仓库加载中...</p>
        </div>

        <div v-else class="space-y-2 max-h-96 overflow-y-auto pr-1">
          <div
            v-for="repo in filteredRepos"
            :key="repo.id"
            class="glass rounded-2xl px-4 py-3.5 cursor-pointer transition-all duration-200 flex items-center gap-4 group"
            :class="selectedRepo?.id === repo.id ? 'border-indigo-500/60 bg-indigo-500/10' : 'hover:bg-white/8'"
            @click="selectRepo(repo)"
          >
            <div class="flex-1 min-w-0">
              <p class="font-medium text-sm text-white/90 truncate font-display">{{ repo.full_name }}</p>
              <p v-if="repo.description" class="text-xs text-white/40 truncate mt-0.5">{{ repo.description }}</p>
            </div>
            <div class="flex items-center gap-3 shrink-0 text-xs text-white/30">
              <span v-if="repo.language" class="flex items-center gap-1">
                <span class="h-2 w-2 rounded-full bg-indigo-400" />{{ repo.language }}
              </span>
              <span>⭐ {{ repo.stargazers_count }}</span>
            </div>
            <div
              class="h-5 w-5 rounded-full border-2 shrink-0 transition-all"
              :class="selectedRepo?.id === repo.id ? 'border-indigo-400 bg-indigo-400' : 'border-white/20 group-hover:border-white/40'"
            />
          </div>
        </div>

        <div class="mt-6 flex justify-end">
          <GlassButton
            variant="primary"
            :disabled="!selectedRepo"
            @click="nextStep"
          >
            继续
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </GlassButton>
        </div>
      </div>

      <!-- ── Step 2: Fill plugin details ────────────────────── -->
      <div v-else-if="currentStep === 2" key="details">
        <form @submit.prevent="submitForm">
          <GlassCard class-name="space-y-5 mb-5">
            <!-- Selected repo display -->
            <div class="flex items-center gap-3 pb-4 border-b border-white/8">
              <img :src="selectedRepo!.owner.avatar_url" class="h-8 w-8 rounded-full" />
              <div>
                <p class="text-white/80 text-sm font-medium font-display">{{ selectedRepo!.full_name }}</p>
                <a :href="selectedRepo!.html_url" target="_blank" class="text-xs text-indigo-400 hover:text-indigo-300">在 GitHub 上查看 ↗</a>
              </div>
              <button type="button" class="ml-auto text-xs text-white/30 hover:text-white/60 transition-colors" @click="currentStep = 1">换一个</button>
            </div>

            <!-- Plugin name -->
            <div>
              <label class="block text-xs text-white/50 mb-1.5 font-medium">插件名称</label>
              <input v-model="form.name" type="text" required class="glass-input" placeholder="e.g. karin-plugin-music" />
            </div>

            <!-- Description -->
            <div>
              <label class="block text-xs text-white/50 mb-1.5 font-medium">描述</label>
              <textarea
                v-model="form.description"
                required
                rows="3"
                class="glass-input resize-none"
                placeholder="简要描述插件的功能..."
              />
            </div>

            <!-- Author (read-only) -->
            <div>
              <label class="block text-xs text-white/50 mb-1.5 font-medium">作者</label>
              <input :value="form.author" type="text" readonly class="glass-input opacity-60 cursor-default" />
            </div>

            <!-- Tags -->
            <div>
              <label class="block text-xs text-white/50 mb-1.5 font-medium">标签</label>
              <div class="flex flex-wrap gap-2 mb-2">
                <span
                  v-for="tag in form.tags"
                  :key="tag"
                  class="chip cursor-pointer select-none"
                  @click="removeTag(tag)"
                >
                  {{ tag }}
                  <svg class="w-3 h-3 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </span>
              </div>
              <div class="flex gap-2">
                <input
                  v-model="tagInput"
                  type="text"
                  class="glass-input flex-1"
                  placeholder="添加标签（按 Enter）"
                  maxlength="24"
                  @keydown.enter.prevent="addTag"
                  @keydown.comma.prevent="addTag"
                />
                <GlassButton type="button" variant="ghost" class-name="shrink-0 px-4" @click="addTag">添加</GlassButton>
              </div>
              <p class="text-xs text-white/25 mt-1">按 Enter 或逗号添加，点击标签删除。</p>
            </div>
          </GlassCard>

          <!-- Submit actions -->
          <div class="flex items-center justify-between">
            <button type="button" class="text-sm text-white/40 hover:text-white/70 transition-colors" @click="currentStep = 1">
              ← 返回
            </button>
            <GlassButton
              type="submit"
              variant="primary"
              :loading="pluginsStore.loading"
              class-name="px-8"
            >
              提交插件
            </GlassButton>
          </div>
        </form>
      </div>

      <!-- ── Step 3: Success ─────────────────────────────────── -->
      <div v-else key="success">
        <GlassCard class-name="text-center py-16">
          <div class="success-check mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/20 border border-emerald-500/30">
            <svg class="h-10 w-10 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
          </div>
          <h2 class="font-display font-bold text-2xl text-white mb-2">插件已提交！</h2>
          <p class="text-white/50 text-sm mb-8">
            <strong class="text-white/80">{{ form.name }}</strong> 已成功提交，正在等待团队审核。
          </p>
          <div class="flex justify-center gap-3">
            <GlassButton variant="ghost" @click="reset">继续提交</GlassButton>
            <GlassButton variant="primary" @click="router.push('/plugins')">查看插件</GlassButton>
          </div>
        </GlassCard>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { gsap } from 'gsap'
import { useAuthStore } from '@/stores/auth'
import { usePluginsStore } from '@/stores/plugins'
import type { GitHubRepo } from '@/stores/auth'
import GlassCard from '@/components/GlassCard.vue'
import GlassButton from '@/components/GlassButton.vue'

const router = useRouter()
const auth = useAuthStore()
const pluginsStore = usePluginsStore()

const headerRef = ref<HTMLElement | null>(null)
const stepsRef = ref<HTMLElement | null>(null)
const currentStep = ref(0)
const repoSearch = ref('')
const selectedRepo = ref<GitHubRepo | null>(null)
const tagInput = ref('')

const steps = ['连接 GitHub', '选择仓库', '填写详情', '完成']

const form = ref({
  name: '',
  description: '',
  author: '',
  tags: [] as string[],
  stars: 0,
  language: null as string | null,
  license: null as string | null,
})

const filteredRepos = computed(() => {
  const q = repoSearch.value.toLowerCase()
  if (!q) return auth.repos
  return auth.repos.filter(
    (r) => r.name.toLowerCase().includes(q) || r.full_name.toLowerCase().includes(q),
  )
})

/** Move to repo selection when logged in */
watch(
  () => auth.isLoggedIn,
  async (loggedIn) => {
    if (loggedIn && currentStep.value === 0) {
      currentStep.value = 1
      await auth.fetchRepos()
    }
  },
  { immediate: true },
)

function selectRepo(repo: GitHubRepo) {
  selectedRepo.value = repo
  form.value.name = repo.name
  form.value.description = repo.description ?? ''
  form.value.author = repo.owner.login
  form.value.stars = repo.stargazers_count
  form.value.language = repo.language
  form.value.license = repo.license?.spdx_id ?? null
  form.value.tags = [...repo.topics]
}

function nextStep() {
  if (!selectedRepo.value) return
  currentStep.value = 2
}

function addTag() {
  const t = tagInput.value.trim().replace(/,/g, '').toLowerCase()
  if (t && !form.value.tags.includes(t) && form.value.tags.length < 8) {
    form.value.tags.push(t)
  }
  tagInput.value = ''
}

function removeTag(tag: string) {
  form.value.tags = form.value.tags.filter((t) => t !== tag)
}

async function submitForm() {
  if (!selectedRepo.value) return
  const result = await pluginsStore.submitPlugin({
    name: form.value.name,
    description: form.value.description,
    repoUrl: selectedRepo.value.html_url,
    author: form.value.author,
    authorAvatar: selectedRepo.value.owner.avatar_url,
    tags: form.value.tags,
    stars: form.value.stars,
    language: form.value.language,
    license: form.value.license,
  })
  if (result.success) {
    currentStep.value = 3
    // Animate success check
    gsap.fromTo('.success-check', { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)', delay: 0.1 })
  }
}

function reset() {
  currentStep.value = auth.isLoggedIn ? 1 : 0
  selectedRepo.value = null
  repoSearch.value = ''
  tagInput.value = ''
  form.value = { name: '', description: '', author: '', tags: [], stars: 0, language: null, license: null }
}

onMounted(() => {
  gsap.set([headerRef.value, stepsRef.value], { y: 20 })
  gsap.to([headerRef.value, stepsRef.value], {
    opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', stagger: 0.1,
  })
})
</script>

<style scoped>
.step-enter-active,
.step-leave-active {
  transition: all 0.3s ease;
}
.step-enter-from {
  opacity: 0;
  transform: translateX(20px);
}
.step-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
</style>
