import * as THREE from 'three'

// Deterministic 3D hash & smooth value noise on unit sphere (eliminates UV seams)
export function hash3(x: number, y: number, z: number): number {
  const n = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453123
  return n - Math.floor(n)
}

export function noise3(x: number, y: number, z: number): number {
  const ix = Math.floor(x)
  const iy = Math.floor(y)
  const iz = Math.floor(z)
  const fx = x - ix
  const fy = y - iy
  const fz = z - iz

  const ux = fx * fx * (3 - 2 * fx)
  const uy = fy * fy * (3 - 2 * fy)
  const uz = fz * fz * (3 - 2 * fz)

  const n000 = hash3(ix, iy, iz)
  const n100 = hash3(ix + 1, iy, iz)
  const n010 = hash3(ix, iy + 1, iz)
  const n110 = hash3(ix + 1, iy + 1, iz)
  const n001 = hash3(ix, iy, iz + 1)
  const n101 = hash3(ix + 1, iy, iz + 1)
  const n011 = hash3(ix, iy + 1, iz + 1)
  const n111 = hash3(ix + 1, iy + 1, iz + 1)

  const nx00 = n000 + (n100 - n000) * ux
  const nx10 = n010 + (n110 - n010) * ux
  const nx01 = n001 + (n101 - n001) * ux
  const nx11 = n011 + (n111 - n011) * ux

  const nxy0 = nx00 + (nx10 - nx00) * uy
  const nxy1 = nx01 + (nx11 - nx01) * uy

  return nxy0 + (nxy1 - nxy0) * uz
}

export function fbm3(x: number, y: number, z: number, octaves = 5): number {
  let value = 0
  let amp = 0.5
  let freq = 1
  for (let i = 0; i < octaves; i++) {
    value += amp * noise3(x * freq, y * freq, z * freq)
    freq *= 2.05
    amp *= 0.5
  }
  return value
}

interface Crater {
  x: number
  y: number
  z: number
  r: number
  depth: number
}

function generateCraters(count: number, seedOffset = 0): Crater[] {
  const craters: Crater[] = []
  for (let i = 0; i < count; i++) {
    const s = i + seedOffset
    const u = hash3(s, 1.3, 7.1)
    const v = hash3(s, 5.7, 2.9)
    const theta = u * Math.PI * 2
    const phi = Math.acos(2 * v - 1)
    const x = Math.sin(phi) * Math.cos(theta)
    const y = Math.cos(phi)
    const z = Math.sin(phi) * Math.sin(theta)
    const sizeRand = hash3(s, 9.2, 4.4)
    const r = i < 6 ? 0.14 + sizeRand * 0.12 : 0.025 + Math.pow(sizeRand, 2.2) * 0.09
    craters.push({ x, y, z, r, depth: 0.4 + hash3(s, 3.1, 8.8) * 0.6 })
  }
  return craters
}

