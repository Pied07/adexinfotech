'use client'

import { useEffect, useRef, useState } from 'react'

interface AnimatedCounterProps {
  target: number
  suffix?: string
  prefix?: string
  duration?: number
  className?: string
}

export function AnimatedCounter({
  target,
  suffix = '',
  prefix = '',
  duration = 1100,
  className = '',
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0)
  const elRef = useRef<HTMLElement>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const el = elRef.current
    if (!el) return

    const startCounting = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      const startTime = performance.now()

      const tick = (now: number) => {
        const elapsed = now - startTime
        const t = Math.min(1, elapsed / duration)
        // Ease-out cubic
        const eased = 1 - Math.pow(1 - t, 3)
        setCount(Math.round(eased * target))
        if (t < 1) {
          rafRef.current = requestAnimationFrame(tick)
        }
      }
      rafRef.current = requestAnimationFrame(tick)
    }

    if (!('IntersectionObserver' in window)) {
      setCount(target)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setCount(0)
            startCounting()
          } else {
            if (rafRef.current) cancelAnimationFrame(rafRef.current)
            setCount(0)
          }
        })
      },
      { threshold: 0.2 }
    )

    observer.observe(el)
    return () => {
      observer.disconnect()
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [target, duration])

  return (
    <strong ref={elRef} className={className}>
      {prefix}
      {count}
      {suffix}
    </strong>
  )
}
