'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import {
  createRealisticMarsMaps,
  createMartianCloudTexture,
  atmosphereVertexShader,
  atmosphereFragmentShader,
} from '@/lib/mars3d'

function getRingSinCos(el: Element | null): [number, number] | null {
  if (!el) return null
  const tf = window.getComputedStyle(el).transform
  if (!tf || tf === 'none') return [0, 1]
  const match = tf.match(/matrix\(([^)]+)\)/)
  if (!match) return null
  const parts = match[1].split(',').map((v) => parseFloat(v.trim()))
  if (parts.length < 2 || Number.isNaN(parts[0]) || Number.isNaN(parts[1])) return null
  return [parts[1], parts[0]] // [sin, cos]
}

export function HeroMarsGlobe() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const host = containerRef.current
    if (!host) return

    const wrapEl = host.closest('.mars-planet-orb-wrap')
    const outerRingEl = wrapEl?.querySelector('.ring-outer') ?? null
    const innerRingEl = wrapEl?.querySelector('.ring-inner') ?? null

    const scene = new THREE.Scene()

    const width = host.clientWidth || 380
    const height = host.clientHeight || 380
    const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 100)
    camera.position.set(0, 0, 4.15)

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.setSize(width, height)
    renderer.setClearColor(0x000000, 0)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.12
    host.appendChild(renderer.domElement)

    // Key solar light (creates crisp day/night shadow terminator)
    const sunDir = new THREE.Vector3(-1.35, 0.55, 0.95).normalize()
    const sunLight = new THREE.DirectionalLight(0xfff0df, 2.75)
    sunLight.position.copy(sunDir).multiplyScalar(8)
    scene.add(sunLight)

    const ambientLight = new THREE.AmbientLight(0x1b1016, 0.24)
    scene.add(ambientLight)

    // Dynamic orbital moon lights: cyan moon casts cyan onto Mars's shadow/limb, orange moon casts orange
    const cyanMoonDir = new THREE.Vector3(0, 1, 0.38).normalize()
    const orangeMoonDir = new THREE.Vector3(0, -1, 0.38).normalize()

    const cyanMoonLight = new THREE.PointLight(0x22d3ee, 6.2, 7.5, 1.35)
    cyanMoonLight.position.copy(cyanMoonDir).multiplyScalar(2.15)
    scene.add(cyanMoonLight)

    const orangeMoonLight = new THREE.PointLight(0xff5a2c, 6.6, 7.5, 1.35)
    orangeMoonLight.position.copy(orangeMoonDir).multiplyScalar(2.15)
    scene.add(orangeMoonLight)

    // Planet group so Y and Z axes rotate smoothly together
    const marsGroup = new THREE.Group()
    marsGroup.rotation.x = 0.18
    scene.add(marsGroup)

    const { map, bumpMap, roughnessMap } = createRealisticMarsMaps()
    const marsGeo = new THREE.SphereGeometry(1.12, 72, 72)
    const marsMat = new THREE.MeshStandardMaterial({
      map,
      bumpMap,
      bumpScale: 0.045,
      roughnessMap,
      roughness: 0.88,
      metalness: 0.04,
    })
    const marsMesh = new THREE.Mesh(marsGeo, marsMat)
    marsGroup.add(marsMesh)

    // Thin Martian dust/ice cloud wisps layer
    const cloudTex = createMartianCloudTexture()
    const cloudGeo = new THREE.SphereGeometry(1.136, 56, 56)
    const cloudMat = new THREE.MeshStandardMaterial({
      map: cloudTex,
      transparent: true,
      opacity: 0.65,
      depthWrite: false,
      roughness: 1,
    })
    const cloudMesh = new THREE.Mesh(cloudGeo, cloudMat)
    marsGroup.add(cloudMesh)

    // Realistic atmospheric rim shader shell reacting to sun + both orbiting moons
    const atmoGeo = new THREE.SphereGeometry(1.19, 64, 64)
    const atmoMat = new THREE.ShaderMaterial({
      vertexShader: atmosphereVertexShader,
      fragmentShader: atmosphereFragmentShader,
      uniforms: {
        uSunDir: { value: sunDir },
        uCyanMoonDir: { value: cyanMoonDir },
        uOrangeMoonDir: { value: orangeMoonDir },
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.FrontSide,
      depthWrite: false,
    })
    const atmoMesh = new THREE.Mesh(atmoGeo, atmoMat)
    scene.add(atmoMesh)

    // Subtle interactive pointer tilt
    let targetTiltX = 0.18
    let pointerActive = false
    const onPointerMove = (e: PointerEvent) => {
      const rect = host.getBoundingClientRect()
      const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2
      targetTiltX = 0.18 + ny * 0.22
      pointerActive = true
    }
    const onPointerLeave = () => {
      targetTiltX = 0.18
      pointerActive = false
    }
    host.addEventListener('pointermove', onPointerMove)
    host.addEventListener('pointerleave', onPointerLeave)

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = Math.max(120, Math.floor(entry.contentRect.width))
        const h = Math.max(120, Math.floor(entry.contentRect.height))
        camera.aspect = w / h
        camera.updateProjectionMatrix()
        renderer.setSize(w, h)
      }
    })
    resizeObserver.observe(host)

    let isVisible = true
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry?.isIntersecting ?? true
      },
      { threshold: 0.05 }
    )
    intersectionObserver.observe(host)

    let rafId = 0
    let lastTime = performance.now()

    const animate = (now: number) => {
      rafId = requestAnimationFrame(animate)
      if (!isVisible) {
        lastTime = now
        return
      }

      const dt = Math.min(0.05, (now - lastTime) / 1000)
      lastTime = now

      // Rotate Mars on both Y and Z axes
      marsGroup.rotation.y += dt * 0.24
      marsGroup.rotation.z += dt * 0.075
      cloudMesh.rotation.y += dt * 0.06

      if (pointerActive || Math.abs(marsGroup.rotation.x - targetTiltX) > 0.001) {
        marsGroup.rotation.x += (targetTiltX - marsGroup.rotation.x) * 0.06
      }

      // Sync cyan & orange shadow/rim lights directly to the CSS orbital moon positions
      const outerSC = getRingSinCos(outerRingEl)
      if (outerSC) {
        cyanMoonDir.set(outerSC[0], outerSC[1], 0.36).normalize()
      } else {
        const a1 = (now / 1000) * ((Math.PI * 2) / 35)
        cyanMoonDir.set(Math.sin(a1), Math.cos(a1), 0.36).normalize()
      }
      cyanMoonLight.position.copy(cyanMoonDir).multiplyScalar(2.15)

      const innerSC = getRingSinCos(innerRingEl)
      if (innerSC) {
        orangeMoonDir.set(-innerSC[0], -innerSC[1], 0.36).normalize()
      } else {
        const a2 = -(now / 1000) * ((Math.PI * 2) / 24)
        orangeMoonDir.set(-Math.sin(a2), -Math.cos(a2), 0.36).normalize()
      }
      orangeMoonLight.position.copy(orangeMoonDir).multiplyScalar(2.15)

      renderer.render(scene, camera)
    }

    rafId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(rafId)
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      host.removeEventListener('pointermove', onPointerMove)
      host.removeEventListener('pointerleave', onPointerLeave)
      marsGeo.dispose()
      marsMat.dispose()
      cloudGeo.dispose()
      cloudMat.dispose()
      atmoGeo.dispose()
      atmoMat.dispose()
      map.dispose()
      bumpMap.dispose()
      roughnessMap.dispose()
      cloudTex.dispose()
      renderer.dispose()
      if (renderer.domElement.parentNode === host) {
        host.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="hero-mars-canvas-host"
      aria-label="Interactive 3D Mars Planet"
    />
  )
}
