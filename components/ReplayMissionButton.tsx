'use client'

import { Rocket } from 'lucide-react'

export function ReplayMissionButton() {
  const triggerReplay = () => {
    try {
      sessionStorage.removeItem('marsment_rocket_launched')
    } catch {
      // ignore
    }
    window.dispatchEvent(new CustomEvent('marsment:replay-launch'))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <button
      type="button"
      onClick={triggerReplay}
      className="replay-mission-btn"
      title="Replay Rocket Launch Experience"
    >
      <Rocket size={15} />
      <span>Replay Mars Launch</span>
    </button>
  )
}
