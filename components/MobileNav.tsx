'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { Menu, X, ArrowUpRight } from 'lucide-react'

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

  return (
    <details className="mobile-menu" ref={menu}>
      <summary aria-label="Open mobile navigation menu">
        <Menu size={20} className="menu-icon-open" />
      </summary>
      <div className="mobile-dropdown-panel">
        <div className="mobile-dropdown-header">
          <span className="mobile-brand-title">MARSMENT</span>
          <span className="mobile-badge">NAVIGATION</span>
        </div>
        <nav className="mobile-nav-links">
          <Link href="/" onClick={closeMenu}>
            <span>01</span> Home
          </Link>
          <Link href="/services" onClick={closeMenu}>
            <span>02</span> Services
          </Link>
          <Link href="/about" onClick={closeMenu}>
            <span>03</span> About
          </Link>
          <Link href="/blog" onClick={closeMenu}>
            <span>04</span> Insights
          </Link>
          <Link href="/contact" onClick={closeMenu}>
            <span>05</span> Contact
          </Link>
        </nav>
        <div className="mobile-cta-wrap">
          <Link href="/contact" className="button button-mars-quote w-full" onClick={closeMenu}>
            <span>Get a Quote</span>
            <ArrowUpRight size={15} />
          </Link>
        </div>
      </div>
    </details>
  )
}
