<template>
  <!-- Full-viewport clip container -->
  <div ref="containerRef" class="home-viewport">
    <!-- Animating slides stack — GSAP translates this vertically -->
    <div ref="slidesRef" class="home-slides">

      <!-- ── Screen 1 · Hero ─────────────────────────────────────── -->
      <section ref="heroRef" class="home-screen relative flex flex-col items-center justify-center overflow-hidden px-6 text-center">
        <!-- Radial glow -->
        <div class="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div class="h-[600px] w-[600px] rounded-full bg-indigo-600/10 blur-[120px]" />
        </div>

        <!-- Badge -->
        <div ref="badgeEl" class="mb-6 inline-flex items-center gap-2 rounded-full glass border border-indigo-500/30 px-4 py-2 text-xs text-indigo-300 font-medium opacity-0">
          <span class="h-2 w-2 rounded-full bg-indigo-400 animate-pulse" />
          Karin 开源插件注册中心
        </div>

        <!-- Title -->
        <h1 ref="titleEl" class="font-display font-extrabold leading-tight tracking-tight text-white mb-6 opacity-0" style="font-size: clamp(2.8rem, 7vw, 9rem)">
          随心扩展&nbsp;<span class="karin-brand">Karin</span><br />
          <span class="gradient-text">无限可能</span>
        </h1>

        <!-- Subtitle -->
        <p ref="subtitleEl" class="w-full max-w-2xl text-lg md:text-xl 2xl:text-2xl text-white/55 font-body leading-relaxed mb-10 opacity-0">
          发现、分享并提交 Karin Bot 框架的社区插件，一站式插件中心，无限可能。
        </p>

        <!-- CTA Buttons -->
        <div ref="ctaEl" class="flex flex-col sm:flex-row items-center gap-4 opacity-0">
          <GlassButton variant="primary" class-name="px-8 py-3.5 text-base 2xl:px-10 2xl:py-4 2xl:text-lg" @click="router.push('/plugins')">
            浏览插件
          </GlassButton>
          <GlassButton variant="ghost" class-name="px-8 py-3.5 text-base 2xl:px-10 2xl:py-4 2xl:text-lg" @click="router.push('/submit')">
            提交插件
          </GlassButton>
        </div>

        <!-- Stats row -->
        <div ref="statsEl" class="mt-14 flex flex-wrap justify-center gap-12 opacity-0">
          <div v-for="stat in stats" :key="stat.label" class="text-center">
            <p class="font-display font-bold gradient-text" style="font-size: clamp(1.75rem, 2.5vw, 3rem)">{{ stat.value }}</p>
            <p class="text-xs 2xl:text-sm text-white/40 mt-1 uppercase tracking-wider">{{ stat.label }}</p>
          </div>
        </div>

        <!-- Scroll hint button -->
        <button
          class="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/25 text-xs hover:text-white/50 transition-colors cursor-pointer"
          @click="goTo(1)"
        >
          <span class="font-body">向下探索</span>
          <svg class="w-5 h-5 animate-bounce" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </section>

      <!-- ── Screen 2 · Features & CTA ──────────────────────────── -->
      <section ref="featuresRef" class="home-screen scrollbar-hide flex w-full flex-col items-center justify-center overflow-y-auto s2-py px-6 py-8">
        <div class="mx-auto w-full max-w-6xl flex flex-col gap-6 s2-gap">

          <!-- Heading -->
          <div ref="featHeadingEl" class="text-center s2-head opacity-0">
            <h2 class="font-display font-bold text-2xl md:text-3xl text-white mb-2">
              一切你所需要的
            </h2>
            <p class="text-white/45 text-sm max-w-md mx-auto">精选社区插件生态，由社区共建，为社区服务。</p>
          </div>

          <!-- Feature cards -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <GlassCard
              v-for="(feat, i) in features"
              :key="i"
              :hoverable="true"
              class-name="feature-card s2-card opacity-0 flex flex-col gap-3 p-5"
            >
              <div class="h-10 w-10 rounded-xl flex items-center justify-center shrink-0" :class="feat.iconBg">
                <!-- Bolt — fast integration -->
                <svg v-if="feat.icon === 'bolt'" class="w-5 h-5" :class="feat.iconColor" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
                <!-- Shield check — quality -->
                <svg v-else-if="feat.icon === 'shield'" class="w-5 h-5" :class="feat.iconColor" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
                <!-- Code brackets — open ecosystem -->
                <svg v-else-if="feat.icon === 'code'" class="w-5 h-5" :class="feat.iconColor" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                  <polyline points="16 18 22 12 16 6" />
                  <polyline points="8 6 2 12 8 18" />
                </svg>
              </div>
              <h3 class="font-display font-semibold text-white text-base">{{ feat.title }}</h3>
              <p class="text-sm text-white/50 leading-relaxed">{{ feat.desc }}</p>
            </GlassCard>
          </div>

          <!-- CTA banner -->
          <div ref="ctaBannerEl" class="glass relative overflow-hidden rounded-2xl s2-cta px-6 py-6 text-center gradient-border opacity-0">
            <div class="pointer-events-none absolute inset-0 bg-linear-to-br from-indigo-600/10 via-violet-600/5 to-transparent" />
            <h2 class="font-display font-bold text-xl md:text-2xl text-white mb-2 relative">准备好贡献了吗？</h2>
            <p class="text-white/50 mb-5 text-sm relative">你的插件可能成为下一个社区热门项目。</p>
            <GlassButton variant="primary" class-name="px-8 py-3 text-sm" @click="router.push('/submit')">
              立即提交插件
            </GlassButton>
          </div>

          <!-- Footer line -->
          <div ref="footerLineEl" class="flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-white/8 pt-4 text-xs text-white/30 opacity-0">
            <span class="font-display font-medium text-white/40">Karin Plugin Hub</span>
            <span class="hidden sm:block">开源插件注册中心 &mdash; 由社区共建</span>
            <span>&copy; {{ new Date().getFullYear() }} &middot; MIT License</span>
          </div>

        </div>
      </section>
    </div>

    <!-- Page indicator dots -->
    <nav class="absolute right-6 top-1/2 -translate-y-1/2 z-10 flex flex-col gap-2.5" aria-label="页面指示">
      <button
        v-for="(_, i) in 2"
        :key="i"
        class="h-2 w-2 rounded-full transition-all duration-300 cursor-pointer"
        :class="currentScreen === i
          ? 'scale-125 bg-indigo-400 shadow-[0_0_8px_rgba(99,102,241,0.8)]'
          : 'bg-white/20 hover:bg-white/50'"
        :aria-label="`跳转到第 ${i + 1} 屏`"
        @click="goTo(i)"
      />
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { gsap } from 'gsap'
import GlassCard from '@/components/GlassCard.vue'
import GlassButton from '@/components/GlassButton.vue'

