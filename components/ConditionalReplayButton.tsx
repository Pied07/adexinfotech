'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { ReplayMissionButton } from '@/components/ReplayMissionButton'

export function ConditionalReplayButton() {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  // Return null until client has mounted — prevents server/client pathname mismatch
  if (!mounted || pathname !== '/') return null
  return <ReplayMissionButton />
}
