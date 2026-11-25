'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [animating, setAnimating] = useState(false)
  const prevPathRef = useRef(pathname)

  useEffect(() => {
    if (prevPathRef.current !== pathname) {
      prevPathRef.current = pathname
      setAnimating(true)
      const timer = setTimeout(() => {
        setAnimating(false)
      }, 550)
      return () => clearTimeout(timer)
    }
  }, [pathname])

  return (
    <div className={`space-route-wrapper ${animating ? 'route-warping' : 'route-settled'}`}>
      {/* Cosmic Warp sweep line during navigation */}
      <div className="space-warp-beacon" />
      <div className="space-route-content">
        {children}
      </div>
    </div>
  )
}
