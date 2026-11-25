import Link from 'next/link'
import { Rocket, ArrowUpRight } from 'lucide-react'

export default function NotFound() {
  return (
    <main className="not-found container">
      <div className="mars-eyebrow">
        <span className="eyebrow-beacon" />
        <span>ANOMALY DETECTED • 404</span>
      </div>
      <h1 className="not-found-title">
        Trajectory lost in<br />
        <span className="text-mars">deep space.</span>
      </h1>
      <p className="not-found-desc">
        The coordinate vector you requested does not exist or has been relocated to another sector.
      </p>
      <div className="not-found-actions">
        <Link className="button button-mars-quote" href="/">
          <Rocket size={17} />
          <span>Return to Mars Base</span>
        </Link>
        <Link className="button button-glass-cyan" href="/services">
          <span>Explore Capabilities</span>
        </Link>
      </div>
    </main>
  )
}