export function createRealisticMarsMaps() {
  const width = 1024
  const height = 512

  const albedoCanvas = document.createElement('canvas')
  albedoCanvas.width = width
  albedoCanvas.height = height
  const albedoCtx = albedoCanvas.getContext('2d')!
  const albedoImg = albedoCtx.createImageData(width, height)

  const bumpCanvas = document.createElement('canvas')
  bumpCanvas.width = width
  bumpCanvas.height = height
  const bumpCtx = bumpCanvas.getContext('2d')!
  const bumpImg = bumpCtx.createImageData(width, height)

  const roughCanvas = document.createElement('canvas')
  roughCanvas.width = width
  roughCanvas.height = height
  const roughCtx = roughCanvas.getContext('2d')!
  const roughImg = roughCtx.createImageData(width, height)

  const craters = generateCraters(68)

  for (let py = 0; py < height; py++) {
    const v = py / (height - 1)
    const phi = v * Math.PI
    const sinPhi = Math.sin(phi)
    const cosPhi = Math.cos(phi)

    for (let px = 0; px < width; px++) {
      const u = px / (width - 1)
      const theta = u * Math.PI * 2

      const sx = sinPhi * Math.cos(theta)
      const sy = cosPhi
      const sz = sinPhi * Math.sin(theta)

      const continent = fbm3(sx * 2.1 + 1.4, sy * 2.1 - 0.7, sz * 2.1 + 3.2, 5)
      const midDetail = fbm3(sx * 6.5 + 4.1, sy * 6.5 + 2.3, sz * 6.5 - 1.9, 4)
      const fineGrain = fbm3(sx * 18.0, sy * 18.0, sz * 18.0, 3)

      const canyonBand = Math.exp(-Math.pow((sy + 0.08 + (continent - 0.5) * 0.12) * 11, 2))
      const canyonLon = Math.exp(-Math.pow((sx - 0.55) * 2.5, 2)) * (sz > -0.4 ? 1 : 0)
      const canyon = canyonBand * canyonLon * (0.65 + midDetail * 0.6)

      let craterHeight = 0
      let craterRim = 0
      for (let c = 0; c < craters.length; c++) {
        const cr = craters[c]
        const dx = sx - cr.x
        const dy = sy - cr.y
        const dz = sz - cr.z
        const distSq = dx * dx + dy * dy + dz * dz
        const maxR = cr.r * 1.45
        if (distSq < maxR * maxR) {
          const d = Math.sqrt(distSq) / cr.r
          if (d < 0.85) {
            const bowl = (1 - (d / 0.85) * (d / 0.85)) * cr.depth
            craterHeight -= bowl * 0.48
          } else {
            const rim = Math.exp(-Math.pow((d - 1.0) * 4.5, 2)) * cr.depth
            craterHeight += rim * 0.24
            craterRim += rim
          }
        }
      }

      const elevation = Math.max(
        0,
        Math.min(1, continent * 0.65 + midDetail * 0.25 + fineGrain * 0.1 - canyon * 0.45 + craterHeight)
      )

      const basaltMask = Math.max(0, Math.min(1, (0.48 - continent) * 3.1 + (midDetail - 0.5) * 0.4))
      const dustMask = Math.max(0, Math.min(1, (continent - 0.52) * 2.4 + craterRim * 0.4))

      let r = 186 + (midDetail - 0.5) * 38 + (fineGrain - 0.5) * 24
      let g = 84 + (midDetail - 0.5) * 22 + (fineGrain - 0.5) * 14
      let b = 46 + (midDetail - 0.5) * 14

      r = r * (1 - basaltMask * 0.55) + 78 * (basaltMask * 0.55)
      g = g * (1 - basaltMask * 0.55) + 42 * (basaltMask * 0.55)
      b = b * (1 - basaltMask * 0.45) + 34 * (basaltMask * 0.45)

      r = r * (1 - dustMask * 0.4) + 224 * (dustMask * 0.4)
      g = g * (1 - dustMask * 0.4) + 122 * (dustMask * 0.4)
      b = b * (1 - dustMask * 0.35) + 74 * (dustMask * 0.35)

      if (canyon > 0.05) {
        const cDark = Math.min(0.65, canyon * 0.75)
        r *= 1 - cDark * 0.5
        g *= 1 - cDark * 0.58
        b *= 1 - cDark * 0.55
      }

      const absLat = Math.abs(sy)
      const capNoise = (midDetail - 0.5) * 0.09 + (fineGrain - 0.5) * 0.04
      const polarFactor = Math.max(0, Math.min(1, (absLat + capNoise - 0.86) * 14))
      if (polarFactor > 0) {
        r = r * (1 - polarFactor) + 236 * polarFactor
        g = g * (1 - polarFactor) + 226 * polarFactor
        b = b * (1 - polarFactor) + 218 * polarFactor
      }

      const idx = (py * width + px) * 4
      albedoImg.data[idx] = Math.max(0, Math.min(255, r))
      albedoImg.data[idx + 1] = Math.max(0, Math.min(255, g))
      albedoImg.data[idx + 2] = Math.max(0, Math.min(255, b))
      albedoImg.data[idx + 3] = 255

      const bumpVal = Math.max(0, Math.min(255, elevation * 255))
      bumpImg.data[idx] = bumpVal
      bumpImg.data[idx + 1] = bumpVal
      bumpImg.data[idx + 2] = bumpVal
      bumpImg.data[idx + 3] = 255

      const roughVal = Math.max(
        110,
        Math.min(248, 220 - basaltMask * 38 - polarFactor * 75 + (fineGrain - 0.5) * 20)
      )
      roughImg.data[idx] = roughVal
      roughImg.data[idx + 1] = roughVal
      roughImg.data[idx + 2] = roughVal
      roughImg.data[idx + 3] = 255
    }
  }

  albedoCtx.putImageData(albedoImg, 0, 0)
  bumpCtx.putImageData(bumpImg, 0, 0)
  roughCtx.putImageData(roughImg, 0, 0)

  const map = new THREE.CanvasTexture(albedoCanvas)
  map.colorSpace = THREE.SRGBColorSpace
  map.wrapS = THREE.RepeatWrapping
  map.anisotropy = 4

  const bumpMap = new THREE.CanvasTexture(bumpCanvas)
  bumpMap.wrapS = THREE.RepeatWrapping

  const roughnessMap = new THREE.CanvasTexture(roughCanvas)
  roughnessMap.wrapS = THREE.RepeatWrapping

  return { map, bumpMap, roughnessMap }
}