const router = useRouter()

// ── Refs ──────────────────────────────────────────────────────────
const containerRef = ref<HTMLElement | null>(null)
const slidesRef    = ref<HTMLElement | null>(null)
const heroRef      = ref<HTMLElement | null>(null)
const featuresRef  = ref<HTMLElement | null>(null)
const badgeEl      = ref<HTMLElement | null>(null)
const titleEl      = ref<HTMLElement | null>(null)
const subtitleEl   = ref<HTMLElement | null>(null)
const ctaEl        = ref<HTMLElement | null>(null)
const statsEl      = ref<HTMLElement | null>(null)
const featHeadingEl = ref<HTMLElement | null>(null)
const ctaBannerEl   = ref<HTMLElement | null>(null)
const footerLineEl  = ref<HTMLElement | null>(null)

// ── State ─────────────────────────────────────────────────────────
const currentScreen = ref(0)
let isScrolling  = false
let touchStartY  = 0
let cardsAnimated = false

// ── Data ──────────────────────────────────────────────────────────
const stats = [
  { value: '60+',  label: '插件数' },
  { value: '1.2k', label: 'GitHub Stars' },
  { value: '200+', label: '贡献者' },
  { value: 'MIT',  label: '开源协议' },
]

const features = [
  {
    icon: 'bolt',
    iconBg: 'bg-indigo-500/20',
    iconColor: 'text-indigo-400',
    title: '快速集成',
    desc: '一行命令安装任意插件，无需复杂配置。',
  },
  {
    icon: 'shield',
    iconBg: 'bg-violet-500/20',
    iconColor: 'text-violet-400',
    title: '质量保障',
    desc: '所有提交的插件由社区审核，安全可靠。',
  },
  {
    icon: 'code',
    iconBg: 'bg-fuchsia-500/20',
    iconColor: 'text-fuchsia-400',
    title: '开放生态',
    desc: '基于 GitHub OAuth，几步操作即可提交你的仓库。',
  },
]

