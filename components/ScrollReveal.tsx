'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

export function ScrollReveal({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  useEffect(() => {
    const container = root.current
    if (!container) return
    document.documentElement.classList.add('motion-ready')
    const selector = '[data-reveal], main > section:not(.home-hero)'
    const elements = Array.from(container.querySelectorAll<HTMLElement>(selector))
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      elements.forEach((element) => element.classList.add('is-visible'))
      return
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('is-visible')
        observer.unobserve(entry.target)
      })
    }, { threshold: 0.12, rootMargin: '0px 0px -48px 0px' })
    elements.forEach((element) => observer.observe(element))

    // The site shell persists across App Router navigation. Observe newly
    // rendered route content too, or its reveal styles can leave it invisible.
    const mutations = new MutationObserver((records) => {
      for (const record of records) {
        for (const node of Array.from(record.addedNodes)) {
          if (!(node instanceof HTMLElement)) continue
          if (node.matches(selector)) observer.observe(node)
          node.querySelectorAll<HTMLElement>(selector).forEach((element) => observer.observe(element))
        }
      }
    })
    mutations.observe(container, { childList: true, subtree: true })

    return () => {
      mutations.disconnect()
      observer.disconnect()
    }
  }, [pathname])

  return <div ref={root} className="scroll-reveal-root">{children}</div>
}