export function createMartianCloudTexture(): THREE.CanvasTexture {
  const width = 512
  const height = 256
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')!
  const img = ctx.createImageData(width, height)

  for (let py = 0; py < height; py++) {
    const phi = (py / (height - 1)) * Math.PI
    const sinPhi = Math.sin(phi)
    const cosPhi = Math.cos(phi)

    for (let px = 0; px < width; px++) {
      const theta = (px / (width - 1)) * Math.PI * 2
      const sx = sinPhi * Math.cos(theta)
      const sy = cosPhi
      const sz = sinPhi * Math.sin(theta)

      const wisp = fbm3(sx * 3.8 + 7.2, sy * 5.2, sz * 3.8 - 2.4, 4)
      const alpha = Math.max(0, Math.min(1, (wisp - 0.56) * 3.2)) * 0.32
      const idx = (py * width + px) * 4
      img.data[idx] = 255
      img.data[idx + 1] = 216
      img.data[idx + 2] = 190
      img.data[idx + 3] = Math.round(alpha * 255)
    }
  }

  ctx.putImageData(img, 0, 0)
  const tex = new THREE.CanvasTexture(canvas)
  tex.wrapS = THREE.RepeatWrapping
  return tex
}

export function createRealisticMoonMaps(tint: 'lunar' | 'phobos' | 'deimos' = 'lunar') {
  const width = 512
  const height = 256

  const albedoCanvas = document.createElement('canvas')
  albedoCanvas.width = width
  albedoCanvas.height = height
  const albedoCtx = albedoCanvas.getContext('2d')!
  const albedoImg = albedoCtx.createImageData(width, height)

  const bumpCanvas = document.createElement('canvas')
  bumpCanvas.width = width
  bumpCanvas.height = height
  const bumpCtx = bumpCanvas.getContext('2d')!
  const bumpImg = bumpCtx.createImageData(width, height)

  const seed = tint === 'lunar' ? 100 : tint === 'phobos' ? 240 : 410
  const craters = generateCraters(54, seed)

  const baseColor =
    tint === 'phobos'
      ? [142, 166, 178] // Cool slate-cyan Martian moonlet
      : tint === 'deimos'
        ? [176, 134, 114] // Warm dusty-ochre moonlet
        : [196, 202, 212] // Earth's lunar regolith

  const mariaColor =
    tint === 'phobos'
      ? [64, 86, 98]
      : tint === 'deimos'
        ? [94, 62, 50]
        : [92, 98, 112]

  for (let py = 0; py < height; py++) {
    const phi = (py / (height - 1)) * Math.PI
    const sinPhi = Math.sin(phi)
    const cosPhi = Math.cos(phi)

    for (let px = 0; px < width; px++) {
      const theta = (px / (width - 1)) * Math.PI * 2
      const sx = sinPhi * Math.cos(theta)
      const sy = cosPhi
      const sz = sinPhi * Math.sin(theta)

      const mariaNoise = fbm3(sx * 2.4 + seed * 0.01, sy * 2.4, sz * 2.4 - seed * 0.01, 4)
      const regolith = fbm3(sx * 9.0, sy * 9.0, sz * 9.0, 3)

      let craterH = 0
      let craterRim = 0
      for (let c = 0; c < craters.length; c++) {
        const cr = craters[c]
        const dx = sx - cr.x
        const dy = sy - cr.y
        const dz = sz - cr.z
        const distSq = dx * dx + dy * dy + dz * dz
        const maxR = cr.r * 1.45
        if (distSq < maxR * maxR) {
          const d = Math.sqrt(distSq) / cr.r
          if (d < 0.84) {
            craterH -= (1 - (d / 0.84) * (d / 0.84)) * cr.depth * 0.55
          } else {
            const rim = Math.exp(-Math.pow((d - 1.0) * 4.2, 2)) * cr.depth
            craterH += rim * 0.28
            craterRim += rim
          }
        }
      }

      const mariaMask = Math.max(0, Math.min(1, (0.48 - mariaNoise) * 3.0))
      const elev = Math.max(0, Math.min(1, mariaNoise * 0.5 + regolith * 0.35 + craterH + 0.15))

      let r = baseColor[0] * (1 - mariaMask * 0.7) + mariaColor[0] * (mariaMask * 0.7)
      let g = baseColor[1] * (1 - mariaMask * 0.7) + mariaColor[1] * (mariaMask * 0.7)
      let b = baseColor[2] * (1 - mariaMask * 0.7) + mariaColor[2] * (mariaMask * 0.7)

      const grain = (regolith - 0.5) * 32 + craterRim * 36
      r = Math.max(0, Math.min(255, r + grain))
      g = Math.max(0, Math.min(255, g + grain))
      b = Math.max(0, Math.min(255, b + grain))

      const idx = (py * width + px) * 4
      albedoImg.data[idx] = r
      albedoImg.data[idx + 1] = g
      albedoImg.data[idx + 2] = b
      albedoImg.data[idx + 3] = 255

      const bv = Math.max(0, Math.min(255, elev * 255))
      bumpImg.data[idx] = bv
      bumpImg.data[idx + 1] = bv
      bumpImg.data[idx + 2] = bv
      bumpImg.data[idx + 3] = 255
    }
  }

  albedoCtx.putImageData(albedoImg, 0, 0)
  bumpCtx.putImageData(bumpImg, 0, 0)

  const map = new THREE.CanvasTexture(albedoCanvas)
  map.colorSpace = THREE.SRGBColorSpace
  map.wrapS = THREE.RepeatWrapping

  const bumpMap = new THREE.CanvasTexture(bumpCanvas)
  bumpMap.wrapS = THREE.RepeatWrapping

  return { map, bumpMap }
}

