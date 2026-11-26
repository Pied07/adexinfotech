import Link from 'next/link'
import { ArrowUpRight, Sparkles, Filter, CheckCircle2 } from 'lucide-react'
import { getServices, getSettings, mediaURL } from '@/lib/cms'
import { CTA, PageIntro } from '@/components/Blocks'
import { serviceSlug, starterServices } from '@/lib/starter-services'

const photos = [
  process.env.NEXT_PUBLIC_SERVICE_IMAGE_ONE,
  process.env.NEXT_PUBLIC_SERVICE_IMAGE_TWO,
  process.env.NEXT_PUBLIC_SERVICE_IMAGE_THREE,
]

export default async function ServicesPage() {
  const [cmsServices, rawSettings] = await Promise.all([getServices(), getSettings()])
  const settings = rawSettings as Record<string, unknown> | null
  const services = cmsServices.length ? cmsServices : starterServices.map((service) => ({ ...service, slug: serviceSlug(service.title) }))

  return (
    <main className="services-page">
      <PageIntro
        eyebrow={(settings?.servicesPageEyebrow as string) || 'CAPABILITIES & SYSTEMS • MARSMENT'}
        title={<>{(settings?.servicesPageTitle as string) || 'Specialized Disciplines.'}<br />{(settings?.servicesPageAccent as string) || 'Singular Mastery.'}</>}
        text={(settings?.servicesPageSubtitle as string) || (settings?.heroDescription as string) || 'Fifteen battle-tested technical and growth capabilities, unified under one relentless engineering standard.'}
      />

      <section className="services-editorial container">
        {/* Capability Head Filter Indicator */}
        <div className="services-editorial-head" data-reveal>
          <div className="head-left">
            <div className="mars-eyebrow">
              <span className="eyebrow-beacon" />
              <span>THE ARSENAL</span>
            </div>
            <h2 className="section-title">{(settings?.servicesEditorialTitle as string) || 'Built for Velocity & Conversion'}</h2>
          </div>
          <div className="head-right">
            <p>
              {(settings?.servicesEditorialDescription as string) || 'Whether deploying high-load SaaS platforms, revamping visual brands, or orchestrating generative search & omnichannel ad campaigns, our capabilities scale seamlessly with your ambition.'}
            </p>
            <div className="service-category-pills">
              <span className="cat-pill pill-tech">Technology</span>
              <span className="cat-pill pill-growth">Growth</span>
              <span className="cat-pill pill-creative">Creative</span>
            </div>
          </div>
        </div>

        {/* 15 Services Grid */}
        <div className="services-photo-grid">
          {services.map((service, index) => {
            const serviceImage = 'image' in service ? service.image : undefined
            const image = mediaURL(serviceImage) || photos[index % photos.length] || process.env.NEXT_PUBLIC_SERVICE_IMAGE_URL
            const alt = typeof serviceImage === 'object' && serviceImage ? serviceImage.alt || service.title : service.title
            const category = service.category || 'Technology'

            return (
              <Link
                className="services-photo-card"
                href={`/services/${service.slug}`}
                key={service.slug}
                data-reveal
                style={{ '--card-delay': `${(index % 3) * 80}ms` } as React.CSSProperties}
              >
                <div className="services-photo">
                  {image ? (
                    <img src={image} alt={alt} loading="lazy" />
                  ) : (
                    <div className="service-fallback-circuit">
                      <span>{service.title}</span>
                    </div>
                  )}
                  <div className="service-overlay-gradient" />
                  <span className="service-number">{String(index + 1).padStart(2, '0')}</span>
                  <span className="service-open-btn" aria-hidden="true">
                    <ArrowUpRight size={17} />
                  </span>
                </div>

                <div className="services-card-copy">
                  <div className="card-top-meta">
                    <span className={`service-cat-badge badge-${category.toLowerCase()}`}>
                      {category}
                    </span>
                    <span className="service-status-pill">Active</span>
                  </div>
                  <h3 className="service-title">{service.title}</h3>
                  <p className="service-card-summary">{service.summary}</p>
                  
                  <div className="service-card-footer">
                    <span className="view-details-link">
                      <span>Explore Capability</span>
                      <ArrowUpRight size={14} />
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Custom Solution Callout */}
      <section className="custom-solution-section container" data-reveal>
        <div className="custom-solution-card">
          <div className="solution-copy">
            <div className="mars-eyebrow">
              <span className="eyebrow-beacon" />
              <span>CUSTOM SPECIFICATIONS</span>
            </div>
            <h2>{(settings?.customSolutionTitle as string) || 'Need a tailored multi-discipline engagement?'}</h2>
            <p>
              {(settings?.customSolutionDescription as string) || 'Most enterprise projects require an orchestrated mix of web engineering, CRM automation, and targeted lead generation. We build dedicated project squads shaped around your exact metrics.'}
            </p>
          </div>
          <div className="solution-action">
            <Link href="/contact" className="button button-mars-quote">
              <span>Get a Quote / Custom Scope</span>
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <CTA />
    </main>
  )
}
