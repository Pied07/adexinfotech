'use client'

import Link from 'next/link'

export type HomeServiceItem = {
  href: string
  title: string
  category: string
  summary: string
  image?: string
}

function ServiceCards({ items, duplicate = false }: { items: HomeServiceItem[]; duplicate?: boolean }) {
  return <div className="service-marquee-group" aria-hidden={duplicate || undefined}>
    {items.map((service, index) => <Link
      href={service.href}
      className={`marquee-service-card marquee-card-${index % 5}`}
      key={`${duplicate ? 'duplicate-' : ''}${service.href}`}
      tabIndex={duplicate ? -1 : undefined}
    >
      <div className="marquee-service-image">
        {service.image ? <img src={service.image} alt="" loading="lazy" /> : <span>{service.title.split(/\s+/).slice(0, 2).map((word) => word[0]).join('')}</span>}
        <small>{String(index + 1).padStart(2, '0')}</small>
        <b aria-hidden="true">↗</b>
      </div>
      <div className="marquee-service-copy"><span>{service.category}</span><h3>{service.title}</h3><p>{service.summary}</p></div>
    </Link>)}
  </div>
}

export function HomeServicesCarousel({ services }: { services: HomeServiceItem[] }) {
  return <div className="service-marquee" aria-label="Our services, scrolling carousel">
    <div className="service-marquee-track">
      <ServiceCards items={services} />
      <ServiceCards items={services} duplicate />
    </div>
  </div>
}
