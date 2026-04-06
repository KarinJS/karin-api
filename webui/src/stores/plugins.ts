import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Plugin {
  id: string
  name: string
  description: string
  repoUrl: string
  author: string
  authorAvatar: string
  tags: string[]
  stars: number
  language: string | null
  license: string | null
  submittedAt: string
}

// ── Demo data ──────────────────────────────────────────────────────
const DEMO_PLUGINS: Plugin[] = [
  {
    id: '1',
    name: 'karin-plugin-music',
    description: '点歌、歌词搜索、网易云/QQ 音乐多源支持',
    repoUrl: 'https://github.com/example/karin-plugin-music',
    author: 'KarinTeam',
    authorAvatar: 'https://avatars.githubusercontent.com/u/9919?s=40',
    tags: ['music', 'entertainment'],
    stars: 128,
    language: 'TypeScript',
    license: 'MIT',
    submittedAt: '2025-12-01',
  },
  {
    id: '2',
    name: 'karin-plugin-weather',
    description: '实时天气查询，支持全球城市，多天预报、降雨图',
    repoUrl: 'https://github.com/example/karin-plugin-weather',
    author: 'weatherDev',
    authorAvatar: 'https://avatars.githubusercontent.com/u/1024025?s=40',
    tags: ['weather', 'utility'],
    stars: 74,
    language: 'TypeScript',
    license: 'Apache-2.0',
    submittedAt: '2025-11-20',
  },
  {
    id: '3',
    name: 'karin-plugin-gpt',
    description: 'ChatGPT / Claude 接入，支持上下文对话与角色扮演',
    repoUrl: 'https://github.com/example/karin-plugin-gpt',
    author: 'aiBuilder',
    authorAvatar: 'https://avatars.githubusercontent.com/u/583231?s=40',
    tags: ['ai', 'chatgpt', 'claude'],
    stars: 312,
    language: 'TypeScript',
    license: 'MIT',
    submittedAt: '2025-10-15',
  },
  {
    id: '4',
    name: 'karin-plugin-dice',
    description: 'TRPG 骰子系统，支持 COC / DND 规则集',
    repoUrl: 'https://github.com/example/karin-plugin-dice',
    author: 'trpgFan',
    authorAvatar: 'https://avatars.githubusercontent.com/u/1025830?s=40',
    tags: ['game', 'trpg', 'entertainment'],
    stars: 55,
    language: 'TypeScript',
    license: 'MIT',
    submittedAt: '2025-09-05',
  },
  {
    id: '5',
    name: 'karin-plugin-sign',
    description: '每日签到积分系统，支持自定义奖励配置',
    repoUrl: 'https://github.com/example/karin-plugin-sign',
    author: 'signDev',
    authorAvatar: 'https://avatars.githubusercontent.com/u/5821983?s=40',
    tags: ['utility', 'sign-in'],
    stars: 201,
    language: 'TypeScript',
    license: 'MIT',
    submittedAt: '2025-08-22',
  },
  {
    id: '6',
    name: 'karin-plugin-anime',
    description: '以图搜番、追番提醒、番剧信息查询',
    repoUrl: 'https://github.com/example/karin-plugin-anime',
    author: 'otakuCoder',
    authorAvatar: 'https://avatars.githubusercontent.com/u/9083930?s=40',
    tags: ['anime', 'search', 'entertainment'],
    stars: 167,
    language: 'TypeScript',
    license: 'MIT',
    submittedAt: '2025-07-10',
  },
]

export const usePluginsStore = defineStore('plugins', () => {
  const plugins = ref<Plugin[]>(DEMO_PLUGINS)
  const searchQuery = ref('')
  const activeTag = ref<string | null>(null)
  const loading = ref(false)

  const allTags = computed(() => {
    const tagSet = new Set<string>()
    plugins.value.forEach((p) => p.tags.forEach((t) => tagSet.add(t)))
    return Array.from(tagSet).sort()
  })

  const filteredPlugins = computed(() => {
    return plugins.value.filter((p) => {
      const matchesSearch =
        !searchQuery.value ||
        p.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        p.author.toLowerCase().includes(searchQuery.value.toLowerCase())
      const matchesTag = !activeTag.value || p.tags.includes(activeTag.value)
      return matchesSearch && matchesTag
    })
  })

  function setSearch(q: string) {
    searchQuery.value = q
  }

  function setTag(tag: string | null) {
    activeTag.value = activeTag.value === tag ? null : tag
  }

  async function submitPlugin(plugin: Omit<Plugin, 'id' | 'submittedAt'>) {
    loading.value = true
    try {
      // TODO: POST /api/plugins when backend endpoint is ready
      await new Promise((resolve) => setTimeout(resolve, 1200))
      const newPlugin: Plugin = {
        ...plugin,
        id: String(Date.now()),
        submittedAt: new Date().toISOString().slice(0, 10),
      }
      plugins.value.unshift(newPlugin)
      return { success: true }
    } catch (e) {
      return { success: false, error: (e as Error).message }
    } finally {
      loading.value = false
    }
  }

  return { plugins, searchQuery, activeTag, loading, allTags, filteredPlugins, setSearch, setTag, submitPlugin }
})
