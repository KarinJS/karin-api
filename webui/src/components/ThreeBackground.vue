<template>
  <canvas ref="canvasRef" class="fixed inset-0 -z-10 w-full h-full" />
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as THREE from 'three'

const canvasRef = ref<HTMLCanvasElement | null>(null)

let renderer: THREE.WebGLRenderer
let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let animId: number
let clock: THREE.Clock
// Smoothed mouse targets — updated on mousemove, applied each frame (no per-frame overhead)
let targetMouseX = 0
let targetMouseY = 0
let isPageVisible = true

// --- Scene objects ---
let particlesMesh: THREE.Points
let orb1: THREE.Mesh
let orb2: THREE.Mesh
let torus: THREE.Mesh
let ringMesh: THREE.Mesh

const PARTICLE_COUNT = 1800

function init(canvas: HTMLCanvasElement) {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' })
  // Cap pixel ratio at 1.5: renders 44% fewer pixels on 2× screens, visually indistinguishable for a background
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.toneMapping = THREE.ACESFilmicToneMapping

  scene = new THREE.Scene()
  scene.fog = new THREE.FogExp2(0x070711, 0.018)

  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 200)
  camera.position.set(0, 0, 30)

  clock = new THREE.Clock()

  // ── Particles ───────────────────────────────────────────────────
  const positions = new Float32Array(PARTICLE_COUNT * 3)
  const colors = new Float32Array(PARTICLE_COUNT * 3)
  const c1 = new THREE.Color('#6366f1')
  const c2 = new THREE.Color('#8b5cf6')
  const c3 = new THREE.Color('#a78bfa')

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const i3 = i * 3
    const r = 18 + Math.random() * 20
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    positions[i3] = r * Math.sin(phi) * Math.cos(theta)
    positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta)
    positions[i3 + 2] = r * Math.cos(phi)

    const t = Math.random()
    const col = t < 0.33 ? c1 : t < 0.66 ? c2 : c3
    colors[i3] = col.r
    colors[i3 + 1] = col.g
    colors[i3 + 2] = col.b
  }

  const pGeo = new THREE.BufferGeometry()
  pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  pGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  const pMat = new THREE.PointsMaterial({
    size: 0.12,
    vertexColors: true,
    transparent: true,
    opacity: 0.7,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })
  particlesMesh = new THREE.Points(pGeo, pMat)
  scene.add(particlesMesh)

  // ── Primary orb ─────────────────────────────────────────────────
  const orbGeo = new THREE.IcosahedronGeometry(6, 12)
  const orbMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#6366f1'),
    emissive: new THREE.Color('#4338ca'),
    emissiveIntensity: 0.4,
    roughness: 0.2,
    metalness: 0.8,
    transparent: true,
    opacity: 0.55,
    wireframe: false,
  })
  orb1 = new THREE.Mesh(orbGeo, orbMat)
  orb1.position.set(-4, 2, -8)
  scene.add(orb1)

  // ── Secondary orb ───────────────────────────────────────────────
  const orb2Geo = new THREE.IcosahedronGeometry(3.5, 8)
  const orb2Mat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#8b5cf6'),
    emissive: new THREE.Color('#7c3aed'),
    emissiveIntensity: 0.5,
    roughness: 0.1,
    metalness: 0.9,
    transparent: true,
    opacity: 0.5,
  })
  orb2 = new THREE.Mesh(orb2Geo, orb2Mat)
  orb2.position.set(6, -3, -5)
  scene.add(orb2)

  // ── Torus knot ──────────────────────────────────────────────────
  const torusGeo = new THREE.TorusKnotGeometry(4, 0.6, 160, 20, 2, 3)
  const torusMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#a78bfa'),
    emissive: new THREE.Color('#7c3aed'),
    emissiveIntensity: 0.3,
    roughness: 0.3,
    metalness: 0.7,
    transparent: true,
    opacity: 0.35,
    wireframe: true,
  })
  torus = new THREE.Mesh(torusGeo, torusMat)
  torus.position.set(2, 0, -15)
  scene.add(torus)

  // ── Flat ring ───────────────────────────────────────────────────
  const ringGeo = new THREE.RingGeometry(8, 8.3, 96)
  const ringMat = new THREE.MeshBasicMaterial({
    color: new THREE.Color('#6366f1'),
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.12,
    blending: THREE.AdditiveBlending,
  })
  ringMesh = new THREE.Mesh(ringGeo, ringMat)
  ringMesh.rotation.x = Math.PI / 2.5
  ringMesh.position.y = -2
  scene.add(ringMesh)

  // ── Lights ──────────────────────────────────────────────────────
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.3)
  scene.add(ambientLight)

  const light1 = new THREE.PointLight('#6366f1', 60, 40)
  light1.position.set(-6, 4, 5)
  scene.add(light1)

  const light2 = new THREE.PointLight('#a78bfa', 40, 30)
  light2.position.set(8, -4, 3)
  scene.add(light2)
}

function animate() {
  animId = requestAnimationFrame(animate)
  // Skip rendering when the tab is hidden — saves GPU & CPU entirely
  if (!isPageVisible) return

  const t = clock.getElapsedTime()

  // Slow rotation
  particlesMesh.rotation.y = t * 0.04
  particlesMesh.rotation.x = t * 0.015

  orb1.rotation.x = t * 0.2
  orb1.rotation.y = t * 0.15
  orb1.position.y = 2 + Math.sin(t * 0.5) * 1.2

  orb2.rotation.x = -t * 0.18
  orb2.rotation.y = t * 0.12
  orb2.position.y = -3 + Math.cos(t * 0.4) * 0.8

  torus.rotation.x = t * 0.08
  torus.rotation.y = t * 0.12

  ringMesh.rotation.z = t * 0.06

  // Subtle mouse parallax — lerp applied once per frame, not on every mousemove
  camera.position.x += (targetMouseX * 4 - camera.position.x) * 0.04
  camera.position.y += (-targetMouseY * 3 - camera.position.y) * 0.04
  camera.lookAt(scene.position)

  renderer.render(scene, camera)
}

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

function onMouseMove(e: MouseEvent) {
  // Only update target values — lerp runs each frame, so no need to process every event individually
  targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2
  targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2
}

function onVisibilityChange() {
  isPageVisible = document.visibilityState === 'visible'
  // Resume the clock so t doesn't jump after returning to the tab
  if (isPageVisible) clock.start()
  else clock.stop()
}

onMounted(() => {
  if (!canvasRef.value) return
  init(canvasRef.value)
  animate()
  window.addEventListener('resize', onResize, { passive: true })
  window.addEventListener('mousemove', onMouseMove, { passive: true })
  document.addEventListener('visibilitychange', onVisibilityChange)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(animId)
  window.removeEventListener('resize', onResize)
  window.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('visibilitychange', onVisibilityChange)
  renderer?.dispose()
})
</script>