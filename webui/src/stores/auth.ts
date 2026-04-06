import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface GitHubUser {
  login: string
  name: string | null
  avatar_url: string
  html_url: string
  public_repos: number
}

export interface GitHubRepo {
  id: number
  name: string
  full_name: string
  description: string | null
  html_url: string
  stargazers_count: number
  language: string | null
  owner: {
    login: string
    avatar_url: string
    type: 'User' | 'Organization'
  }
  topics: string[]
  license: { spdx_id: string } | null
  updated_at: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<GitHubUser | null>(null)
  const repos = ref<GitHubRepo[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isLoggedIn = computed(() => user.value !== null)

  /** Read token from cookie */
  function getToken(): string | null {
    const match = document.cookie.match(/(?:^|;\s*)token=([^;]+)/)
    return match ? decodeURIComponent(match[1]) : null
  }

  async function fetchUser() {
    const token = getToken()
    if (!token) return
    loading.value = true
    error.value = null
    try {
      const res = await fetch('https://api.github.com/user', {
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json' },
      })
      if (!res.ok) throw new Error('Unauthorized')
      user.value = await res.json()
    } catch (e) {
      error.value = (e as Error).message
      user.value = null
    } finally {
      loading.value = false
    }
  }

  async function fetchRepos() {
    const token = getToken()
    if (!token || !user.value) return
    loading.value = true
    error.value = null
    try {
      // Personal repos
      const personalRes = await fetch(
        'https://api.github.com/user/repos?per_page=100&sort=updated&type=owner',
        { headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json' } },
      )
      const personal: GitHubRepo[] = personalRes.ok ? await personalRes.json() : []

      // Org repos
      const orgsRes = await fetch('https://api.github.com/user/orgs', {
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json' },
      })
      const orgs: Array<{ login: string }> = orgsRes.ok ? await orgsRes.json() : []

      const orgRepoArrays = await Promise.all(
        orgs.map((org) =>
          fetch(`https://api.github.com/orgs/${org.login}/repos?per_page=100&sort=updated`, {
            headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json' },
          }).then((r) => (r.ok ? r.json() : [])),
        ),
      )

      const allRepos: GitHubRepo[] = [personal, ...orgRepoArrays].flat()
      // Deduplicate
      const seen = new Set<number>()
      repos.value = allRepos.filter((r) => {
        if (seen.has(r.id)) return false
        seen.add(r.id)
        return true
      })
    } catch (e) {
      error.value = (e as Error).message
    } finally {
      loading.value = false
    }
  }

  function loginWithGitHub() {
    window.location.href = '/api/auth'
  }

  function logout() {
    document.cookie = 'token=; Max-Age=0; path=/'
    user.value = null
    repos.value = []
  }

  return { user, repos, loading, error, isLoggedIn, getToken, fetchUser, fetchRepos, loginWithGitHub, logout }
})