export const atmosphereVertexShader = `
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPos = worldPos.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`

export const atmosphereFragmentShader = `
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  uniform vec3 uSunDir;
  uniform vec3 uCyanMoonDir;
  uniform vec3 uOrangeMoonDir;

  void main() {
    vec3 viewDir = normalize(cameraPosition - vWorldPos);
    float rim = 1.0 - max(0.0, dot(viewDir, vNormal));
    float fresnel = pow(rim, 3.0);

    vec3 n = normalize(vNormal);
    float sunDot = dot(n, normalize(uSunDir));
    float dayMask = smoothstep(-0.45, 0.75, sunDot);

    float cyanDot = max(0.0, dot(n, normalize(uCyanMoonDir)));
    float orangeDot = max(0.0, dot(n, normalize(uOrangeMoonDir)));

    vec3 warmAtmo = vec3(0.95, 0.42, 0.22);
    vec3 cyanAtmo = vec3(0.13, 0.83, 0.93);
    vec3 orangeAtmo = vec3(0.98, 0.40, 0.16);

    vec3 color = warmAtmo * (0.25 + 0.75 * dayMask);
    color += cyanAtmo * pow(cyanDot, 2.0) * 0.95;
    color += orangeAtmo * pow(orangeDot, 2.0) * 0.95;

    float alpha = fresnel * (0.32 + 0.55 * dayMask + 0.35 * max(cyanDot, orangeDot));
    gl_FragColor = vec4(color, min(0.95, alpha));
  }
`
