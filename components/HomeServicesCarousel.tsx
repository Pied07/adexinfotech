'use client'

import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

export type HomeServiceItem = {
  href: string
  title: string
  category: string
  summary: string
  image?: string
}

function ServiceCards({ items, duplicate = false }: { items: HomeServiceItem[]; duplicate?: boolean }) {
  return (
    <div className="service-marquee-group" aria-hidden={duplicate || undefined}>
      {items.map((service, index) => (
        <Link
          href={service.href}
          className={`marquee-service-card marquee-card-${index % 5}`}
          key={`${duplicate ? 'duplicate-' : ''}${service.href}`}
          tabIndex={duplicate ? -1 : undefined}
        >
          <div className="marquee-service-image">
            {service.image ? (
              <img src={service.image} alt={service.title} loading="lazy" />
            ) : (
              <div className="service-img-circuit-fallback">
                <span>{service.title.split(/\s+/).slice(0, 2).map((w) => w[0]).join('')}</span>
              </div>
            )}
            <div className="service-badge-index">
              <span className="dot-cyan" />
              <span>{String(index + 1).padStart(2, '0')}</span>
            </div>
            <div className="service-corner-action" aria-hidden="true">
              <ArrowUpRight size={15} />
            </div>
          </div>
          <div className="marquee-service-copy">
            <span className="service-card-cat">{service.category}</span>
            <h3 className="service-card-title">{service.title}</h3>
            <p className="service-card-desc">{service.summary}</p>
          </div>
        </Link>
      ))}
    </div>
  )
}

export function HomeServicesCarousel({ services }: { services: HomeServiceItem[] }) {
  return (
    <div className="service-marquee" aria-label="Our capabilities, scrolling marquee">
      <div className="service-marquee-track">
        <ServiceCards items={services} />
        <ServiceCards items={services} duplicate />
      </div>
    </div>
  )
}
