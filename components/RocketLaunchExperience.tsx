'use client'

import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import * as THREE from 'three'
import { Rocket, Volume2, VolumeX, FastForward, CheckCircle2, ChevronRight, Compass } from 'lucide-react'

export type FlightStage =
  | 'earth_pad'       // Realistic daytime launch facility: real photographic mountains, pine forest, concrete complex
  | 'earth_ascent'    // Liftoff: camera tracks rocket upward, sky turns to black space, flies smoothly into cockpit window
  | 'cabin_porthole'  // Inside cabin: Round window porthole showing the 3D Moon sliding across the center!
  | 'cabin_front'     // Inside cabin: Front rectangular windshield, round stars flying back fast, Mars grows huge
  | 'mars_exterior'   // 3D Mars canyon environment: canyon cliffs, boulders, Jezero landing pad, retro-burn
  | 'mars_touchdown'  // Touchdown on Jezero pad with dust shockwave
  | 'completed'       // Smooth dissolve to site

// =========================================================================
// TEXTURE GENERATORS (Photorealistic PBR Materials)
// =========================================================================

// 1. Perfectly Round Glowing Star Texture (No square pixels!)
function createRoundStarTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 64
  canvas.height = 64
  const ctx = canvas.getContext('2d')
  if (ctx) {
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 30)
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)')
    grad.addColorStop(0.35, 'rgba(240, 248, 255, 0.95)')
    grad.addColorStop(0.7, 'rgba(34, 211, 238, 0.4)')
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)')
    ctx.fillStyle = grad
    ctx.beginPath()
    ctx.arc(32, 32, 30, 0, Math.PI * 2)
    ctx.fill()
  }
  const tex = new THREE.CanvasTexture(canvas)
  tex.generateMipmaps = true
  return tex
}

// 2. Real Panoramic Earth Backdrop (Photorealistic Mountains, Clouds, Pine Forest)
function createEarthPanoramicTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 2048
  canvas.height = 1024
  const ctx = canvas.getContext('2d')
  if (ctx) {
    // Daytime Atmospheric Sky Gradient
    const skyGrad = ctx.createLinearGradient(0, 0, 0, 680)
    skyGrad.addColorStop(0, '#1d4ed8')     // Deep blue zenith
    skyGrad.addColorStop(0.4, '#38bdf8')   // Vibrant daytime cyan-blue
    skyGrad.addColorStop(0.75, '#93c5fd')  // Light atmospheric blue
    skyGrad.addColorStop(1.0, '#e0f2fe')   // Horizon haze
    ctx.fillStyle = skyGrad
    ctx.fillRect(0, 0, 2048, 1024)

    // Photorealistic Multi-Layered Cumulus & Wispy Cirrus Clouds
    // 1. High-altitude wispy cirrus streaks
    for (let i = 0; i < 18; i++) {
      const cx = (i * 130 + 30) % 2048
      const cy = 65 + (i % 4) * 38
      const w = 180 + (i % 3) * 80
      const cirrusGrad = ctx.createLinearGradient(cx - w, cy, cx + w, cy)
      cirrusGrad.addColorStop(0, 'rgba(255, 255, 255, 0)')
      cirrusGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.32)')
      cirrusGrad.addColorStop(1, 'rgba(255, 255, 255, 0)')
      ctx.fillStyle = cirrusGrad
      ctx.beginPath()
      ctx.ellipse(cx, cy, w, 10 + (i % 3) * 4, 0.04, 0, Math.PI * 2)
      ctx.fill()
    }

    // 2. Volumetric Cumulus Cloud Banks (Sunlit white tops + soft atmospheric shadow bases)
    const drawCumulusCluster = (baseX: number, baseY: number, scale: number) => {
      const puffs = [
        { dx: -55, dy: 10, r: 42, shade: true },
        { dx: 55, dy: 12, r: 44, shade: true },
        { dx: 0, dy: 14, r: 52, shade: true },
        { dx: -40, dy: -4, r: 40, shade: false },
        { dx: 38, dy: -2, r: 42, shade: false },
        { dx: -12, dy: -16, r: 48, shade: false },
        { dx: 18, dy: -12, r: 40, shade: false },
        { dx: 0, dy: -24, r: 34, shade: false },
      ]
      puffs.forEach((p) => {
        const px = baseX + p.dx * scale
        const py = baseY + p.dy * scale
        const pr = p.r * scale
        const grad = ctx.createRadialGradient(px, py - pr * 0.25, pr * 0.1, px, py, pr)
        if (p.shade) {
          grad.addColorStop(0, 'rgba(218, 232, 248, 0.55)')
          grad.addColorStop(0.65, 'rgba(176, 200, 228, 0.28)')
          grad.addColorStop(1, 'rgba(176, 200, 228, 0)')
        } else {
          grad.addColorStop(0, 'rgba(255, 255, 255, 0.88)')
          grad.addColorStop(0.55, 'rgba(241, 248, 255, 0.5)')
          grad.addColorStop(1, 'rgba(241, 248, 255, 0)')
        }
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(px, py, pr, 0, Math.PI * 2)
        ctx.fill()
      })
    }

    for (let i = 0; i < 14; i++) {
      const cx = (i * 150 + 70) % 2048
      const cy = 170 + Math.sin(i * 1.9) * 55
      const sc = 0.85 + (i % 3) * 0.35
      drawCumulusCluster(cx, cy, sc)
      if (cx < 160) drawCumulusCluster(cx + 2048, cy, sc)
      if (cx > 1888) drawCumulusCluster(cx - 2048, cy, sc)
    }

    // Distant Misty Mountain Range (Layer 1 - Atmospheric depth)
    ctx.fillStyle = '#64748b'
    ctx.beginPath()
    ctx.moveTo(0, 720)
    for (let x = 0; x <= 2048; x += 32) {
      const peak = Math.sin(x * 0.005) * 120 + Math.cos(x * 0.012) * 60 + Math.sin(x * 0.025) * 30
      ctx.lineTo(x, 480 - peak)
    }
    ctx.lineTo(2048, 720)
    ctx.closePath()
    ctx.fill()

    // Mid-Distance Realistic Alpine Mountains with Snowcaps (Layer 2)
    ctx.fillStyle = '#334155'
    ctx.beginPath()
    ctx.moveTo(0, 750)
    for (let x = 0; x <= 2048; x += 24) {
      const peak = Math.sin(x * 0.008 + 1) * 150 + Math.sin(x * 0.018) * 80 + Math.cos(x * 0.035) * 40
      ctx.lineTo(x, 530 - peak)
    }
    ctx.lineTo(2048, 750)
    ctx.closePath()
    ctx.fill()

    // Snowcaps on peaks
    ctx.fillStyle = '#f8fafc'
    for (let x = 60; x <= 2000; x += 180) {
      const y = 390 + Math.sin(x * 0.01) * 40
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(x + 45, y + 65)
      ctx.lineTo(x - 45, y + 65)
      ctx.closePath()
      ctx.fill()
    }

    // Realistic Dense Evergreen Pine Forest Horizon (Layer 3)
    ctx.fillStyle = '#14532d'
    for (let x = 0; x <= 2048; x += 6) {
      const treeHeight = 70 + Math.sin(x * 0.05) * 25 + Math.random() * 20
      const base = 730
      ctx.beginPath()
      ctx.moveTo(x, base - treeHeight)
      ctx.lineTo(x + 7, base)
      ctx.lineTo(x - 7, base)
      ctx.closePath()
      ctx.fill()
    }

    // Foreground Green Foothills & Ground Plain
    const groundGrad = ctx.createLinearGradient(0, 720, 0, 1024)
    groundGrad.addColorStop(0, '#1e3a1e')
    groundGrad.addColorStop(0.3, '#166534')
    groundGrad.addColorStop(1, '#15803d')
    ctx.fillStyle = groundGrad
    ctx.fillRect(0, 725, 2048, 300)
  }
  const tex = new THREE.CanvasTexture(canvas)
  tex.wrapS = THREE.RepeatWrapping
  tex.wrapT = THREE.ClampToEdgeWrapping
  tex.anisotropy = 16
  tex.generateMipmaps = true
  tex.minFilter = THREE.LinearMipmapLinearFilter
  tex.magFilter = THREE.LinearFilter
  return tex
}

// 3. Real Panoramic Martian Canyon Backdrop (Jezero Crater)
function createMarsPanoramicTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 2048
  canvas.height = 1024
  const ctx = canvas.getContext('2d')
  if (ctx) {
    // Martian Amber-Red Sky
    const skyGrad = ctx.createLinearGradient(0, 0, 0, 700)
    skyGrad.addColorStop(0, '#591307')
    skyGrad.addColorStop(0.4, '#8b2515')
    skyGrad.addColorStop(0.8, '#b84528')
    skyGrad.addColorStop(1.0, '#d9532e')
    ctx.fillStyle = skyGrad
    ctx.fillRect(0, 0, 2048, 1024)

    // Distant Crater Rim Mesas (Layer 1)
    ctx.fillStyle = '#3d0b04'
    ctx.beginPath()
    ctx.moveTo(0, 720)
    for (let x = 0; x <= 2048; x += 32) {
      const peak = Math.sin(x * 0.006) * 110 + Math.sin(x * 0.02) * 45
      ctx.lineTo(x, 540 - peak)
    }
    ctx.lineTo(2048, 720)
    ctx.closePath()
    ctx.fill()

    // Jagged Layered Canyon Cliffs (Layer 2)
    ctx.fillStyle = '#6b1809'
    ctx.beginPath()
    ctx.moveTo(0, 750)
    for (let x = 0; x <= 2048; x += 24) {
      const peak = Math.sin(x * 0.01 + 2) * 140 + Math.cos(x * 0.025) * 60
      ctx.lineTo(x, 590 - peak)
    }
    ctx.lineTo(2048, 750)
    ctx.closePath()
    ctx.fill()

    // Martian Rust-Red Desert Soil Floor
    const groundGrad = ctx.createLinearGradient(0, 730, 0, 1024)
    groundGrad.addColorStop(0, '#85200e')
    groundGrad.addColorStop(0.5, '#9e2b14')
    groundGrad.addColorStop(1, '#521206')
    ctx.fillStyle = groundGrad
    ctx.fillRect(0, 735, 2048, 290)
  }
  const tex = new THREE.CanvasTexture(canvas)
  tex.wrapS = THREE.RepeatWrapping
  tex.wrapT = THREE.ClampToEdgeWrapping
  tex.anisotropy = 16
  tex.generateMipmaps = true
  tex.minFilter = THREE.LinearMipmapLinearFilter
  tex.magFilter = THREE.LinearFilter
  return tex
}

// 4. Photorealistic Rocket Livery Decal (2048x1024 - Crystal Clear, High Definition)
function createRocketDecalTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 2048
  canvas.height = 1024
  const ctx = canvas.getContext('2d')
  if (ctx) {
    // Polished Aerospace Titanium Alloy Base with brushed micro-grain
    ctx.fillStyle = '#0f172a'
    ctx.fillRect(0, 0, 2048, 1024)

    // Brushed metal micro-lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.035)'
    ctx.lineWidth = 1
    for (let y = 0; y < 1024; y += 4) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(2048, y)
      ctx.stroke()
    }

    // Aerospace Panel Grid & Seams
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.09)'
    ctx.lineWidth = 2.5
    for (let x = 0; x < 2048; x += 128) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, 1024)
      ctx.stroke()
    }
    for (let y = 0; y < 1024; y += 128) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(2048, y)
      ctx.stroke()
    }

    // Precision Rivet Rows along panel seams
    ctx.fillStyle = 'rgba(255, 255, 255, 0.22)'
    for (let x = 16; x < 2048; x += 32) {
      ctx.fillRect(x, 126, 3, 3)
      ctx.fillRect(x, 254, 3, 3)
      ctx.fillRect(x, 766, 3, 3)
      ctx.fillRect(x, 894, 3, 3)
    }

    // Upper Mars Red Racing Bands (#E8452C)
    ctx.fillStyle = '#E8452C'
    ctx.fillRect(0, 75, 2048, 85)
    // Lower Mars Red Band
    ctx.fillRect(0, 815, 2048, 70)

    // Electric Cyan Aerospace Pin-Stripes (#22D3EE)
    ctx.fillStyle = '#22D3EE'
    ctx.fillRect(0, 164, 2048, 16)
    ctx.fillRect(0, 795, 2048, 16)

    // Helper to draw the crystal clear branding
    const drawBrandingAt = (centerX: number) => {
      ctx.save()

      // Technical emblem crest
      ctx.fillStyle = '#22D3EE'
      ctx.beginPath()
      ctx.arc(centerX, 360, 26, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#0f172a'
      ctx.beginPath()
      ctx.arc(centerX, 360, 18, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#E8452C'
      ctx.beginPath()
      ctx.arc(centerX, 360, 9, 0, Math.PI * 2)
      ctx.fill()

      // Primary Brand Name: MARSMENT (Ultra-Crisp, High Contrast)
      ctx.fillStyle = '#FFFFFF'
      ctx.font = '900 135px "Space Grotesk", "Inter", -apple-system, sans-serif'
      ctx.textAlign = 'center'
      ctx.letterSpacing = '18px'
      // Metallic shadow
      ctx.shadowColor = 'rgba(0, 0, 0, 0.9)'
      ctx.shadowBlur = 14
      ctx.shadowOffsetY = 4
      ctx.fillText('MARSMENT', centerX, 520)

      // Reset shadow for crisp secondary text
      ctx.shadowColor = 'transparent'
      ctx.shadowBlur = 0
      ctx.shadowOffsetY = 0

      // Expedition Mission Identifier
      ctx.fillStyle = '#22D3EE'
      ctx.font = '800 38px "Space Grotesk", sans-serif'
      ctx.letterSpacing = '12px'
      ctx.fillText('EXPEDITION • 01', centerX, 595)

      // Aerospace Technical Specs
      ctx.fillStyle = '#94A3B8'
      ctx.font = '700 22px monospace'
      ctx.letterSpacing = '6px'
      ctx.fillText('JEZERO COLONY TRANSPORT // STAR-CLASS', centerX, 650)

      // Hazard & Warning Stencils
      ctx.fillStyle = '#F59E0B'
      ctx.font = '700 16px monospace'
      ctx.letterSpacing = '3px'
      ctx.fillText('▲ RCS THRUSTER NOZZLE HAZARD ▲', centerX, 300)
      ctx.fillText('▼ LIQUID METHALOX VENTILATION ▼', centerX, 735)

      ctx.restore()
    }

    // Draw on Center (u = 0.5, maps to front +Z facing camera with fuselageMesh.rotation.y = Math.PI)
    drawBrandingAt(1024)
    // Draw also at edges (u = 0 and u = 1.0) so opposite side is also branded
    drawBrandingAt(0)
    drawBrandingAt(2048)
  }

  const tex = new THREE.CanvasTexture(canvas)
  tex.wrapS = THREE.RepeatWrapping
  tex.wrapT = THREE.ClampToEdgeWrapping
  tex.anisotropy = 16
  tex.generateMipmaps = true
  tex.minFilter = THREE.LinearMipmapLinearFilter
  tex.magFilter = THREE.LinearFilter
  tex.needsUpdate = true
  return tex
}

