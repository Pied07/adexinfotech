import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CTA, RichText } from '@/components/Blocks'
import { getService, mediaURL } from '@/lib/cms'
import { serviceSlug, starterServices } from '@/lib/starter-services'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const cmsService = await getService(slug)
  const starter = starterServices.find((item) => serviceSlug(item.title) === slug)
  const service = cmsService || (starter ? { ...starter, slug, image: undefined, description: undefined, seoTitle: undefined, seoDescription: undefined } : null)
  return service ? { title: service.seoTitle || service.title, description: service.seoDescription || service.summary } : {}
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const cmsService = await getService(slug)
  const starter = starterServices.find((item) => serviceSlug(item.title) === slug)
  const service = cmsService || (starter ? { ...starter, slug, image: undefined, description: undefined, seoTitle: undefined, seoDescription: undefined } : null)
  if (!service) notFound()
  const image = mediaURL(service.image) || process.env.NEXT_PUBLIC_SERVICE_IMAGE_URL
  const alt = typeof service.image === 'object' && service.image ? service.image.alt || service.title : service.title
  return <main className="service-detail-page">
    <section className="service-detail-hero"><div className="container">
      <Link href="/services" className="back-link">← ALL CAPABILITIES</Link>
      <div className="service-detail-grid"><div data-reveal><p className="eyebrow"><i /> {service.category || 'OUR SERVICES'}</p><h1>{service.title}<span>.</span></h1><p className="lead">{service.summary}</p><Link className="button button-blue" href="/contact">Let’s talk about it <span>↗</span></Link></div>
        <div className="service-detail-image" data-reveal>{image ? <img src={image} alt={alt} /> : <div className="photo-placeholder">{service.title}</div>}<span>THOUGHTFUL WORK. BUILT AROUND YOU.</span></div>
      </div>
    </div></section>
    <section className="service-detail-body container"><aside data-reveal><span>THE DETAILS</span><p>Thoughtful work,<br/>built around your goals.</p><Link className="editorial-link" href="/contact">Discuss a project <span>↗</span></Link></aside><div className="detail-rich" data-reveal><RichText value={service.description} />{!service.description && <p>{service.summary}</p>}</div></section>
    <CTA />
  </main>
}
