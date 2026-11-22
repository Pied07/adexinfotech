'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

export function MobileNav() {
  const menu = useRef<HTMLDetailsElement>(null)
  const pathname = usePathname()

  useEffect(() => {
    if (menu.current) menu.current.open = false
    const timer = window.setTimeout(() => window.scrollTo(0, 0), 80)
    return () => window.clearTimeout(timer)
  }, [pathname])

  function closeMenu() {
    if (menu.current) menu.current.open = false
  }

  return <details className="mobile-menu" ref={menu}>
    <summary aria-label="Open navigation">☰</summary>
    <div>
      <Link href="/services" onClick={closeMenu}>Services</Link>
      <Link href="/about" onClick={closeMenu}>About</Link>
      <Link href="/blog" onClick={closeMenu}>Insights</Link>
      <Link href="/contact" onClick={closeMenu}>Contact</Link>
    </div>
  </details>
}
