'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import './NotFoundTorchScene.css'

/* ── Letter definitions ────────────────────────────────────────────────────
   Cave-unique effects (nothing like the Unsplash reference):

   · lt-erode   : stone slowly dissolved by dripping cave water — blur+fade
   · lt-tremor  : burst-pattern position jitter — something huge in the walls
   · lt-sink    : letter sinking INTO the stone face — 3D perspective rotateX
   · lt-alive   : white → blood-red double heartbeat — the cave breathes
   ───────────────────────────────────────────────────────────────────────── */
const LETTERS: Array<{ char: string; cls?: string }> = [
  { char: 'P' },
  { char: 'a', cls: 'lt-erode' },
  { char: 'g' },
  { char: 'e', cls: 'lt-tremor' },
  { char: ' ' },
  { char: 'n' },
  { char: 'o', cls: 'lt-erode lt-erode--2' },
  { char: 't', cls: 'lt-sink' },
  { char: ' ' },
  { char: 'f' },
  { char: 'o', cls: 'lt-tremor lt-tremor--2' },
  { char: 'u', cls: 'lt-erode lt-erode--3' },
  { char: 'n' },
  { char: 'd', cls: 'lt-alive' },
]

interface NotFoundTorchSceneProps {
  /** URL of the background image. Falls back to the static cave photo. */
  bgUrl?: string
  /** Subtitle copy. Falls back to the default cave line. */
  subtext?: string
}

export function NotFoundTorchScene({ bgUrl, subtext }: NotFoundTorchSceneProps) {
  const maskRef  = useRef<HTMLDivElement | null>(null)
  const bloomRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const mask  = maskRef.current
    const bloom = bloomRef.current
    if (!mask || !bloom) return

    let mx = 50, my = 50

    const onMove = (e: MouseEvent | TouchEvent) => {
      const cx = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX
      const cy = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY
      mx = (cx / window.innerWidth)  * 100
      my = (cy / window.innerHeight) * 100
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('touchmove',  onMove, { passive: true })

    let sx = 50, sy = 50
    let raf = 0

    const tick = () => {
      sx += (mx - sx) * 0.08
      sy += (my - sy) * 0.08

      const dx = (sx - 50) / 50
      const dy = (sy - 50) / 50
      const dist = Math.min(1, Math.sqrt(dx * dx + dy * dy))

      const glowSize = 22 + (1 - dist) * 38
      const haloSize = glowSize * 2.2

      mask.style.background = `radial-gradient(
        circle ${glowSize}vmin at ${sx}% ${sy}%,
        transparent 0%,
        rgba(4,4,8,0.38) 55%,
        rgba(4,4,8,0.76) 100%
      )`

      bloom.style.background = `radial-gradient(
        circle ${haloSize}vmin at ${sx}% ${sy}%,
        rgba(255,210,140,0.18) 0%,
        rgba(255,160,80,0.08)  35%,
        transparent 70%
      )`

      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('touchmove',  onMove)
    }
  }, [])

  // The CSS has the default cave image hardcoded.
  // When an admin-supplied URL is present we override it via inline style.
  const bgStyle = bgUrl
    ? { backgroundImage: `url('${bgUrl}')` }
    : undefined

  const subtextCopy = subtext?.trim() || "You've wandered too deep. This path doesn't exist."

  return (
    <main className="nf-root" aria-label="404 — Page not found">
      <div className="nf-bg" style={bgStyle} />
      <div ref={maskRef} className="nf-mask" />
      <div ref={bloomRef} className="nf-bloom" />

      <div className="nf-content">
        <p className="nf-eyebrow">404</p>

        <h1 className="nf-heading" aria-label="Page not found">
          {LETTERS.map(({ char, cls }, i) =>
            char === ' ' ? (
              <span key={i} className="lt-space" aria-hidden="true">&nbsp;</span>
            ) : (
              <span key={i} className={`lt${cls ? ` ${cls}` : ''}`} aria-hidden="true">
                {char}
              </span>
            )
          )}
        </h1>

        <p className="nf-sub">{subtextCopy}</p>

        <Link href="/" className="nf-btn">
          ← Back to Home
        </Link>
      </div>
    </main>
  )
}