// Rocket Metallic Bump Map for realistic surface depth & panel seams
function createRocketBumpTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 512
  const ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.fillStyle = '#808080'
    ctx.fillRect(0, 0, 1024, 512)

    // Horizontal Panel Seams
    ctx.fillStyle = '#383838' // Sunken groove
    ctx.fillRect(0, 38, 1024, 4)
    ctx.fillRect(0, 82, 1024, 4)
    ctx.fillRect(0, 408, 1024, 4)
    ctx.fillRect(0, 438, 1024, 4)

    // Highlighted seam edges
    ctx.fillStyle = '#B8B8B8'
    ctx.fillRect(0, 42, 1024, 1.5)
    ctx.fillRect(0, 86, 1024, 1.5)
    ctx.fillRect(0, 412, 1024, 1.5)
    ctx.fillRect(0, 442, 1024, 1.5)

    // Vertical Segment Seams
    for (let x = 0; x < 1024; x += 128) {
      ctx.fillStyle = '#383838'
      ctx.fillRect(x, 0, 3, 512)
      ctx.fillStyle = '#B8B8B8'
      ctx.fillRect(x + 3, 0, 1.5, 512)
    }

    // Rivet Elevations
    ctx.fillStyle = '#FFFFFF'
    for (let x = 8; x < 1024; x += 16) {
      ctx.fillRect(x, 60, 2.5, 2.5)
      ctx.fillRect(x, 424, 2.5, 2.5)
    }
  }

  const tex = new THREE.CanvasTexture(canvas)
  tex.wrapS = THREE.RepeatWrapping
  tex.wrapT = THREE.ClampToEdgeWrapping
  tex.anisotropy = 16
  tex.generateMipmaps = true
  tex.minFilter = THREE.LinearMipmapLinearFilter
  tex.magFilter = THREE.LinearFilter
  tex.needsUpdate = true
  return tex
}

// 5. Detailed High-Resolution Moon Surface Texture (Maria, Ray Craters & Highlands)
function createMoonTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 2048
  canvas.height = 1024
  const ctx = canvas.getContext('2d')
  if (ctx) {
    // Base Anorthosite Lunar Highlands
    const bgGrad = ctx.createLinearGradient(0, 0, 2048, 1024)
    bgGrad.addColorStop(0, '#CBD5E1')
    bgGrad.addColorStop(0.5, '#94A3B8')
    bgGrad.addColorStop(1, '#CBD5E1')
    ctx.fillStyle = bgGrad
    ctx.fillRect(0, 0, 2048, 1024)

    // Subtle micro-regolith noise
    for (let i = 0; i < 4000; i++) {
      const rx = Math.random() * 2048
      const ry = Math.random() * 1024
      const rad = Math.random() * 3 + 0.5
      ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255, 255, 255, 0.12)' : 'rgba(30, 41, 59, 0.18)'
      ctx.beginPath()
      ctx.arc(rx, ry, rad, 0, Math.PI * 2)
      ctx.fill()
    }

    // Basaltic Lunar Maria (Dark Volcanic Plains)
    const maria = [
      { x: 520, y: 440, rx: 320, ry: 210, rot: 0.15 },  // Oceanus Procellarum
      { x: 740, y: 310, rx: 190, ry: 140, rot: -0.1 },  // Mare Imbrium
      { x: 1020, y: 350, rx: 140, ry: 110, rot: 0.05 }, // Mare Serenitatis
      { x: 1100, y: 470, rx: 160, ry: 120, rot: -0.2 }, // Mare Tranquillitatis
      { x: 1380, y: 380, rx: 100, ry: 80, rot: 0 },     // Mare Crisium
      { x: 1320, y: 550, rx: 140, ry: 100, rot: 0.25 }, // Mare Fecunditatis
      { x: 1120, y: 620, rx: 110, ry: 80, rot: -0.15 }, // Mare Nectaris
      { x: 800, y: 530, rx: 110, ry: 75, rot: 0.1 },    // Mare Vaporum
    ]

    maria.forEach((m) => {
      ctx.fillStyle = '#334155'
      ctx.beginPath()
      ctx.ellipse(m.x, m.y, m.rx, m.ry, m.rot, 0, Math.PI * 2)
      ctx.fill()

      // Inner darker core
      ctx.fillStyle = '#1E293B'
      ctx.beginPath()
      ctx.ellipse(m.x + 10, m.y + 10, m.rx * 0.7, m.ry * 0.7, m.rot, 0, Math.PI * 2)
      ctx.fill()
    })

    // Prominent Ray Craters: Tycho with radial ejecta streaks
    const tychoX = 840
    const tychoY = 790
    ctx.strokeStyle = 'rgba(241, 245, 249, 0.45)'
    ctx.lineWidth = 1.8
    for (let a = 0; a < 24; a++) {
      const angle = (a * 15 * Math.PI) / 180 + Math.random() * 0.1
      const rayLen = 220 + Math.random() * 380
      ctx.beginPath()
      ctx.moveTo(tychoX, tychoY)
      ctx.lineTo(tychoX + Math.cos(angle) * rayLen, tychoY + Math.sin(angle) * rayLen)
      ctx.stroke()
    }

    // Copernicus Ray Filaments
    const copX = 660
    const copY = 460
    ctx.strokeStyle = 'rgba(241, 245, 249, 0.35)'
    ctx.lineWidth = 1.4
    for (let a = 0; a < 16; a++) {
      const angle = (a * 22.5 * Math.PI) / 180
      const rayLen = 120 + Math.random() * 160
      ctx.beginPath()
      ctx.moveTo(copX, copY)
      ctx.lineTo(copX + Math.cos(angle) * rayLen, copY + Math.sin(angle) * rayLen)
      ctx.stroke()
    }

    // Impact Craters with sunlit rims and cast shadows
    const craters = [
      { x: tychoX, y: tychoY, r: 34 },
      { x: copX, y: copY, r: 42 },
      { x: 510, y: 470, r: 28 }, // Kepler
      { x: 380, y: 260, r: 46 }, // Plato
      { x: 1040, y: 720, r: 52 }, // Clavius
      { x: 1220, y: 310, r: 35 },
      { x: 1480, y: 460, r: 38 },
      { x: 260, y: 600, r: 44 },
      { x: 920, y: 210, r: 30 },
      { x: 420, y: 720, r: 36 },
      { x: 1600, y: 680, r: 40 },
      { x: 1750, y: 360, r: 48 },
    ]

    craters.forEach(({ x, y, r }) => {
      // Crater Floor
      ctx.fillStyle = '#0F172A'
      ctx.beginPath()
      ctx.arc(x, y, r, 0, Math.PI * 2)
      ctx.fill()

      // Central Peak
      if (r > 30) {
        ctx.fillStyle = '#E2E8F0'
        ctx.beginPath()
        ctx.arc(x - 2, y - 2, r * 0.16, 0, Math.PI * 2)
        ctx.fill()
      }

      // Bright Sunlit Rim (illuminated from upper-left)
      ctx.strokeStyle = '#FFFFFF'
      ctx.lineWidth = Math.max(2, r * 0.12)
      ctx.beginPath()
      ctx.arc(x, y, r, Math.PI * 0.65, Math.PI * 1.85)
      ctx.stroke()

      // Dark Interior Rim Shadow
      ctx.strokeStyle = '#020617'
      ctx.lineWidth = Math.max(2.5, r * 0.14)
      ctx.beginPath()
      ctx.arc(x, y, r, -Math.PI * 0.35, Math.PI * 0.65)
      ctx.stroke()
    })
  }
  const tex = new THREE.CanvasTexture(canvas)
  tex.wrapS = THREE.RepeatWrapping
  return tex
}

// Moon Surface Bump/Relief Map for realistic lighting
function createMoonBumpTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 512
  const ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.fillStyle = '#808080'
    ctx.fillRect(0, 0, 1024, 512)

    // Crater elevations
    const craters = [
      { x: 420, y: 395, r: 24 },
      { x: 330, y: 230, r: 28 },
      { x: 255, y: 235, r: 16 },
      { x: 520, y: 360, r: 26 },
      { x: 190, y: 130, r: 24 },
      { x: 610, y: 155, r: 22 },
      { x: 740, y: 230, r: 24 },
    ]

    craters.forEach(({ x, y, r }) => {
      const grad = ctx.createRadialGradient(x, y, 0, x, y, r)
      grad.addColorStop(0, '#202020') // Sunken crater basin
      grad.addColorStop(0.7, '#606060')
      grad.addColorStop(0.9, '#FFFFFF') // Elevated crater rim
      grad.addColorStop(1, '#808080')
      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.arc(x, y, r, 0, Math.PI * 2)
      ctx.fill()
    })
  }
  return new THREE.CanvasTexture(canvas)
}