// ── Navigation ────────────────────────────────────────────────────
function goTo(index: number) {
  if (isScrolling || index === currentScreen.value) return
  if (index < 0 || index > 1) return
  isScrolling = true
  currentScreen.value = index

  gsap.to(slidesRef.value, {
    y: index === 0 ? '0%' : '-50%',
    duration: 0.9,
    ease: 'power3.inOut',
    onComplete() {
      isScrolling = false
      if (index === 1) animateFeatureCards()
    },
  })
}

function animateFeatureCards() {
  if (cardsAnimated) return
  cardsAnimated = true

  const tl2 = gsap.timeline()

  if (featHeadingEl.value) {
    tl2.fromTo(
      featHeadingEl.value,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out' },
    )
  }

  const cards = featuresRef.value?.querySelectorAll('.feature-card')
  if (cards?.length) {
    tl2.fromTo(
      cards,
      { opacity: 0, y: 28 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.12, ease: 'power3.out' },
      '-=0.3',
    )
  }

  if (ctaBannerEl.value) {
    tl2.fromTo(
      ctaBannerEl.value,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out' },
      '-=0.2',
    )
  }

  if (footerLineEl.value) {
    tl2.fromTo(
      footerLineEl.value,
      { opacity: 0 },
      { opacity: 1, duration: 0.4, ease: 'power2.out' },
      '-=0.15',
    )
  }
}

// ── Event handlers ────────────────────────────────────────────────
function onWheel(e: WheelEvent) {
  e.preventDefault()
  if (Math.abs(e.deltaY) < 10) return
  if (e.deltaY > 0) goTo(currentScreen.value + 1)
  else              goTo(currentScreen.value - 1)
}

function onKeyDown(e: KeyboardEvent) {
  if (e.key === 'ArrowDown' || e.key === ' ') {
    e.preventDefault()
    goTo(currentScreen.value + 1)
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    goTo(currentScreen.value - 1)
  }
}

function onTouchStart(e: TouchEvent) {
  touchStartY = e.touches[0].clientY
}

function onTouchEnd(e: TouchEvent) {
  const delta = touchStartY - e.changedTouches[0].clientY
  if (Math.abs(delta) > 50) {
    if (delta > 0) goTo(currentScreen.value + 1)
    else           goTo(currentScreen.value - 1)
  }
}

// ── Mount ─────────────────────────────────────────────────────────
onMounted(() => {
  // Clean up any leftover CSS-snap classes from previous implementation
  document.documentElement.classList.remove('home-snap-scroll')
  document.body.classList.remove('home-snap-scroll-body')

  gsap.set(slidesRef.value, { y: '0%' })
  gsap.set([badgeEl.value, titleEl.value, subtitleEl.value, ctaEl.value, statsEl.value], {
    y: 30,
    opacity: 0,
  })
  gsap.set([featHeadingEl.value, ctaBannerEl.value], { y: 24, opacity: 0 })
  gsap.set(footerLineEl.value, { opacity: 0 })

  const tl = gsap.timeline({ delay: 0.25 })
  tl.to(badgeEl.value,   { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' })
    .to(titleEl.value,   { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.3')
    .to(subtitleEl.value,{ opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.5')
    .to(ctaEl.value,     { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.4')
    .to(statsEl.value,   { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.3')

  window.addEventListener('wheel',      onWheel,      { passive: false })
  window.addEventListener('keydown',    onKeyDown)
  window.addEventListener('touchstart', onTouchStart, { passive: true })
  window.addEventListener('touchend',   onTouchEnd,   { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('wheel',      onWheel)
  window.removeEventListener('keydown',    onKeyDown)
  window.removeEventListener('touchstart', onTouchStart)
  window.removeEventListener('touchend',   onTouchEnd)
})
</script>