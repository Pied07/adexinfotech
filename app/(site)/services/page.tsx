import Link from 'next/link'
import { getServices, getSettings, mediaURL } from '@/lib/cms'
import { CTA, PageIntro } from '@/components/Blocks'
import { serviceSlug, starterServices } from '@/lib/starter-services'

const photos = [process.env.NEXT_PUBLIC_SERVICE_IMAGE_ONE, process.env.NEXT_PUBLIC_SERVICE_IMAGE_TWO, process.env.NEXT_PUBLIC_SERVICE_IMAGE_THREE]

export default async function ServicesPage() {
  const [cmsServices, settings] = await Promise.all([getServices(), getSettings()])
  const services = cmsServices.length ? cmsServices : starterServices.map((service) => ({ ...service, slug: serviceSlug(service.title) }))
  return <main className="services-page">
    <PageIntro eyebrow="WHAT WE DO" title={<>The right expertise.<br />The right time.</>} text={settings?.heroDescription || 'Thoughtfully connected services, shaped around your ambitions and the people you serve.'} />
    <section className="services-editorial container"><div className="services-editorial-head" data-reveal><p className="eyebrow"><i /> OUR CAPABILITIES</p><p>Good work happens when the right disciplines work together. Explore the capabilities we bring to every brief.</p></div>
      <div className="services-photo-grid">{services.map((service, index) => {
        const serviceImage = 'image' in service ? service.image : undefined
        const image = mediaURL(serviceImage) || photos[index % photos.length] || process.env.NEXT_PUBLIC_SERVICE_IMAGE_URL
        const alt = typeof serviceImage === 'object' && serviceImage ? serviceImage.alt || service.title : service.title
        return <Link className="services-photo-card" href={`/services/${service.slug}`} key={service.slug} data-reveal style={{ '--card-delay': `${(index % 3) * 90}ms` } as React.CSSProperties}>
          <div className="services-photo">{image ? <img src={image} alt={alt} loading="lazy" /> : <div className="photo-placeholder">{service.title}</div>}<span className="service-number">{String(index + 1).padStart(2, '0')}</span><span className="service-open">↗</span></div>
          <div className="services-card-copy"><span>{service.category || 'Digital growth'}</span><h2>{service.title}</h2><p>{service.summary}</p></div>
        </Link>
      })}</div>
    </section>
    <CTA />
  </main>
}