// 6. Photorealistic Mars Albedo Map (NASA/MRO Geological Formations)
function createMarsTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 2048
  canvas.height = 1024
  const ctx = canvas.getContext('2d')
  if (ctx) {
    // 1. Natural Martian Rust Ochre & Desert Terrain Base
    const baseGrad = ctx.createLinearGradient(0, 0, 0, 1024)
    baseGrad.addColorStop(0, '#B44A24')    // Northern plains
    baseGrad.addColorStop(0.3, '#C7562E')  // Tharsis desert bulge
    baseGrad.addColorStop(0.5, '#B2421D')  // Equatorial ochre
    baseGrad.addColorStop(0.75, '#872B0E') // Southern cratered highlands
    baseGrad.addColorStop(1.0, '#661F09')  // South polar permafrost
    ctx.fillStyle = baseGrad
    ctx.fillRect(0, 0, 2048, 1024)

    // Micro-regolith geological noise
    for (let i = 0; i < 5000; i++) {
      const rx = Math.random() * 2048
      const ry = Math.random() * 1024
      const rad = Math.random() * 3.5 + 0.5
      ctx.fillStyle = Math.random() > 0.4 ? 'rgba(65, 17, 6, 0.18)' : 'rgba(235, 120, 60, 0.15)'
      ctx.beginPath()
      ctx.arc(rx, ry, rad, 0, Math.PI * 2)
      ctx.fill()
    }

    // 2. Real Martian Basaltic Dark Lowlands (Albedo Features)
    // A. Syrtis Major Planum (Iconic dark triangular volcanic shield)
    ctx.fillStyle = '#26120B'
    ctx.beginPath()
    ctx.moveTo(1440, 360)
    ctx.quadraticCurveTo(1580, 520, 1480, 640)
    ctx.quadraticCurveTo(1340, 560, 1370, 420)
    ctx.closePath()
    ctx.fill()

    // B. Acidalia Planitia (Dark Northern Lowlands Basin)
    ctx.fillStyle = '#200D07'
    ctx.beginPath()
    ctx.ellipse(400, 310, 220, 140, -0.15, 0, Math.PI * 2)
    ctx.fill()

    // C. Sinus Meridiani & Sinus Sabaeus (Equatorial Dark Belts)
    ctx.fillStyle = '#2A130B'
    ctx.beginPath()
    ctx.ellipse(820, 540, 340, 80, -0.05, 0, Math.PI * 2)
    ctx.fill()

    // D. Mare Tyrrhenum & Mare Cimmerium (Southern Dark Basalt Belt)
    ctx.fillStyle = '#220E08'
    ctx.beginPath()
    ctx.ellipse(1560, 640, 360, 100, 0.1, 0, Math.PI * 2)
    ctx.fill()

    // E. Mare Erythraeum (South of Valles Marineris)
    ctx.fillStyle = '#2D160D'
    ctx.beginPath()
    ctx.ellipse(560, 680, 220, 110, 0.2, 0, Math.PI * 2)
    ctx.fill()

    // 3. Giant Impact Basins with Atmospheric Dust Haze
    // Hellas Planitia (Massive circular southern basin)
    ctx.fillStyle = '#DE8450'
    ctx.beginPath()
    ctx.ellipse(1520, 740, 180, 130, -0.1, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = '#5E1B07'
    ctx.lineWidth = 14
    ctx.stroke()

    // Argyre Planitia
    ctx.fillStyle = '#D67642'
    ctx.beginPath()
    ctx.ellipse(440, 760, 110, 90, 0.05, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = '#521706'
    ctx.lineWidth = 10
    ctx.stroke()

    // 4. Valles Marineris (4,000 km Grand Canyon Rift System)
    ctx.strokeStyle = '#140602' // Deep canyon floor in shadow
    ctx.lineWidth = 18
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.moveTo(420, 545)
    ctx.bezierCurveTo(560, 580, 720, 570, 880, 530)
    ctx.stroke()

    // Noctis Labyrinthus branching canyons
    ctx.lineWidth = 6
    ctx.beginPath()
    ctx.moveTo(420, 545)
    ctx.lineTo(370, 520)
    ctx.moveTo(420, 545)
    ctx.lineTo(390, 575)
    ctx.stroke()

    // Northern sunlit canyon cliff rim
    ctx.strokeStyle = '#F28A5C'
    ctx.lineWidth = 3.5
    ctx.beginPath()
    ctx.moveTo(425, 537)
    ctx.bezierCurveTo(562, 572, 720, 562, 876, 523)
    ctx.stroke()

    // 5. Tharsis Volcanoes (Shield Volcanoes with Summit Calderas)
    // Olympus Mons (Tallest volcano in the solar system)
    const olyX = 260
    const olyY = 410
    const olyGrad = ctx.createRadialGradient(olyX, olyY, 8, olyX, olyY, 90)
    olyGrad.addColorStop(0, '#752309')
    olyGrad.addColorStop(0.3, '#B44A22')
    olyGrad.addColorStop(0.85, '#D66539')
    olyGrad.addColorStop(1, 'transparent')
    ctx.fillStyle = olyGrad
    ctx.beginPath()
    ctx.arc(olyX, olyY, 90, 0, Math.PI * 2)
    ctx.fill()

    // Olympus Mons Caldera
    ctx.fillStyle = '#220803'
    ctx.beginPath()
    ctx.arc(olyX, olyY, 18, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = '#FFFFFF'
    ctx.lineWidth = 2.5
    ctx.stroke()

    // Tharsis Montes Trio (Ascraeus, Pavonis, Arsia Mons)
    const tharsisVolcanoes = [
      { x: 370, y: 460, r: 48 }, // Ascraeus Mons
      { x: 340, y: 530, r: 44 }, // Pavonis Mons
      { x: 310, y: 600, r: 52 }, // Arsia Mons
    ]
    tharsisVolcanoes.forEach((v) => {
      ctx.fillStyle = 'rgba(74, 18, 6, 0.7)'
      ctx.beginPath()
      ctx.arc(v.x, v.y, v.r, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#1D0602'
      ctx.beginPath()
      ctx.arc(v.x, v.y, 10, 0, Math.PI * 2)
      ctx.fill()
    })

    // 6. Polar Ice Caps (Water-Ice & Dry Carbon-Dioxide Ice)
    // North Polar Ice Cap (Planum Boreum with spiral ice troughs)
    ctx.fillStyle = '#FFFFFF'
    ctx.beginPath()
    ctx.ellipse(1024, 34, 380, 58, 0, 0, Math.PI * 2)
    ctx.fill()

    ctx.strokeStyle = '#2B1008' // Chasma Boreale dark spiral dune troughs
    ctx.lineWidth = 4
    for (let s = 0; s < 8; s++) {
      const sx = 700 + s * 80
      ctx.beginPath()
      ctx.moveTo(sx, 48)
      ctx.quadraticCurveTo(sx + 30, 24, sx + 70, 16)
      ctx.stroke()
    }

    // South Polar Ice Cap (Planum Australe)
    ctx.fillStyle = '#FFFFFF'
    ctx.beginPath()
    ctx.ellipse(1024, 988, 280, 50, 0, 0, Math.PI * 2)
    ctx.fill()

    // 7. Delicate Orographic Water-Ice Clouds over volcanoes
    ctx.fillStyle = 'rgba(255, 255, 255, 0.28)'
    ctx.beginPath()
    ctx.ellipse(olyX + 45, olyY - 20, 55, 22, 0.2, 0, Math.PI * 2)
    ctx.fill()
  }
  const tex = new THREE.CanvasTexture(canvas)
  tex.wrapS = THREE.RepeatWrapping
  return tex
}

// Mars Surface Bump/Relief Map for 3D Geological Depth (No harsh dimples or artifacts!)
function createMarsBumpTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 512
  const ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.fillStyle = '#808080'
    ctx.fillRect(0, 0, 1024, 512)

    // Gentle geological micro-relief
    for (let i = 0; i < 800; i++) {
      const rx = Math.random() * 1024
      const ry = Math.random() * 512
      const r = Math.random() * 6 + 1.5
      ctx.fillStyle = Math.random() > 0.5 ? 'rgba(210, 210, 210, 0.08)' : 'rgba(70, 70, 70, 0.08)'
      ctx.beginPath()
      ctx.arc(rx, ry, r, 0, Math.PI * 2)
      ctx.fill()
    }

    // Subtle Valles Marineris canyon groove
    ctx.strokeStyle = '#505050'
    ctx.lineWidth = 4
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.moveTo(210, 272)
    ctx.bezierCurveTo(280, 288, 360, 282, 440, 265)
    ctx.stroke()

    // Raised canyon rims
    ctx.strokeStyle = '#A8A8A8'
    ctx.lineWidth = 1.5
    ctx.stroke()
  }
  const tex = new THREE.CanvasTexture(canvas)
  tex.wrapS = THREE.RepeatWrapping
  tex.anisotropy = 16
  tex.generateMipmaps = true
  tex.minFilter = THREE.LinearMipmapLinearFilter
  tex.magFilter = THREE.LinearFilter
  return tex
}

// =========================================================================
// MAIN COMPONENT
// =========================================================================
export function RocketLaunchExperience({ onComplete }: { onComplete?: () => void }) {
  const pathname = usePathname()
  const [stage, setStage] = useState<FlightStage>('earth_pad')
  const [isLaunched, setIsLaunched] = useState(false)
  const [audioEnabled, setAudioEnabled] = useState(false)
  const [dismissed, setDismissed] = useState(true)
  const [progress, setProgress] = useState(0)

  // Live Telemetry Readouts
  const [velocityKmS, setVelocityKmS] = useState(0)
  const [altitudeKm, setAltitudeKm] = useState(0)
  const [targetDistanceMkm, setTargetDistanceMkm] = useState(225.0)

  const containerRef = useRef<HTMLDivElement | null>(null)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const animFrameRef = useRef<number | null>(null)
  const stageRef = useRef<FlightStage>('earth_pad')
  stageRef.current = stage

  // Real-time animation progress ref (0.0 to 1.0) synchronized with 60fps Three.js loop
  const flightProgressRef = useRef<number>(0)

  // Lock body scroll while overlay is active
  useEffect(() => {
    if (pathname !== '/') {
      setDismissed(true)
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
      return
    }

    try {
      const alreadyLaunched = sessionStorage.getItem('marsment_rocket_launched')
      if (!alreadyLaunched) {
        setDismissed(false)
        document.body.style.overflow = 'hidden'
        document.documentElement.style.overflow = 'hidden'
      } else {
        setDismissed(true)
        document.body.style.overflow = ''
        document.documentElement.style.overflow = ''
      }
    } catch {
      setDismissed(false)
      document.body.style.overflow = 'hidden'
      document.documentElement.style.overflow = 'hidden'
    }

    const handleReplay = () => {
      setStage('earth_pad')
      setIsLaunched(false)
      setProgress(0)
      flightProgressRef.current = 0
      setVelocityKmS(0)
      setAltitudeKm(0)
      setTargetDistanceMkm(225.0)
      setDismissed(false)
      document.body.style.overflow = 'hidden'
      document.documentElement.style.overflow = 'hidden'
    }

    window.addEventListener('marsment:replay-launch', handleReplay)
    return () => {
      window.removeEventListener('marsment:replay-launch', handleReplay)
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
    }
  }, [pathname])

  // Sound Synthesizer
  const playSoundEffect = (type: 'ignite' | 'cabin' | 'warp' | 'plasma' | 'touchdown') => {
    if (!audioEnabled && type !== 'ignite') return
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
      }
      const ctx = audioCtxRef.current
      if (ctx.state === 'suspended') ctx.resume()
      const now = ctx.currentTime
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)

      if (type === 'ignite') {
        osc.type = 'sawtooth'
        osc.frequency.setValueAtTime(45, now)
        osc.frequency.exponentialRampToValueAtTime(110, now + 2.0)
        gain.gain.setValueAtTime(0.01, now)
        gain.gain.linearRampToValueAtTime(0.28, now + 0.4)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 2.8)
        osc.start(now)
        osc.stop(now + 2.8)
      } else if (type === 'cabin') {
        osc.type = 'sine'
        osc.frequency.setValueAtTime(95, now)
        gain.gain.setValueAtTime(0.1, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 2.2)
        osc.start(now)
        osc.stop(now + 2.2)
      } else if (type === 'warp') {
        osc.type = 'triangle'
        osc.frequency.setValueAtTime(160, now)
        osc.frequency.exponentialRampToValueAtTime(980, now + 2.2)
        gain.gain.setValueAtTime(0.18, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 2.2)
        osc.start(now)
        osc.stop(now + 2.2)
      } else if (type === 'plasma') {
        osc.type = 'sawtooth'
        osc.frequency.setValueAtTime(170, now)
        osc.frequency.linearRampToValueAtTime(80, now + 1.8)
        gain.gain.setValueAtTime(0.2, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.8)
        osc.start(now)
        osc.stop(now + 1.8)
      } else if (type === 'touchdown') {
        osc.type = 'sine'
        osc.frequency.setValueAtTime(523.25, now)
        osc.frequency.setValueAtTime(659.25, now + 0.15)
        osc.frequency.setValueAtTime(783.99, now + 0.3)
        gain.gain.setValueAtTime(0.16, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.8)
        osc.start(now)
        osc.stop(now + 1.8)
      }
    } catch {
      // Audio optional
    }
  }

  // =========================================================================
  // THREE.JS 3D WEBGL GRAPHICS ENGINE
  // =========================================================================
  useEffect(() => {
    if (dismissed) return
    const container = containerRef.current
    if (!container) return

    // Scene & Camera
    const scene = new THREE.Scene()
    const daySkyColor = new THREE.Color(0x38bdf8)
    const spaceBlack = new THREE.Color(0x040711)
    const marsSkyColor = new THREE.Color(0x591307)
    const currentBg = new THREE.Color(0x38bdf8)
    const expFog = new THREE.FogExp2(0x38bdf8, 0.0012)
    scene.background = currentBg
    scene.fog = expFog

    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 3500)
    camera.position.set(0, 14, 52)

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.3
    renderer.shadowMap.enabled = true
    container.appendChild(renderer.domElement)

    // Lighting (Realistic Daytime Sunlight)
    const ambientLight = new THREE.AmbientLight(0xbae6fd, 1.6)
    scene.add(ambientLight)

    const sunLight = new THREE.DirectionalLight(0xfffaed, 3.5)
    sunLight.position.set(80, 140, 60)
    sunLight.castShadow = true
    scene.add(sunLight)

    const moonSunLight = new THREE.DirectionalLight(0xffffff, 2.8)
    moonSunLight.position.set(50, 20, 30)
    scene.add(moonSunLight)

    // Dedicated Photorealistic Lights for Rocket & Mars
    const rocketFrontLight = new THREE.DirectionalLight(0xffffff, 2.6)
    rocketFrontLight.position.set(12, 35, 55)
    scene.add(rocketFrontLight)

    const rocketRimLight = new THREE.DirectionalLight(0x22d3ee, 1.8)
    rocketRimLight.position.set(-35, 25, -20)
    scene.add(rocketRimLight)

    const marsSunLight = new THREE.DirectionalLight(0xfffaed, 3.2)
    marsSunLight.position.set(120, 50, -160)
    scene.add(marsSunLight)

    const engineLight = new THREE.PointLight(0xe8452c, 0, 50)
    scene.add(engineLight)

    // =======================================================================
    // 1. THE 3D SUPER-REALISTIC ROCKET (Crystal Clear, Metallic Alloy)
    // =======================================================================
    const rocketGroup = new THREE.Group()
    scene.add(rocketGroup)
    rocketGroup.position.set(0, 10, 0)

    // Fuselage - High-Res Metallic Titanium with Front Decal
    const fuselageGeo = new THREE.CylinderGeometry(2.4, 2.4, 18, 48)
    const rocketDecalTex = createRocketDecalTexture()
    const rocketBumpTex = createRocketBumpTexture()
    const fuselageMat = new THREE.MeshStandardMaterial({
      map: rocketDecalTex,
      bumpMap: rocketBumpTex,
      bumpScale: 0.16,
      metalness: 0.94,
      roughness: 0.15,
      color: 0xffffff,
    })
    const fuselageMesh = new THREE.Mesh(fuselageGeo, fuselageMat)
    // Rotate 180° so the center of texture (u = 0.5) faces directly +Z (front camera)
    fuselageMesh.rotation.y = Math.PI
    fuselageMesh.castShadow = true
    rocketGroup.add(fuselageMesh)

    // Nosecone - Metallic Mars Red
    const noseGeo = new THREE.ConeGeometry(2.4, 7.5, 48)
    const noseMat = new THREE.MeshStandardMaterial({
      color: 0xe8452c,
      metalness: 0.92,
      roughness: 0.14,
    })
    const noseMesh = new THREE.Mesh(noseGeo, noseMat)
    noseMesh.position.y = 18 / 2 + 7.5 / 2
    noseMesh.castShadow = true
    rocketGroup.add(noseMesh)

    // Cockpit Window Glass with glowing cyan rim
    const portholeFrame = new THREE.Mesh(
      new THREE.TorusGeometry(0.72, 0.12, 16, 32),
      new THREE.MeshStandardMaterial({ color: 0x22d3ee, metalness: 0.9, roughness: 0.1, emissive: 0x22d3ee, emissiveIntensity: 0.5 })
    )
    portholeFrame.position.set(0, 6.2, 2.38)
    rocketGroup.add(portholeFrame)

    const portholeGlass = new THREE.Mesh(
      new THREE.CircleGeometry(0.7, 32),
      new THREE.MeshStandardMaterial({ color: 0x050d1a, metalness: 0.95, roughness: 0.05, emissive: 0x112238, emissiveIntensity: 0.4 })
    )
    portholeGlass.position.set(0, 6.2, 2.39)
    rocketGroup.add(portholeGlass)

    // Raptor Thruster Nozzle
    const nozzleMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(1.4, 2.2, 3.2, 32, 1, true),
      new THREE.MeshStandardMaterial({ color: 0x111827, metalness: 0.96, roughness: 0.12, side: THREE.DoubleSide })
    )
    nozzleMesh.position.y = -9 - 1.6
    rocketGroup.add(nozzleMesh)

    // 4 Aerodynamic Stabilizer Fins (X-Wing 45° offset: Leaves front and sides completely unobstructed)
    const finShape = new THREE.Shape()
    finShape.moveTo(0, 0)
    finShape.lineTo(3.2, -4.5)
    finShape.lineTo(3.2, -7.5)
    finShape.lineTo(0, -6.0)
    finShape.closePath()
    const finGeo = new THREE.ExtrudeGeometry(finShape, { depth: 0.2, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 0.08, bevelThickness: 0.08 })
    const finMat = new THREE.MeshStandardMaterial({ color: 0xe8452c, metalness: 0.90, roughness: 0.18 })
    for (let i = 0; i < 4; i++) {
      const fin = new THREE.Mesh(finGeo, finMat)
      fin.rotation.y = (i * Math.PI) / 2 + Math.PI / 4 // 45° diagonal placement
      fin.position.y = -3
      rocketGroup.add(fin)
    }

    // Realistic Animated Rocket Exhaust Plume (GLSL Turbulence + Mach Shock Diamonds + Particles)
    const flameVertexShader = `
      uniform float uTime;
      varying vec2 vUv;
      varying vec3 vNormalView;
      varying vec3 vViewPos;

      void main() {
        vUv = uv;
        vec3 pos = position;
        float tailFactor = 1.0 - uv.y;
        float wave1 = sin(uv.y * 12.0 + uTime * 24.0 + pos.x * 2.5) * 0.24;
        float wave2 = cos(uv.y * 18.0 + uTime * 32.0 + pos.z * 2.5) * 0.18;
        float flare = (wave1 + wave2) * tailFactor;
        pos.x += normal.x * flare + sin(uTime * 19.0 + uv.y * 8.0) * 0.14 * tailFactor;
        pos.z += normal.z * flare + cos(uTime * 21.0 + uv.y * 8.0) * 0.14 * tailFactor;

        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        vViewPos = -mvPosition.xyz;
        vNormalView = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * mvPosition;
      }
    `

    const flameFragmentShader = `
      uniform float uTime;
      uniform float uOpacity;
      uniform vec3 uCoreColor;
      uniform vec3 uMidColor;
      uniform vec3 uOuterColor;
      varying vec2 vUv;
      varying vec3 vNormalView;
      varying vec3 vViewPos;

      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        float a = hash(i);
        float b = hash(i + vec2(1.0, 0.0));
        float c = hash(i + vec2(0.0, 1.0));
        float d = hash(i + vec2(1.0, 1.0));
        return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
      }

      float fbm(vec2 p) {
        float v = 0.0;
        float a = 0.5;
        for (int i = 0; i < 4; i++) {
          v += a * noise(p);
          p *= 2.05;
          a *= 0.5;
        }
        return v;
      }

      void main() {
        vec2 flowUv = vec2(vUv.x * 5.0, vUv.y * 4.5 + uTime * 11.0);
        float turb = fbm(flowUv);
        float turb2 = fbm(vec2(vUv.x * 9.0 + 3.1, vUv.y * 7.5 + uTime * 16.0));
        float flameNoise = turb * 0.65 + turb2 * 0.35;

        // Standing Mach shock diamonds near nozzle exit
        float diamondWave = pow(max(0.0, sin((1.0 - vUv.y) * 28.0 - uTime * 3.0)), 6.0);
        float shockDiamonds = diamondWave * smoothstep(0.35, 0.92, vUv.y) * 0.85;

        // Soft feathered edge (zero hard cone border)
        vec3 viewDir = normalize(vViewPos);
        float rimFade = pow(abs(dot(normalize(vNormalView), viewDir)), 1.35);

        float topFade = smoothstep(1.0, 0.92, vUv.y);
        float tailThreshold = smoothstep(0.0, 0.68, vUv.y + (flameNoise - 0.45) * 0.55);
        float alpha = rimFade * topFade * tailThreshold * (0.55 + flameNoise * 0.65 + shockDiamonds * 0.4) * uOpacity;

        vec3 col = mix(uOuterColor, uMidColor, smoothstep(0.2, 0.72, vUv.y + flameNoise * 0.25));
        col = mix(col, uCoreColor, smoothstep(0.58, 0.96, vUv.y + shockDiamonds * 0.5 + flameNoise * 0.15));
        col += vec3(1.0, 0.97, 0.9) * shockDiamonds * 0.65;

        gl_FragColor = vec4(col, clamp(alpha, 0.0, 1.0));
      }
    `

    const flameUniforms = {
      uTime: { value: 0 },
      uOpacity: { value: 0 },
      uCoreColor: { value: new THREE.Color(0xfff7e6) },
      uMidColor: { value: new THREE.Color(0xff6b2b) },
      uOuterColor: { value: new THREE.Color(0xb91c1c) },
    }

    const outerFlameUniforms = {
      uTime: { value: 0 },
      uOpacity: { value: 0 },
      uCoreColor: { value: new THREE.Color(0xffedd5) },
      uMidColor: { value: new THREE.Color(0xe8452c) },
      uOuterColor: { value: new THREE.Color(0x7c2d12) },
    }

    const flameMat = new THREE.ShaderMaterial({
      uniforms: flameUniforms,
      vertexShader: flameVertexShader,
      fragmentShader: flameFragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    })
    const flameMesh = new THREE.Mesh(new THREE.CylinderGeometry(1.45, 0.22, 13, 40, 28, true), flameMat)
    flameMesh.position.y = -12.1 - 6.5
    rocketGroup.add(flameMesh)

    const outerFlameMat = new THREE.ShaderMaterial({
      uniforms: outerFlameUniforms,
      vertexShader: flameVertexShader,
      fragmentShader: flameFragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    })
    const outerFlameMesh = new THREE.Mesh(new THREE.CylinderGeometry(2.05, 0.65, 17, 40, 28, true), outerFlameMat)
    outerFlameMesh.position.y = -12.1 - 8.5
    rocketGroup.add(outerFlameMesh)

    // Incandescent Nozzle Throat Glow
    const nozzleGlowMat = new THREE.MeshBasicMaterial({
      color: 0xffedd5,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    })
    const nozzleGlowMesh = new THREE.Mesh(new THREE.CircleGeometry(1.4, 32), nozzleGlowMat)
    nozzleGlowMesh.rotation.x = Math.PI / 2
    nozzleGlowMesh.position.y = -11.4
    rocketGroup.add(nozzleGlowMesh)

    // 220 Live Exhaust Plume Sparks & Plasma Particles
    const exhaustCount = 220
    const exhaustGeo = new THREE.BufferGeometry()
    const exhaustPos = new Float32Array(exhaustCount * 3)
    const exhaustVel = new Float32Array(exhaustCount * 3)
    for (let i = 0; i < exhaustCount; i++) {
      const a = Math.random() * Math.PI * 2
      const r = Math.random() * 1.2
      exhaustPos[i * 3] = Math.cos(a) * r
      exhaustPos[i * 3 + 1] = -12.2 - Math.random() * 18
      exhaustPos[i * 3 + 2] = Math.sin(a) * r
      exhaustVel[i * 3] = (Math.random() - 0.5) * 4.5
      exhaustVel[i * 3 + 1] = -(18 + Math.random() * 24)
      exhaustVel[i * 3 + 2] = (Math.random() - 0.5) * 4.5
    }
    exhaustGeo.setAttribute('position', new THREE.BufferAttribute(exhaustPos, 3))
    const exhaustMat = new THREE.PointsMaterial({
      size: 1.65,
      map: createRoundStarTexture(),
      color: 0xff9e66,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
    const exhaustPoints = new THREE.Points(exhaustGeo, exhaustMat)
    rocketGroup.add(exhaustPoints)

    // =======================================================================
    // 2. REALISTIC DAYTIME EARTH ENVIRONMENT (No Giant Balls! No Toy Cones!)
    // =======================================================================
    const earthSceneGroup = new THREE.Group()
    scene.add(earthSceneGroup)

    // A. 360-Degree Panoramic Photographic Backdrop (Real Mountains, Real Sky, Real Pine Forest)
    const earthPanoramaGeo = new THREE.CylinderGeometry(300, 300, 160, 64, 1, true)
    const earthPanoramaMat = new THREE.MeshBasicMaterial({
      map: createEarthPanoramicTexture(),
      side: THREE.BackSide,
    })
    const earthPanoramaMesh = new THREE.Mesh(earthPanoramaGeo, earthPanoramaMat)
    earthPanoramaMesh.position.y = 60
    earthSceneGroup.add(earthPanoramaMesh)

    // B. Concrete Launch Facility Apron
    const groundMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(600, 600),
      new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.9, metalness: 0.1 })
    )
    groundMesh.rotation.x = -Math.PI / 2
    groundMesh.position.y = -2
    groundMesh.receiveShadow = true
    earthSceneGroup.add(groundMesh)

    // C. Heavy Octagonal Launch Pad Deck
    const deckMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(15, 17, 2.2, 8),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8, metalness: 0.3 })
    )
    deckMesh.position.y = -0.9
    deckMesh.receiveShadow = true
    earthSceneGroup.add(deckMesh)

    // Safety Hazard Perimeter Strip
    const hazardRing = new THREE.Mesh(
      new THREE.RingGeometry(13.5, 14.8, 32),
      new THREE.MeshBasicMaterial({ color: 0xe8452c, side: THREE.DoubleSide })
    )
    hazardRing.rotation.x = -Math.PI / 2
    hazardRing.position.y = 0.22
    earthSceneGroup.add(hazardRing)

    // D. Realistic Multi-Tiered Aerospace Gantry Service Tower
    const towerGroup = new THREE.Group()
    towerGroup.position.set(8.5, 0, 0)
    earthSceneGroup.add(towerGroup)

    const steelMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.86, roughness: 0.28 })
    const towerRedMat = new THREE.MeshStandardMaterial({ color: 0xe8452c, metalness: 0.65, roughness: 0.35 })
    const towerWhiteMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.6, roughness: 0.35 })
    const darkDeckMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.7, roughness: 0.45 })

    // Concrete Foundation Pedestal
    const towerBase = new THREE.Mesh(new THREE.BoxGeometry(5.6, 2.4, 5.6), darkDeckMat)
    towerBase.position.y = -0.8
    towerBase.receiveShadow = true
    towerGroup.add(towerBase)

    // 4 Solid Steel Corner Columns
    const colGeo = new THREE.CylinderGeometry(0.24, 0.28, 36, 12)
    const colOffsets = [
      [-1.7, -1.7],
      [1.7, -1.7],
      [-1.7, 1.7],
      [1.7, 1.7],
    ]
    colOffsets.forEach(([cx, cz]) => {
      const col = new THREE.Mesh(colGeo, steelMat)
      col.position.set(cx, 18, cz)
      col.castShadow = true
      towerGroup.add(col)
    })

    // 9 Service Deck Platforms & Red/White Aviation Safety Bands
    const deckGeo = new THREE.BoxGeometry(3.8, 0.35, 3.8)
    const braceGeo = new THREE.CylinderGeometry(0.07, 0.07, 5.1, 8)
    for (let tier = 0; tier < 9; tier++) {
      const ty = tier * 4 + 2
      const bandMat = tier % 2 === 0 ? towerRedMat : towerWhiteMat
      const deck = new THREE.Mesh(deckGeo, bandMat)
      deck.position.y = ty
      towerGroup.add(deck)

      // Diagonal Steel Cross-Braces on Front, Back, Left, Right Faces
      if (tier < 8) {
        const midY = ty + 2
        const bFront = new THREE.Mesh(braceGeo, steelMat)
        bFront.position.set(0, midY, 1.7)
        bFront.rotation.z = tier % 2 === 0 ? 0.68 : -0.68
        towerGroup.add(bFront)

        const bBack = new THREE.Mesh(braceGeo, steelMat)
        bBack.position.set(0, midY, -1.7)
        bBack.rotation.z = tier % 2 === 0 ? -0.68 : 0.68
        towerGroup.add(bBack)

        const bLeft = new THREE.Mesh(braceGeo, steelMat)
        bLeft.position.set(-1.7, midY, 0)
        bLeft.rotation.x = tier % 2 === 0 ? 0.68 : -0.68
        towerGroup.add(bLeft)

        const bRight = new THREE.Mesh(braceGeo, steelMat)
        bRight.position.set(1.7, midY, 0)
        bRight.rotation.x = tier % 2 === 0 ? -0.68 : 0.68
        towerGroup.add(bRight)
      }
    }

    // Central Elevator Shaft & Stainless Cryogenic Umbilical Pipe
    const elevatorShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 35, 16), darkDeckMat)
    elevatorShaft.position.set(0, 17.5, 0)
    towerGroup.add(elevatorShaft)

    const cryoPipe = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 35, 10), towerWhiteMat)
    cryoPipe.position.set(-0.9, 17.5, 0.8)
    towerGroup.add(cryoPipe)

    // Upper Crew Access Bridge Arm (swings away on liftoff)
    const armTop = new THREE.Group()
    armTop.position.set(-1.7, 20, 0)
    const armBridge = new THREE.Mesh(new THREE.BoxGeometry(5.4, 0.75, 1.1), steelMat)
    armBridge.position.set(-2.7, 0, 0)
    armTop.add(armBridge)
    const armStripe = new THREE.Mesh(new THREE.BoxGeometry(5.4, 0.18, 1.16), towerRedMat)
    armStripe.position.set(-2.7, 0.35, 0)
    armTop.add(armStripe)
    towerGroup.add(armTop)

    // Lower Cryogenic Umbilical Arm
    const armMid = new THREE.Mesh(new THREE.BoxGeometry(4.6, 0.45, 0.55), steelMat)
    armMid.position.set(-3.8, 12, 0)
    towerGroup.add(armMid)

    // Top Lightning Arrestor Mast & Red Aviation Beacon Light
    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.16, 5.5, 10), towerWhiteMat)
    mast.position.set(0, 38.5, 0)
    towerGroup.add(mast)

    const beaconLight = new THREE.Mesh(
      new THREE.SphereGeometry(0.35, 12, 12),
      new THREE.MeshBasicMaterial({ color: 0xff2200 })
    )
    beaconLight.position.set(0, 41.3, 0)
    towerGroup.add(beaconLight)

    // =======================================================================
    // 3. 3D ROUND STARS (Soft Circular Glow, No Square Pixels)
    // =======================================================================
    const roundStarTex = createRoundStarTexture()
    const starCount = 2000
    const starGeo = new THREE.BufferGeometry()
    const starPos = new Float32Array(starCount * 3)

    for (let i = 0; i < starCount; i++) {
      starPos[i * 3] = (Math.random() - 0.5) * 750
      starPos[i * 3 + 1] = (Math.random() - 0.5) * 750
      starPos[i * 3 + 2] = -Math.random() * 950 - 10
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3))
    const starMat = new THREE.PointsMaterial({
      map: roundStarTex,
      size: 5.8,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
    const starPoints = new THREE.Points(starGeo, starMat)
    scene.add(starPoints)

    // =======================================================================
    // 4. 3D MOON (Scaled & Framed Beautifully in Line of Sight of Window)
    // =======================================================================
    const moonGeo = new THREE.SphereGeometry(8.5, 64, 64)
    const moonMat = new THREE.MeshStandardMaterial({
      map: createMoonTexture(),
      bumpMap: createMoonBumpTexture(),
      bumpScale: 0.65,
      roughness: 0.88,
      metalness: 0.05,
    })
    const moonMesh = new THREE.Mesh(moonGeo, moonMat)
    moonMesh.position.set(0, 0, -34)
    moonMesh.visible = false
    scene.add(moonMesh)

    // =======================================================================
    // 5. 3D MARS (Photorealistic NASA Geological Features & Canyon Relief)
    // =======================================================================
    const marsGeo = new THREE.SphereGeometry(28, 64, 64)
    const marsMat = new THREE.MeshStandardMaterial({
      map: createMarsTexture(),
      bumpMap: createMarsBumpTexture(),
      bumpScale: 0.12,
      roughness: 0.78,
      metalness: 0.08,
    })
    const marsMesh = new THREE.Mesh(marsGeo, marsMat)
    marsMesh.position.set(0, 0, -340)
    marsMesh.visible = false
    scene.add(marsMesh)

    const marsAtmosphere = new THREE.Mesh(
      new THREE.SphereGeometry(28.8, 48, 48),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.22, side: THREE.BackSide })
    )
    marsMesh.add(marsAtmosphere)

    // =======================================================================
    // 6. REALISTIC 3D MARS CANYON ENVIRONMENT (Pad at Ground Level)
    // =======================================================================
    const marsEnvironment = new THREE.Group()
    marsEnvironment.position.set(0, 0, 0)
    marsEnvironment.visible = false
    scene.add(marsEnvironment)

    // A. 360-Degree Panoramic Photographic Martian Canyon Backdrop
    const marsPanoramaGeo = new THREE.CylinderGeometry(320, 320, 180, 64, 1, true)
    const marsPanoramaMat = new THREE.MeshBasicMaterial({
      map: createMarsPanoramicTexture(),
      side: THREE.BackSide,
    })
    const marsPanoramaMesh = new THREE.Mesh(marsPanoramaGeo, marsPanoramaMat)
    marsPanoramaMesh.position.y = 80
    marsEnvironment.add(marsPanoramaMesh)

    // B. Red Martian Regolith Ground Plain
    const marsGroundGeo = new THREE.PlaneGeometry(800, 800)
    const marsGroundMat = new THREE.MeshStandardMaterial({ color: 0x852e18, roughness: 0.95, metalness: 0.08 })
    const marsGroundMesh = new THREE.Mesh(marsGroundGeo, marsGroundMat)
    marsGroundMesh.rotation.x = -Math.PI / 2
    marsGroundMesh.position.y = 0
    marsEnvironment.add(marsGroundMesh)

    // C. 50+ Real Martian Basalt & Rust Rock Boulders Scattered Around
    const boulderMat = new THREE.MeshStandardMaterial({ color: 0x3d0b04, roughness: 0.92 })
    for (let i = 0; i < 50; i++) {
      const angle = (i / 50) * Math.PI * 2
      const dist = 22 + Math.random() * 80
      const bx = Math.cos(angle) * dist
      const bz = Math.sin(angle) * dist
      const boulder = new THREE.Mesh(new THREE.DodecahedronGeometry(1.6 + Math.random() * 3.2, 0), boulderMat)
      boulder.position.set(bx, 1.2, bz)
      boulder.rotation.set(Math.random(), Math.random(), Math.random())
      marsEnvironment.add(boulder)
    }

    // D. High-Tech Jezero Base Landing Pad
    const padDeck = new THREE.Mesh(
      new THREE.CylinderGeometry(15, 17, 1.8, 8),
      new THREE.MeshStandardMaterial({ color: 0x1e2638, roughness: 0.7, metalness: 0.4 })
    )
    padDeck.position.y = 0.9
    marsEnvironment.add(padDeck)

    const padTargetRing = new THREE.Mesh(
      new THREE.RingGeometry(5, 13, 32),
      new THREE.MeshBasicMaterial({ color: 0x22d3ee, side: THREE.DoubleSide })
    )
    padTargetRing.rotation.x = -Math.PI / 2
    padTargetRing.position.y = 1.85
    marsEnvironment.add(padTargetRing)

    // Pad Perimeter Cyan Glowing Beacons
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2
      const bx = Math.cos(angle) * 14
      const bz = Math.sin(angle) * 14
      const beacon = new THREE.Mesh(
        new THREE.CylinderGeometry(0.3, 0.4, 2.4, 8),
        new THREE.MeshStandardMaterial({ color: 0x22d3ee, emissive: 0x22d3ee, emissiveIntensity: 1 })
      )
      beacon.position.set(bx, 2.1, bz)
      marsEnvironment.add(beacon)
    }

    // Resize Handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', handleResize)

    // =======================================================================
    // 360-Degree Interactive Mouse Hover & Touch Drag Look-Around
    // (Explore Earth mountains/sky & Mars canyons/boulders in full 360!)
    // =======================================================================
    const lookState = {
      yaw: 0,
      pitch: 0,
      targetYaw: 0,
      targetPitch: 0,
      isPointerDown: false,
      lastPointerX: 0,
      lastPointerY: 0,
    }

    const handlePointerMove = (e: PointerEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1
      const ny = (e.clientY / window.innerHeight) * 2 - 1

      if (lookState.isPointerDown) {
        // Drag swipe rotation (desktop mouse drag & mobile touch swipe)
        const dx = e.clientX - lookState.lastPointerX
        const dy = e.clientY - lookState.lastPointerY
        lookState.targetYaw += dx * 0.005
        lookState.targetPitch = Math.max(-0.55, Math.min(0.65, lookState.targetPitch - dy * 0.005))
        lookState.lastPointerX = e.clientX
        lookState.lastPointerY = e.clientY
      } else {
        // Natural mouse hover panning
        lookState.targetYaw = nx * 0.95
        lookState.targetPitch = -ny * 0.45
      }
    }

    const handlePointerDown = (e: PointerEvent) => {
      lookState.isPointerDown = true
      lookState.lastPointerX = e.clientX
      lookState.lastPointerY = e.clientY
    }

    const handlePointerUp = () => {
      lookState.isPointerDown = false
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    window.addEventListener('pointerdown', handlePointerDown, { passive: true })
    window.addEventListener('pointerup', handlePointerUp, { passive: true })

    // =======================================================================
    // 7. REAL-TIME 60FPS ANIMATION LOOP (Synchronized via flightProgressRef)
    // =======================================================================
    const clock = new THREE.Clock()

    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate)
      const delta = clock.getDelta()
      const time = clock.getElapsedTime()
      const curStage = stageRef.current
      const currentFlightP = flightProgressRef.current // Real-time 0.0 -> 1.0

      // Smooth look-around damping
      lookState.yaw = THREE.MathUtils.lerp(lookState.yaw, lookState.targetYaw, delta * 3.5)
      lookState.pitch = THREE.MathUtils.lerp(lookState.pitch, lookState.targetPitch, delta * 3.5)
      const yaw = lookState.yaw
      const pitch = THREE.MathUtils.clamp(lookState.pitch, -0.55, 0.65)

      moonMesh.rotation.y += 0.003
      marsMesh.rotation.y += 0.002

      if (curStage === 'earth_pad') {
        // DAYTIME EARTH LAUNCHPAD - Interactive 360 Mouse/Touch Look-Around!
        currentBg.copy(daySkyColor)
        scene.background = currentBg
        expFog.color.copy(daySkyColor)
        expFog.density = 0.0012
        starMat.opacity = 0 // Invisible in daytime sunlight

        rocketGroup.position.set(0, 10, 0)
        rocketGroup.rotation.set(0, 0, 0)
        flameUniforms.uOpacity.value = 0
        outerFlameUniforms.uOpacity.value = 0
        nozzleGlowMat.opacity = 0
        exhaustMat.opacity = 0
        engineLight.intensity = 0

        earthSceneGroup.visible = true
        earthSceneGroup.position.y = 0
        moonMesh.visible = false
        marsMesh.visible = false
        marsEnvironment.visible = false

        // Realistic camera angle panning smoothly with mouse/drag around the pad & mountains
        const isMobilePad = typeof window !== 'undefined' && window.innerWidth < 768
        const earthDist = isMobilePad ? 68 : 52
        const baseAngle = Math.sin(time * 0.12) * 0.08
        const totalAngle = baseAngle + yaw
        camera.position.x = Math.sin(totalAngle) * earthDist
        camera.position.z = Math.cos(totalAngle) * earthDist
        camera.position.y = (isMobilePad ? 14 : 11) + pitch * 14
        camera.lookAt(0, 14 + pitch * 7, 0)
      } else if (curStage === 'earth_ascent') {
        // LIFTOFF & TRACKING CAMERA INTO COCKPIT WINDOW
        rocketGroup.position.y += delta * 36

        flameUniforms.uTime.value = time
        outerFlameUniforms.uTime.value = time + 1.37
        flameUniforms.uOpacity.value = 0.96
        outerFlameUniforms.uOpacity.value = 0.78
        flameUniforms.uCoreColor.value.setHex(0xfff7e6)
        flameUniforms.uMidColor.value.setHex(0xff6b2b)
        flameUniforms.uOuterColor.value.setHex(0xb91c1c)
        outerFlameUniforms.uCoreColor.value.setHex(0xffedd5)
        outerFlameUniforms.uMidColor.value.setHex(0xe8452c)
        outerFlameUniforms.uOuterColor.value.setHex(0x7c2d12)
        nozzleGlowMat.color.setHex(0xffedd5)
        nozzleGlowMat.opacity = 0.92
        flameMesh.scale.set(1 + Math.sin(time * 38) * 0.06, 1 + Math.cos(time * 42) * 0.12, 1 + Math.sin(time * 38) * 0.06)
        outerFlameMesh.scale.set(1 + Math.cos(time * 30) * 0.08, 1 + Math.sin(time * 34) * 0.14, 1 + Math.cos(time * 30) * 0.08)

        // Update 3D exhaust sparks & plasma particles
        exhaustMat.color.setHex(0xff9e66)
        exhaustMat.opacity = 0.85
        const exArr = exhaustGeo.attributes.position.array as Float32Array
        for (let i = 0; i < exhaustCount; i++) {
          exArr[i * 3] += exhaustVel[i * 3] * delta
          exArr[i * 3 + 1] += exhaustVel[i * 3 + 1] * delta
          exArr[i * 3 + 2] += exhaustVel[i * 3 + 2] * delta
          if (exArr[i * 3 + 1] < -32) {
            const a = Math.random() * Math.PI * 2
            const r = Math.random() * 1.1
            exArr[i * 3] = Math.cos(a) * r
            exArr[i * 3 + 1] = -12.2 - Math.random() * 1.5
            exArr[i * 3 + 2] = Math.sin(a) * r
          }
        }
        exhaustGeo.attributes.position.needsUpdate = true

        engineLight.color.setHex(0xff6b2b)
        engineLight.position.copy(rocketGroup.position).add(new THREE.Vector3(0, -12, 0))
        engineLight.intensity = 9 + Math.sin(time * 45) * 2

        armTop.rotation.y = Math.min(Math.PI * 0.45, armTop.rotation.y + delta * 1.5)

        // DAYTIME SKY GRADUALLY TRANSITIONS TO SPACE BLACK AS ROCKET CLIMBS
        const spaceLerp = Math.min(1, (rocketGroup.position.y - 10) / 70)
        currentBg.lerpColors(daySkyColor, spaceBlack, spaceLerp)
        scene.background = currentBg
        expFog.color.lerpColors(daySkyColor, spaceBlack, spaceLerp)
        expFog.density = 0.0012 * (1 - spaceLerp) + 0.0006 * spaceLerp
        starMat.opacity = spaceLerp * 0.9 // Stars appear in space

        // CAMERA LIFTS OFF WITH ROCKET AND SMOOTHLY ENTERS COCKPIT WINDOW!
        const targetCockpitY = rocketGroup.position.y + 6.2
        const targetCockpitZ = rocketGroup.position.z + 2.4

        camera.position.x = THREE.MathUtils.lerp(camera.position.x, 0, delta * 3.5)
        camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetCockpitY, delta * 5.5)
        camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetCockpitZ + 1.1, delta * 3.2)
        camera.lookAt(0, targetCockpitY, targetCockpitZ)

        earthSceneGroup.position.y -= delta * 18
      } else if (curStage === 'cabin_porthole') {
        // INSIDE CABIN - 3D MOON GUARANTEED VISIBLE SLIDING ACROSS WINDOW!
        currentBg.copy(spaceBlack)
        scene.background = currentBg
        expFog.color.copy(spaceBlack)
        expFog.density = 0.0006
        starMat.opacity = 0.85

        earthSceneGroup.visible = false
        marsMesh.visible = false
        marsEnvironment.visible = false
        rocketGroup.position.set(0, -100, 0)

        moonMesh.visible = true
        // Synchronized real-time stage progress (0.0 to 1.0)
        const stageProgress = Math.min(1, Math.max(0, (currentFlightP - 0.24) / (0.51 - 0.24)))

        // Slingshot directly across the center of the porthole window!
        // As rocket passes by it, moon size gets shorter/smaller as the ship accelerates away into deep space!
        const moonScale = 1.75 - stageProgress * 1.15 // Starts close and grand (1.75x), recedes into distance (0.60x)
        moonMesh.scale.set(moonScale, moonScale, moonScale)

        moonMesh.position.x = 22 - stageProgress * 44 // Smooth transit right to left
        moonMesh.position.y = 1.2 - stageProgress * 2.4
        moonMesh.position.z = -32 - stageProgress * 38 // Recedes from -32 to -70 into deep space!

        camera.position.set(0, 0, 8)
        camera.lookAt(0, 0, -40)
      } else if (curStage === 'cabin_front') {
        // INSIDE CABIN - FRONT RECTANGULAR WINDOW
        // 1. STARS FLY BACKWARDS PAST CAMERA AT HYPER SPEED!
        // 2. MARS SIZE GROWS DRAMATICALLY RIGHT INTO CROSSHAIRS!
        currentBg.copy(spaceBlack)
        scene.background = currentBg
        expFog.color.copy(spaceBlack)
        moonMesh.visible = false
        earthSceneGroup.visible = false
        marsEnvironment.visible = false
        rocketGroup.position.set(0, -100, 0)

        // Stars fly backwards past the camera at hyper speed!
        const positions = starGeo.attributes.position.array as Float32Array
        for (let i = 0; i < starCount; i++) {
          positions[i * 3 + 2] += delta * 820 // Fast backwards motion past camera
          if (positions[i * 3 + 2] > 25) {
            positions[i * 3 + 2] = -950
            positions[i * 3] = (Math.random() - 0.5) * 750
            positions[i * 3 + 1] = (Math.random() - 0.5) * 750
          }
        }
        starGeo.attributes.position.needsUpdate = true

        // MARS GROWS HUGE AS THE ROCKET HURTLES TOWARDS IT!
        marsMesh.visible = true
        const warpProgress = Math.min(1, Math.max(0, (currentFlightP - 0.51) / (0.78 - 0.51)))
        marsMesh.position.set(0, 0, -340 + warpProgress * 260) // Moves from -340 to -80
        const marsScale = 0.35 + warpProgress * 2.85 // Grows from 0.35x to 3.2x!
        marsMesh.scale.set(marsScale, marsScale, marsScale)

        camera.position.set(0, 0, 10)
        camera.lookAt(0, 0, -90)
      } else if (curStage === 'mars_exterior') {
        // 3D MARS CANYONS & DESCENT
        currentBg.copy(marsSkyColor)
        scene.background = currentBg
        expFog.color.copy(marsSkyColor)
        expFog.density = 0.0016
        starMat.opacity = 0

        moonMesh.visible = false
        marsMesh.visible = false
        marsEnvironment.visible = true

        // Rocket descends smoothly toward Jezero pad
        const descentProgress = Math.min(1, Math.max(0, (currentFlightP - 0.78) / (0.93 - 0.78)))
        const startY = 56
        const landY = 14.0
        rocketGroup.position.set(0, startY - descentProgress * (startY - landY), 0)

        // Methalox Retro-Thrusters: Realistic animated plasma core + cyan Mach shock diamonds + particle wake
        flameUniforms.uTime.value = time
        outerFlameUniforms.uTime.value = time + 1.37
        flameUniforms.uOpacity.value = 0.94
        outerFlameUniforms.uOpacity.value = 0.72
        flameUniforms.uCoreColor.value.setHex(0xe0f7ff)
        flameUniforms.uMidColor.value.setHex(0x22d3ee)
        flameUniforms.uOuterColor.value.setHex(0x1d4ed8)
        outerFlameUniforms.uCoreColor.value.setHex(0xbae6fd)
        outerFlameUniforms.uMidColor.value.setHex(0x0284c7)
        outerFlameUniforms.uOuterColor.value.setHex(0x1e3a8a)
        nozzleGlowMat.color.setHex(0xe0f7ff)
        nozzleGlowMat.opacity = 0.88
        flameMesh.scale.set(1 + Math.sin(time * 40) * 0.06, 0.85 + Math.cos(time * 44) * 0.1, 1 + Math.sin(time * 40) * 0.06)
        outerFlameMesh.scale.set(1 + Math.cos(time * 32) * 0.08, 0.82 + Math.sin(time * 36) * 0.12, 1 + Math.cos(time * 32) * 0.08)

        exhaustMat.color.setHex(0x38bdf8)
        exhaustMat.opacity = 0.82
        const exArrM = exhaustGeo.attributes.position.array as Float32Array
        for (let i = 0; i < exhaustCount; i++) {
          exArrM[i * 3] += exhaustVel[i * 3] * delta
          exArrM[i * 3 + 1] += exhaustVel[i * 3 + 1] * delta
          exArrM[i * 3 + 2] += exhaustVel[i * 3 + 2] * delta
          if (exArrM[i * 3 + 1] < -28) {
            const a = Math.random() * Math.PI * 2
            const r = Math.random() * 1.1
            exArrM[i * 3] = Math.cos(a) * r
            exArrM[i * 3 + 1] = -12.2 - Math.random() * 1.5
            exArrM[i * 3 + 2] = Math.sin(a) * r
          }
        }
        exhaustGeo.attributes.position.needsUpdate = true

        engineLight.color.setHex(0x22d3ee)
        engineLight.position.copy(rocketGroup.position).add(new THREE.Vector3(0, -12, 0))
        engineLight.intensity = 7 + Math.sin(time * 40) * 1.5

        // Chase camera tracking the descending rocket over canyon terrain
        camera.position.set(0, rocketGroup.position.y + 12, rocketGroup.position.z + 44)
        camera.lookAt(rocketGroup.position.x, rocketGroup.position.y - 4, rocketGroup.position.z)
      } else if (curStage === 'mars_touchdown') {
        // TOUCHDOWN ON JEZERO BASE - 100% PHYSICAL CONTACT WITH THE PAD DECK!
        currentBg.copy(marsSkyColor)
        scene.background = currentBg
        expFog.color.copy(marsSkyColor)

        // Rocket firmly planted on top of the pad target deck (y = 14.0 puts nozzle & fins flush on pad surface y = 1.8)
        rocketGroup.position.set(0, 14.0, 0)
        flameUniforms.uOpacity.value = 0
        outerFlameUniforms.uOpacity.value = 0
        nozzleGlowMat.opacity = 0
        exhaustMat.opacity = 0
        engineLight.intensity = 0

        // Camera smoothly pans around the landed rocket and 360-degree Martian canyon with mouse/drag
        const isMobileMars = typeof window !== 'undefined' && window.innerWidth < 768
        const marsDist = isMobileMars ? 56 : 44
        const baseAngle = Math.sin(time * 0.15) * 0.06
        const totalAngle = baseAngle + yaw
        camera.position.x = Math.sin(totalAngle) * marsDist
        camera.position.z = Math.cos(totalAngle) * marsDist
        camera.position.y = (isMobileMars ? 12.5 : 8.5) + pitch * 12
        camera.lookAt(0, 14.0 + pitch * 6, 0)
      }

      renderer.render(scene, camera)
    }

    animate()

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('pointerup', handlePointerUp)
      renderer.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [dismissed])

  // =========================================================================
  // LAUNCH SEQUENCER (~28.4s Pacing)
  // =========================================================================
  const handleLaunch = () => {
    if (isLaunched) return
    setIsLaunched(true)
    setStage('earth_ascent')
    playSoundEffect('ignite')

    const FLIGHT_TOTAL_MS = 28400
    const startTimestamp = performance.now()

    const stepAnimation = (currentTime: number) => {
      const elapsed = currentTime - startTimestamp
      const p = Math.min(1, elapsed / FLIGHT_TOTAL_MS)

      flightProgressRef.current = p
      setProgress(Math.round(p * 100))

      if (p < 0.24) {
        setStage('earth_ascent')
        setVelocityKmS(Number((p * 45).toFixed(1)))
        setAltitudeKm(Math.round(p * 550))
        setTargetDistanceMkm(Number((225.0 - p * 20).toFixed(1)))
      } else if (p < 0.51) {
        if (stage !== 'cabin_porthole') playSoundEffect('cabin')
        setStage('cabin_porthole')
        setVelocityKmS(Number((11.2 + (p - 0.24) * 35).toFixed(1)))
        setAltitudeKm(384400)
        setTargetDistanceMkm(Number((215.0 - (p - 0.24) * 120).toFixed(1)))
      } else if (p < 0.78) {
        if (stage !== 'cabin_front') playSoundEffect('warp')
        setStage('cabin_front')
        setVelocityKmS(Number((38.0 - (p - 0.51) * 22).toFixed(1)))
        setAltitudeKm(Math.round(25000 - (p - 0.51) * 70000))
        setTargetDistanceMkm(Number((42.0 - (p - 0.51) * 140).toFixed(1)))
      } else if (p < 0.93) {
        if (stage !== 'mars_exterior') playSoundEffect('plasma')
        setStage('mars_exterior')
        setVelocityKmS(Number((4.8 - (p - 0.78) * 28).toFixed(1)))
        setAltitudeKm(Math.max(0, Math.round(650 - (p - 0.78) * 4000)))
        setTargetDistanceMkm(0.1)
      } else {
        if (stage !== 'mars_touchdown') playSoundEffect('touchdown')
        setStage('mars_touchdown')
        setVelocityKmS(0)
        setAltitudeKm(0)
        setTargetDistanceMkm(0)
      }

      if (p < 1) {
        requestAnimationFrame(stepAnimation)
      } else {
        // STAY on mars_touchdown indefinitely!
        // DO NOT show the website until user clicks "STEP ONTO MARS & VISIT THE WEBSITE"!
        setStage('mars_touchdown')
      }
    }

    requestAnimationFrame(stepAnimation)
  }

  const finishFlight = () => {
    try {
      sessionStorage.setItem('marsment_rocket_launched', 'true')
    } catch {
      // ignore
    }
    document.body.style.overflow = ''
    document.documentElement.style.overflow = ''
    setDismissed(true)
    if (onComplete) onComplete()
  }

  const handleSkip = () => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    finishFlight()
  }

  if (dismissed) return null

  return (
    <div
      className={`rocket-cinematic-screen stage-${stage}`}
      role="dialog"
      aria-modal="true"
      aria-label="Marsment 3D Rocket Launch Experience"
    >
      {/* 3D WebGL Canvas */}
      <div ref={containerRef} className="threejs-canvas-host" />

      {/* Stage 2: Cabin Round Window Porthole Fullscreen Mask with Authentic Spaceship Interior */}
      {stage === 'cabin_porthole' && (
        <div className="cabin-porthole-fullscreen">
          {/* Overhead Spacecraft Structure: Conduit Cables & Ceiling Truss */}
          <div className="interior-ceiling-truss">
            <div className="conduit-bundle">
              <span className="conduit-line line-cyan" />
              <span className="conduit-line line-orange" />
              <span className="conduit-line line-gray" />
            </div>
            <div className="overhead-dome-light" />
            <div className="bulkhead-label">
              <span>STARSHIP HABITATION COMPARTMENT · DECK 02</span>
            </div>
          </div>

          {/* Left Wall: Astronaut EVA Suit & Safety Gear Locker Bay */}
          <aside className="cabin-station-panel station-left">
            <div className="panel-header">
              <span className="panel-status-dot status-green" />
              <span className="panel-title">EVA SUIT &amp; SAFETY BAY</span>
            </div>

            {/* Photorealistic 3D-Shaded Docked Astronaut Suit & Safety Equipment Bay */}
            <div className="eva-suit-locker-bay">
              <svg viewBox="0 0 200 175" className="eva-suit-svg" aria-hidden="true">
                <defs>
                  {/* 3D Locker Interior & Volumetric Spotlight */}
                  <linearGradient id="lockerBgGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0b1324" />
                    <stop offset="55%" stopColor="#060b16" />
                    <stop offset="100%" stopColor="#03060d" />
                  </linearGradient>
                  <linearGradient id="lockerLightCone" x1="0.5" y1="0" x2="0.5" y2="1">
                    <stop offset="0%" stopColor="rgba(56, 189, 248, 0.34)" />
                    <stop offset="50%" stopColor="rgba(56, 189, 248, 0.08)" />
                    <stop offset="100%" stopColor="rgba(56, 189, 248, 0)" />
                  </linearGradient>

                  {/* 3D Cylindrical Suit Shading */}
                  <linearGradient id="suitShell3D" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#94a3b8" />
                    <stop offset="28%" stopColor="#f8fafc" />
                    <stop offset="58%" stopColor="#e2e8f0" />
                    <stop offset="85%" stopColor="#64748b" />
                    <stop offset="100%" stopColor="#334155" />
                  </linearGradient>
                  <linearGradient id="suitArm3D" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#64748b" />
                    <stop offset="35%" stopColor="#f1f5f9" />
                    <stop offset="80%" stopColor="#94a3b8" />
                    <stop offset="100%" stopColor="#334155" />
                  </linearGradient>
                  <radialGradient id="helmetShell3D" cx="38%" cy="32%" r="65%">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="45%" stopColor="#cbd5e1" />
                    <stop offset="80%" stopColor="#475569" />
                    <stop offset="100%" stopColor="#1e293b" />
                  </radialGradient>
                  <radialGradient id="goldVisor3D" cx="35%" cy="30%" r="70%">
                    <stop offset="0%" stopColor="#fef08a" />
                    <stop offset="28%" stopColor="#f59e0b" />
                    <stop offset="62%" stopColor="#b45309" />
                    <stop offset="88%" stopColor="#451a03" />
                    <stop offset="100%" stopColor="#1c0a00" />
                  </radialGradient>

                  {/* 3D O2 Cylinder Shading */}
                  <linearGradient id="o2Cyl3D" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#083344" />
                    <stop offset="25%" stopColor="#22d3ee" />
                    <stop offset="42%" stopColor="#a5f3fc" />
                    <stop offset="65%" stopColor="#0e7490" />
                    <stop offset="100%" stopColor="#042f2e" />
                  </linearGradient>
                  <linearGradient id="medCase3D" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ef4444" />
                    <stop offset="25%" stopColor="#b91c1c" />
                    <stop offset="100%" stopColor="#450a0a" />
                  </linearGradient>
                  <linearGradient id="glassGlare" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="rgba(255,255,255,0.12)" />
                    <stop offset="35%" stopColor="rgba(255,255,255,0.02)" />
                    <stop offset="50%" stopColor="rgba(255,255,255,0.08)" />
                    <stop offset="70%" stopColor="rgba(255,255,255,0)" />
                  </linearGradient>
                  <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
                    <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#000000" floodOpacity="0.75" />
                  </filter>
                </defs>

                {/* 3D Perspective Locker Interior */}
                <rect x="6" y="4" width="188" height="167" rx="8" fill="url(#lockerBgGrad)" stroke="#334155" strokeWidth="2" />
                {/* 3D Recessed Perspective Wall Bevels */}
                <polygon points="6,4 194,4 182,16 18,16" fill="#1e293b" opacity="0.65" />
                <polygon points="6,171 194,171 182,155 18,155" fill="#0f172a" />
                <line x1="18" y1="155" x2="182" y2="155" stroke="#334155" strokeWidth="1" />

                {/* Overhead LED Light Bar & Volumetric Light Cone */}
                <rect x="44" y="7" width="112" height="4" rx="2" fill="#e0f2fe" />
                <polygon points="44,11 156,11 184,155 16,155" fill="url(#lockerLightCone)" />

                {/* Brushed Titanium Rack Bar & Mounts */}
                <rect x="22" y="21" width="156" height="4" rx="2" fill="#64748b" />
                <rect x="74" y="16" width="6" height="12" rx="1" fill="#475569" />

                {/* Contact Shadows on Locker Floor */}
                <ellipse cx="77" cy="158" rx="34" ry="5" fill="rgba(0,0,0,0.75)" />
                <ellipse cx="152" cy="158" rx="24" ry="4" fill="rgba(0,0,0,0.75)" />

                {/* PLSS Life-Support Backpack Behind Suit */}
                <rect x="49" y="56" width="56" height="58" rx="7" fill="#1e293b" stroke="#475569" strokeWidth="1.5" filter="url(#softShadow)" />

                {/* 3D EVA Suit Legs & Boots */}
                <g filter="url(#softShadow)">
                  <rect x="52" y="114" width="21" height="36" rx="5" fill="url(#suitShell3D)" stroke="#475569" strokeWidth="1" />
                  <rect x="81" y="114" width="21" height="36" rx="5" fill="url(#suitShell3D)" stroke="#475569" strokeWidth="1" />
                  {/* Corrugated Knee Bellows */}
                  <line x1="53" y1="128" x2="72" y2="128" stroke="#64748b" strokeWidth="1.5" />
                  <line x1="53" y1="132" x2="72" y2="132" stroke="#64748b" strokeWidth="1.5" />
                  <line x1="82" y1="128" x2="101" y2="128" stroke="#64748b" strokeWidth="1.5" />
                  <line x1="82" y1="132" x2="101" y2="132" stroke="#64748b" strokeWidth="1.5" />
                  {/* Armored Lunar/Mars Boots */}
                  <path d="M50 146 L74 146 L75 156 L48 156 Z" fill="#334155" stroke="#64748b" strokeWidth="1" />
                  <path d="M80 146 L104 146 L106 156 L79 156 Z" fill="#334155" stroke="#64748b" strokeWidth="1" />
                </g>

                {/* 3D EVA Suit Articulated Arms & Gloves */}
                <g filter="url(#softShadow)">
                  <path d="M48 66 L32 104 L43 108 L54 78 Z" fill="url(#suitArm3D)" stroke="#475569" strokeWidth="1" />
                  <path d="M106 66 L122 104 L111 108 L100 78 Z" fill="url(#suitArm3D)" stroke="#475569" strokeWidth="1" />
                  {/* Wrist Rings & Gloves */}
                  <rect x="31" y="103" width="12" height="4" rx="1" fill="#e8452c" transform="rotate(18 37 105)" />
                  <rect x="111" y="103" width="12" height="4" rx="1" fill="#e8452c" transform="rotate(-18 117 105)" />
                  <circle cx="35" cy="112" r="5.5" fill="#475569" stroke="#94a3b8" strokeWidth="1" />
                  <circle cx="119" cy="112" r="5.5" fill="#475569" stroke="#94a3b8" strokeWidth="1" />
                </g>

                {/* 3D Hard Upper Torso (HUT) */}
                <g filter="url(#softShadow)">
                  <path d="M48 63 Q77 58 106 63 L103 114 Q77 118 51 114 Z" fill="url(#suitShell3D)" stroke="#64748b" strokeWidth="1.2" />
                  {/* Shoulder Armor Trim */}
                  <rect x="47" y="63" width="12" height="6" rx="2" fill="#e8452c" />
                  <rect x="95" y="63" width="12" height="6" rx="2" fill="#e8452c" />
                  {/* Waist Bearing Ring */}
                  <rect x="50" y="110" width="54" height="6" rx="2" fill="#1e293b" stroke="#475569" strokeWidth="1" />

                  {/* 3D Chest Display & Control Module (DCM) */}
                  <rect x="61" y="72" width="32" height="24" rx="4" fill="#0f172a" stroke="#475569" strokeWidth="1.5" />
                  <rect x="64" y="75" width="26" height="10" rx="2" fill="#020617" stroke="#1e293b" strokeWidth="0.8" />
                  <circle cx="69" cy="80" r="2.2" fill="#10b981" />
                  <circle cx="77" cy="80" r="2.2" fill="#22d3ee" />
                  <rect x="82" y="78" width="6" height="4" rx="1" fill="#e8452c" />
                  <rect x="65" y="88" width="24" height="4" rx="1" fill="#334155" />
                </g>

                {/* 3D Spherical Helmet & Reflective Gold-Iridium Visor */}
                <g filter="url(#softShadow)">
                  {/* Neck Locking Collar */}
                  <ellipse cx="77" cy="61" rx="18" ry="5" fill="#e8452c" stroke="#991b1b" strokeWidth="1.2" />
                  <circle cx="77" cy="42" r="20" fill="url(#helmetShell3D)" stroke="#475569" strokeWidth="1.5" />
                  {/* Visor Recess */}
                  <ellipse cx="77" cy="42" rx="15" ry="12" fill="url(#goldVisor3D)" stroke="#0f172a" strokeWidth="1.8" />
                  {/* Crisp Curved Specular Reflection */}
                  <path d="M66 36 Q77 30 88 36" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="2" strokeLinecap="round" />
                  <ellipse cx="70" cy="36" rx="3" ry="1.5" fill="rgba(255,255,255,0.7)" transform="rotate(-20 70 36)" />
                </g>

                {/* Dual 3D Cylindrical O2 Safety Tanks */}
                <g filter="url(#softShadow)">
                  <rect x="132" y="34" width="16" height="64" rx="8" fill="url(#o2Cyl3D)" stroke="#0e7490" strokeWidth="1" />
                  <rect x="154" y="34" width="16" height="64" rx="8" fill="url(#o2Cyl3D)" stroke="#0e7490" strokeWidth="1" />
                  {/* Machined Brass/Titanium Valves */}
                  <rect x="137" y="27" width="6" height="7" rx="1" fill="#94a3b8" />
                  <rect x="159" y="27" width="6" height="7" rx="1" fill="#94a3b8" />
                  <circle cx="140" cy="25" r="3.5" fill="#e8452c" />
                  <circle cx="162" cy="25" r="3.5" fill="#e8452c" />
                  {/* Analog Pressure Gauges */}
                  <circle cx="140" cy="50" r="4.5" fill="#0f172a" stroke="#cbd5e1" strokeWidth="1" />
                  <line x1="140" y1="50" x2="142.5" y2="47.5" stroke="#10b981" strokeWidth="1.2" />
                  <circle cx="162" cy="50" r="4.5" fill="#0f172a" stroke="#cbd5e1" strokeWidth="1" />
                  <line x1="162" y1="50" x2="164.5" y2="47.5" stroke="#10b981" strokeWidth="1.2" />
                  {/* Tank Mounting Brackets */}
                  <rect x="130" y="72" width="42" height="4" rx="1" fill="#334155" />
                </g>

                {/* Coiled 3D Safety Tether & Carabiner */}
                <g filter="url(#softShadow)">
                  <ellipse cx="151" cy="112" rx="14" ry="5" fill="none" stroke="#f59e0b" strokeWidth="3" />
                  <ellipse cx="151" cy="115" rx="12" ry="4" fill="none" stroke="#d97706" strokeWidth="2.5" />
                  <rect x="148" y="102" width="6" height="9" rx="3" fill="none" stroke="#cbd5e1" strokeWidth="1.8" />
                </g>

                {/* 3D Beveled Emergency Med / Thermal Kit */}
                <g filter="url(#softShadow)">
                  <rect x="130" y="128" width="42" height="26" rx="4" fill="url(#medCase3D)" stroke="#f87171" strokeWidth="1" />
                  <rect x="144" y="124" width="14" height="4" rx="1.5" fill="#334155" />
                  <rect x="134" y="132" width="34" height="1.5" fill="rgba(255,255,255,0.25)" />
                  {/* Medical Cross */}
                  <rect x="149" y="135" width="4" height="12" rx="1" fill="#ffffff" />
                  <rect x="145" y="139" width="12" height="4" rx="1" fill="#ffffff" />
                </g>

                {/* Tempered Glass Cabinet Specular Overlay */}
                <rect x="6" y="4" width="188" height="167" rx="8" fill="url(#glassGlare)" pointerEvents="none" />
              </svg>
            </div>

            <div className="panel-readouts">
              <div className="readout-row">
                <span className="readout-label">EVA SUIT 01</span>
                <span className="readout-val val-green">SEALED [OK]</span>
              </div>
              <div className="readout-row">
                <span className="readout-label">O2 CYLINDERS</span>
                <span className="readout-val val-cyan">3,000 PSI · 100%</span>
              </div>
              <div className="readout-row">
                <span className="readout-label">SAFETY TETHER</span>
                <span className="readout-val val-orange">LOCKED · 28 kN</span>
              </div>
              <div className="readout-row">
                <span className="readout-label">CABIN ECLSS</span>
                <span className="readout-val val-white">101.3 kPa · 20.9%</span>
              </div>
            </div>

            <div className="panel-switches-row">
              <div className="switch-toggle active"><span className="toggle-led led-green" /><small>SUIT PWR</small></div>
              <div className="switch-toggle active"><span className="toggle-led led-cyan" /><small>O2 PURGE</small></div>
              <div className="switch-toggle"><span className="toggle-led led-amber" /><small>EVA LOCK</small></div>
            </div>
          </aside>

          {/* Curved Spacecraft Cylindrical Hull Ribs */}
          <div className="cabin-hull-rib rib-left" />
          <div className="cabin-hull-rib rib-right" />

          {/* Center Porthole Assembly */}
          <div className="porthole-center-assembly">
            <div className="round-window-frame">
              {/* Scalable Vector Bolted Metallic Rim (24 High-Tech Aerospace Hex Bolts) */}
              <svg className="porthole-vector-rim" viewBox="0 0 600 600">
                <circle cx="300" cy="300" r="294" fill="none" stroke="#223047" strokeWidth="8" />
                <circle cx="300" cy="300" r="282" fill="none" stroke="#3b4d6b" strokeWidth="16" />
                <circle cx="300" cy="300" r="268" fill="none" stroke="#172233" strokeWidth="4" />
                {[...Array(24)].map((_, idx) => {
                  const angle = (idx * 15 * Math.PI) / 180
                  const bx = 300 + Math.cos(angle) * 282
                  const by = 300 + Math.sin(angle) * 282
                  return (
                    <g key={idx}>
                      <circle cx={bx} cy={by} r="7" fill="#64748B" stroke="#0F172A" strokeWidth="2" />
                      <circle cx={bx - 1.5} cy={by - 1.5} r="2.2" fill="#E2E8F0" />
                    </g>
                  )
                })}
              </svg>

              <div className="porthole-specular-glare" />

              {/* Subtle Optical Glass HUD Ring & Azimuth Ticks */}
              <div className="porthole-optical-hud">
                <span className="optical-tick tick-top">000°</span>
                <span className="optical-tick tick-right">090°</span>
                <span className="optical-tick tick-bottom">180°</span>
                <span className="optical-tick tick-left">270°</span>
                <span className="optical-glass-tag">OPTICAL PORT 01 · POLARIZER 15%</span>
              </div>

              {/* 4 Heavy Titanium Pressure Dog Clamps */}
              <div className="porthole-clamp clamp-top" />
              <div className="porthole-clamp clamp-bottom" />
              <div className="porthole-clamp clamp-left" />
              <div className="porthole-clamp clamp-right" />

              {/* Astronaut Safety Grab Handrail */}
              <div className="astronaut-handrail" />
            </div>

            <div className="cabin-observation-label">
              <span className="label-accent">PRIMARY OBSERVATION PORT 01</span>
              <span className="label-sub">LUNAR GRAVITY SLINGSHOT • ALT: 384,400 KM</span>
            </div>

            {/* Realistic Lower Observation Deck Control Console */}
            <div className="porthole-lower-console">
              <span className="console-screw screw-tl" />
              <span className="console-screw screw-tr" />
              <span className="console-screw screw-bl" />
              <span className="console-screw screw-br" />

              {/* Rotary Polarizer / Shutter Dial */}
              <div className="porthole-dial-module">
                <div className="rotary-dial">
                  <span className="dial-pointer" />
                </div>
                <div className="dial-info">
                  <span className="dial-title">VISOR POLARIZER</span>
                  <span className="dial-state">OPEN · 15% TINT</span>
                </div>
              </div>

              {/* Korry-style Cabin Status Switches */}
              <div className="porthole-korry-bank">
                <div className="korry-switch korry-green active">
                  <div className="korry-legend-split">
                    <span className="legend-upper">HATCH SEAL</span>
                    <span className="legend-lower">101.3 kPa</span>
                  </div>
                  <span className="korry-status-bar bar-green" />
                </div>
                <div className="korry-switch korry-cyan active">
                  <div className="korry-legend-split">
                    <span className="legend-upper">RAD SHIELD</span>
                    <span className="legend-lower">ACTIVE</span>
                  </div>
                  <span className="korry-status-bar bar-cyan" />
                </div>
                <div className="korry-switch korry-guarded active">
                  <div className="switch-hazard-guard">
                    <span className="guard-stripes" />
                  </div>
                  <div className="korry-legend-split">
                    <span className="legend-upper">GRAV FIELD</span>
                    <span className="legend-lower">0.16 G LUNAR</span>
                  </div>
                  <span className="korry-status-bar bar-orange" />
                </div>
              </div>

              {/* Manual Emergency Shutter Latch */}
              <div className="porthole-latch-module">
                <div className="latch-lever">
                  <span className="latch-handle" />
                </div>
                <div className="dial-info">
                  <span className="dial-title">SHUTTER LATCH</span>
                  <span className="dial-state text-green">LOCKED</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Wall: Lunar Navigation & Airlock Diagnostic Terminal */}
          <aside className="cabin-station-panel station-right">
            <div className="panel-header">
              <span className="panel-status-dot status-cyan" />
              <span className="panel-title">LUNAR INTERCEPT NAV</span>
            </div>
            <div className="panel-readouts">
              <div className="readout-row">
                <span className="readout-label">ORBITAL APOGEE</span>
                <span className="readout-val val-cyan">405,696 KM</span>
              </div>
              <div className="readout-row">
                <span className="readout-label">SLINGSHOT ΔV</span>
                <span className="readout-val val-orange">+1,280 M/S</span>
              </div>
              <div className="readout-row">
                <span className="readout-label">SECTOR</span>
                <span className="readout-val val-white">MARE TRANQUILLITATIS</span>
              </div>
              <div className="readout-row">
                <span className="readout-label">TRANSMISSION</span>
                <span className="readout-val val-green">DEEP SPACE NET [OK]</span>
              </div>
            </div>
            {/* Pressure Gauge & Airlock Hatch Indicators */}
            <div className="airlock-hatch-indicator">
              <div className="gauge-dial">
                <div className="gauge-needle" />
                <span className="gauge-center-cap" />
                <span className="gauge-text">1.0 ATM</span>
              </div>
              <div className="hatch-status-list">
                <div className="hatch-item"><span className="hatch-led led-green" /><span>INNER HATCH: LOCKED</span></div>
                <div className="hatch-item"><span className="hatch-led led-green" /><span>OUTER VISOR: ARMORED</span></div>
                <div className="hatch-item"><span className="hatch-led led-cyan" /><span>HEAT REJECTION: OK</span></div>
              </div>
            </div>
            <div className="hazard-warning-strip">
              <span>⚠ CAUTION: HIGH-G MANEUVER ZONE ⚠</span>
            </div>
          </aside>

          {/* Bottom Deck Floor Grate */}
          <div className="interior-deck-floor">
            <div className="floor-hazard-stripes" />
            <div className="floor-guide-lights">
              <span className="deck-dot" />
              <span className="deck-dot" />
              <span className="deck-dot active" />
              <span className="deck-dot" />
              <span className="deck-dot" />
            </div>
          </div>
        </div>
      )}

      {/* Stage 3: Front Windshield Cockpit Fullscreen Mask with High-Tech Flight Deck */}
      {stage === 'cabin_front' && (
        <div className="cabin-front-fullscreen">
          {/* Overhead Cockpit Circuit Panel */}
          <div className="cockpit-overhead-panel">
            <div className="overhead-switch-bank">
              <div className="overhead-switch active"><span className="sw-led led-cyan" /><small>WARP DRIVE</small></div>
              <div className="overhead-switch active"><span className="sw-led led-green" /><small>NAV LOCK</small></div>
              <div className="overhead-switch active"><span className="sw-led led-orange" /><small>HEAT SHIELD</small></div>
              <div className="overhead-switch"><span className="sw-led led-amber" /><small>RCS RETRO</small></div>
              <div className="overhead-switch active"><span className="sw-led led-cyan" /><small>AVIONICS</small></div>
            </div>
            <div className="cockpit-top-visor-beam" />
          </div>

          <div className="front-cockpit-frame">
            {/* Commander Left Flight MFD Screen */}
            <aside className="cockpit-mfd-screen mfd-left">
              <div className="mfd-screen-glass">
                <div className="mfd-header">
                  <span className="mfd-tag">MFD-01 // NAV DISP</span>
                  <span className="mfd-clock">T+00:08:42</span>
                </div>
                <div className="mfd-radar-scope">
                  <div className="radar-circle circle-1" />
                  <div className="radar-circle circle-2" />
                  <span className="radar-center-cross" />
                  <div className="radar-sweep-line" />
                  {(() => {
                    const entryT = Math.min(1, Math.max(0, (progress - 51) / (78 - 51)))
                    const blipLeft = 76 - entryT * 26
                    const blipTop = 22 + entryT * 28
                    const blipSize = 7 + entryT * 4
                    return (
                      <div
                        className="radar-blip blip-mars"
                        style={{
                          left: `${blipLeft}%`,
                          top: `${blipTop}%`,
                          width: `${blipSize}px`,
                          height: `${blipSize}px`,
                          transform: 'translate(-50%, -50%)',
                        }}
                      />
                    )
                  })()}
                  <span className="radar-target-label">MARS // VECTOR LOCK</span>
                </div>
                <div className="mfd-flight-data">
                  <div className="mfd-stat-line"><span>WARP FACTOR</span><strong className="text-cyan">MACH 38.2</strong></div>
                  <div className="mfd-stat-line"><span>HYPER-VELOCITY</span><strong className="text-white">11.45 KM/S</strong></div>
                  <div className="mfd-stat-line"><span>ETA JEZERO</span><strong className="text-orange">00:04:18</strong></div>
                  <div className="mfd-stat-line"><span>FLIGHT MODE</span><strong className="text-green">AUTONOMOUS</strong></div>
                </div>
              </div>
            </aside>

            {/* Center Windshield Viewport */}
            <div className="cockpit-windshield-center-block">
              <div className="cockpit-dash-console">
                <div className="console-indicator-strip">
                  <span className="dash-tag text-cyan">HYPERSPACE WARP: ACTIVE</span>
                  <span className="dash-tag text-highlight">APPROACHING: MARS JEZERO BASE</span>
                  <span className="dash-tag text-orange">HEAT SHIELD: 1,850°C</span>
                </div>
              </div>

              <div className="rectangular-windshield-wrapper">
                {/* Structural Cockpit Canopy Pillars */}
                <div className="cockpit-canopy-strut strut-left" />
                <div className="cockpit-canopy-strut strut-right" />

                <div className="windshield-entry-plasma-layer">
                  <div className="plasma-burn-streak streak-top" />
                  <div className="plasma-burn-streak streak-bottom" />
                  <div className="plasma-friction-flame-center" />
                  <div className="entry-warning-hud">
                    <span className="hud-flame-dot" />
                    <span>MARS ATMOSPHERIC ENTRY • PLASMA COMPRESSION</span>
                  </div>
                </div>

                <div className="windshield-nav-reticle">
                  <div className="reticle-box" />
                  <span className="reticle-line-h" />
                  <span className="reticle-line-v" />
                  <span className="reticle-coord">LOCK: JEZERO BASE ALPHA</span>
                </div>
              </div>

              {/* Lower Center Flight Console & Thruster Throttle Pedestal */}
              <div className="cockpit-pedestal-console">
                {/* CNC Corner Fasteners */}
                <span className="console-screw screw-tl" />
                <span className="console-screw screw-tr" />
                <span className="console-screw screw-bl" />
                <span className="console-screw screw-br" />

                {/* Left: Dual Throttle Quadrant with Slotted Mechanical Levers */}
                <div className="pedestal-quadrant-bank">
                  <div className="quadrant-plate-header">
                    <span className="quadrant-title">THRUST QUADRANT // CH4-LOX</span>
                    <span className="quadrant-mode">WARP DETENT: 100%</span>
                  </div>
                  <div className="pedestal-throttles">
                    <div className="throttle-slot-module">
                      <div className="throttle-detent-scale">
                        <span>MAX</span>
                        <span>50</span>
                        <span>IDL</span>
                      </div>
                      <div className="throttle-slot-track">
                        <div className="throttle-lever-knob lever-max">
                          <div className="knob-ribs" />
                          <span className="knob-led" />
                        </div>
                      </div>
                      <div className="throttle-telemetry">
                        <span className="throttle-id">THRUST 1</span>
                        <span className="throttle-output val-orange">100%</span>
                      </div>
                    </div>

                    <div className="throttle-slot-module">
                      <div className="throttle-detent-scale">
                        <span>MAX</span>
                        <span>50</span>
                        <span>IDL</span>
                      </div>
                      <div className="throttle-slot-track">
                        <div className="throttle-lever-knob lever-max">
                          <div className="knob-ribs" />
                          <span className="knob-led" />
                        </div>
                      </div>
                      <div className="throttle-telemetry">
                        <span className="throttle-id">THRUST 2</span>
                        <span className="throttle-output val-orange">100%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Center: Flight Control Status & Master Annunciator Lamp */}
                <div className="pedestal-center-avionics">
                  <div className="master-caution-lamp lamp-green">
                    <span className="caution-label">FLIGHT STATUS</span>
                    <span className="caution-state">AUTONOMOUS · NOMINAL</span>
                  </div>
                  <div className="bus-voltage-readout">
                    <small>AVIONICS BUS A/B</small>
                    <strong>28.4 VDC</strong>
                  </div>
                </div>

                {/* Right: Korry-Style Aerospace Backlit Annunciator Buttons */}
                <div className="pedestal-annunciator-bank">
                  <div className="quadrant-plate-header">
                    <span className="quadrant-title">PRIMARY SYSTEMS ANNUNCIATOR</span>
                    <span className="quadrant-mode">BUS-1 ONLINE</span>
                  </div>
                  <div className="pedestal-annunciator">
                    {/* 1. Cabin Status Button */}
                    <div className="korry-switch korry-green active">
                      <div className="korry-legend-split">
                        <span className="legend-upper">CABIN</span>
                        <span className="legend-lower">SECURE</span>
                      </div>
                      <span className="korry-status-bar bar-green" />
                    </div>

                    {/* 2. Plasma Shield Button */}
                    <div className="korry-switch korry-cyan active">
                      <div className="korry-legend-split">
                        <span className="legend-upper">PLASMA SHIELD</span>
                        <span className="legend-lower">CHARGED 100%</span>
                      </div>
                      <span className="korry-status-bar bar-cyan" />
                    </div>

                    {/* 3. Mars Retro Armed Guarded Switch */}
                    <div className="korry-switch korry-guarded active">
                      <div className="switch-hazard-guard">
                        <span className="guard-stripes" />
                      </div>
                      <div className="korry-legend-split">
                        <span className="legend-upper">MARS RETRO</span>
                        <span className="legend-lower">ARMED</span>
                      </div>
                      <span className="korry-status-bar bar-orange" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Pilot Right Flight MFD Screen */}
            <aside className="cockpit-mfd-screen mfd-right">
              <div className="mfd-screen-glass">
                <div className="mfd-header">
                  <span className="mfd-tag">MFD-02 // PROPULSION</span>
                  <span className="mfd-clock">CORE: 99.2%</span>
                </div>
                {/* Propellant Tank Level Bars */}
                <div className="propellant-telemetry">
                  <div className="tank-bar-item">
                    <span className="tank-label">LIQ METHANE (CH4)</span>
                    <div className="tank-level-track"><div className="tank-level-fill fill-cyan" style={{ width: '84%' }} /></div>
                    <span className="tank-pct">84%</span>
                  </div>
                  <div className="tank-bar-item">
                    <span className="tank-label">LIQ OXYGEN (LOX)</span>
                    <div className="tank-level-track"><div className="tank-level-fill fill-cyan" style={{ width: '88%' }} /></div>
                    <span className="tank-pct">88%</span>
                  </div>
                  <div className="tank-bar-item">
                    <span className="tank-label">HEAT SHIELD TEMP</span>
                    <div className="tank-level-track"><div className="tank-level-fill fill-orange" style={{ width: '74%' }} /></div>
                    <span className="tank-pct text-orange">1,850°C</span>
                  </div>
                </div>
                <div className="thruster-matrix">
                  <div className="rcs-badge active">RCS-N1: OK</div>
                  <div className="rcs-badge active">RCS-N2: OK</div>
                  <div className="rcs-badge active">RCS-S1: OK</div>
                  <div className="rcs-badge active">RCS-S2: OK</div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      )}

      {/* Topbar */}
      <header className="cinematic-topbar">
        <div className="topbar-mission">
          <span className="live-beacon" />
          <strong className="mission-title">MARSMENT MISSION CONTROL</strong>
          <span className="mission-badge">3D EXPEDITION</span>
        </div>

        <div className="topbar-actions">
          <button
            type="button"
            className="action-btn audio-btn"
            onClick={() => setAudioEnabled(!audioEnabled)}
            aria-label="Toggle Mission Audio"
          >
            {audioEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
            <span>{audioEnabled ? 'SOUND ON' : 'SOUND OFF'}</span>
          </button>
          <button type="button" className="action-btn skip-btn" onClick={handleSkip}>
            <FastForward size={14} />
            <span>SKIP TO SITE</span>
          </button>
        </div>
      </header>

      {/* Sleek Cinematic Bottom Bar */}
      <footer className="cinematic-bottombar">
        {stage === 'earth_pad' ? (
          <div className="launch-action-center">
            <div className="earth-briefing-tag">
              <span className="dot-pulse" />
              <span>DAYLIGHT LAUNCH VEHICLE PRIMED • EARTH BASE</span>
            </div>

            <button
              type="button"
              className="grand-mars-launch-btn"
              onClick={handleLaunch}
              aria-label="Launch the rocket to Mars"
            >
              <div className="btn-glow-pulse" />
              <div className="btn-content-inner">
                <Rocket className="rocket-btn-icon" size={24} />
                <span className="btn-label-text">CLICK HERE TO LAUNCH THE ROCKET TO MARS</span>
                <ChevronRight className="btn-arrow-icon" size={20} />
              </div>
            </button>

            <div className="earth-explore-hint">
              <Compass size={13} className="text-cyan animate-spin-slow" />
              <span>MOVE MOUSE OR DRAG TO EXPLORE EARTH LAUNCH FACILITY</span>
            </div>
          </div>
        ) : stage === 'mars_touchdown' ? (
          <div className="mars-disembark-card">
            <div className="disembark-badge">
              <span className="dot-pulse" />
              <span>EXPEDITION 01 • TOUCHDOWN CONFIRMED</span>
            </div>

            <h2 className="disembark-title">
              MISSION ACCOMPLISHED • <span className="text-orange">WELCOME TO MARS</span>
            </h2>
            <p className="disembark-desc">
              The rocket has landed safely at Jezero Base Alpha. Step out onto the Martian surface to explore our website.
            </p>

            <button
              type="button"
              className="grand-mars-disembark-btn"
              onClick={finishFlight}
              aria-label="Step onto Mars and visit the website"
            >
              <div className="btn-glow-pulse" />
              <div className="btn-content-inner">
                <Compass className="disembark-btn-icon" size={22} />
                <span className="btn-label-text">STEP ONTO MARS & VISIT THE WEBSITE</span>
                <ChevronRight className="btn-arrow-icon" size={20} />
              </div>
            </button>

            <div className="explore-look-hint">
              <Compass size={13} className="text-cyan animate-spin-slow" />
              <span>MOVE MOUSE OR DRAG TO EXPLORE THE SURROUNDING MARTIAN CANYON</span>
            </div>
          </div>
        ) : (
          <div className="minimal-flight-hud">
            <div className="minimal-hud-inner">
              <div className="hud-phase-pill">
                <span className="phase-dot" />
                <span className="phase-name">
                  {stage === 'earth_ascent' && '01 · EARTH LIFTOFF'}
                  {stage === 'cabin_porthole' && '02 · MOON SLINGSHOT'}
                  {stage === 'cabin_front' && '03 · 3D WARP & MARS ENTRY'}
                  {stage === 'mars_exterior' && '04 · MARS CANYON DESCENT'}
                </span>
              </div>

              <div className="hud-metric-chips">
                <span className="chip-data text-cyan">{velocityKmS} <small>KM/S</small></span>
                <span className="chip-sep">·</span>
                <span className="chip-data text-white">{altitudeKm.toLocaleString()} <small>KM ALT</small></span>
                <span className="chip-sep">·</span>
                <span className="chip-data text-orange">{targetDistanceMkm} <small>M KM</small></span>
              </div>

              <span className="hud-status-badge">
                {stage === 'earth_ascent' && 'LIFTOFF'}
                {stage === 'cabin_porthole' && 'LUNAR SLINGSHOT'}
                {stage === 'cabin_front' && 'HYPERSPACE WARP'}
                {stage === 'mars_exterior' && 'RETRO-DESCENT'}
              </span>
            </div>

            {/* Ultra-slim minimal progress track */}
            <div className="minimal-progress-track">
              <div className="minimal-progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}
      </footer>
    </div>
  )
}
