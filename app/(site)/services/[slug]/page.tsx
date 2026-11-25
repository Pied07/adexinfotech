import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowUpRight, CheckCircle2, ShieldCheck, Zap, Sparkles } from 'lucide-react'
import { CTA, RichText } from '@/components/Blocks'
import { getService, mediaURL } from '@/lib/cms'
import { serviceSlug, starterServices } from '@/lib/starter-services'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const cmsService = await getService(slug)
  const starter = starterServices.find((item) => serviceSlug(item.title) === slug)
  const service = cmsService || (starter ? { ...starter, slug, image: undefined, description: undefined, secondDescription: undefined, seoTitle: undefined, seoDescription: undefined } : null)
  return service ? { title: service.seoTitle || `${service.title} | MARSMENT`, description: service.seoDescription || service.summary } : {}
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const cmsService = await getService(slug)
  const starter = starterServices.find((item) => serviceSlug(item.title) === slug)
  const service = cmsService || (starter ? { ...starter, slug, image: undefined, description: undefined, secondDescription: undefined, seoTitle: undefined, seoDescription: undefined } : null)
  if (!service) notFound()

  const image = mediaURL(service.image) || process.env.NEXT_PUBLIC_SERVICE_IMAGE_URL
  const alt = typeof service.image === 'object' && service.image ? service.image.alt || service.title : service.title

  return (
    <main className="service-detail-page">
      <section className="service-detail-hero">
        <div className="container">
          <Link href="/services" className="back-link">
            <ArrowLeft size={14} />
            <span>RETURN TO ALL CAPABILITIES</span>
          </Link>

          <div className="service-detail-grid">
            <div data-reveal className="detail-hero-left">
              <div className="mars-eyebrow">
                <span className="eyebrow-beacon" />
                <span>{service.category || 'CORE CAPABILITY'}</span>
              </div>
              <h1 className="detail-title">
                {service.title}<span className="text-mars">.</span>
              </h1>
              <p className="detail-lead">{service.summary}</p>
              
              <div className="detail-actions">
                <Link className="button button-mars-quote" href="/contact">
                  <span>Get a Quote for {service.title}</span>
                  <ArrowUpRight size={17} />
                </Link>
                <div className="detail-tag-cluster">
                  <span className="detail-tag"><Zap size={12} className="text-cyan" /> High Velocity</span>
                  <span className="detail-tag"><ShieldCheck size={12} className="text-orange" /> Enterprise Quality</span>
                </div>
              </div>
            </div>

            <div className="service-detail-image" data-reveal>
              {image ? (
                <img src={image} alt={alt} />
              ) : (
                <div className="detail-img-fallback">
                  <span>{service.title}</span>
                </div>
              )}
              <div className="detail-image-badge">
                <span className="dot-cyan" />
                <span>PRECISION IMPLEMENTATION</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Detail Content Section */}
      <section className="service-detail-body container">
        <aside data-reveal className="detail-sidebar">
          <div className="sidebar-card">
            <div className="sidebar-badge">
              <span>ENGAGEMENT SPECIFICATION</span>
            </div>
            <h3>Engineered around your commercial milestones.</h3>
            <p>
              Every MARSMENT engagement is managed with clear sprint cycles, dedicated project leadership, and measurable KPIs.
            </p>
            
            <div className="sidebar-checklist">
              <div className="check-item">
                <CheckCircle2 size={16} className="text-cyan" />
                <span>Custom architecture & delivery</span>
              </div>
              <div className="check-item">
                <CheckCircle2 size={16} className="text-cyan" />
                <span>Continuous communication & review</span>
              </div>
              <div className="check-item">
                <CheckCircle2 size={16} className="text-cyan" />
                <span>Post-launch support & optimization</span>
              </div>
            </div>

            <Link className="button button-mars-quote w-full mt-4" href="/contact">
              <span>Request Consultation</span>
              <ArrowUpRight size={15} />
            </Link>
          </div>
        </aside>

        <div className="detail-rich" data-reveal>
          <div className="rich-content-wrapper">
            <RichText value={service.description} highlightQuotes={false} />
            {!service.description && <p>{service.summary}</p>}
            {service.secondDescription && (
              <div className="detail-rich-second">
                <RichText value={service.secondDescription} />
              </div>
            )}
          </div>
        </div>
      </section>

      <CTA />
    </main>
  )
}
