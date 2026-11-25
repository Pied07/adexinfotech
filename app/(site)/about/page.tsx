import Link from 'next/link'
import { ArrowUpRight, Compass, Target, Eye, Sparkles, Shield, Rocket } from 'lucide-react'
import { CTA, PageIntro, RichText } from '@/components/Blocks'
import { getSettings, mediaURL } from '@/lib/cms'

export default async function AboutPage() {
  const settings = await getSettings()
  const image = mediaURL(settings?.aboutImage) || process.env.NEXT_PUBLIC_ABOUT_IMAGE_URL
  const alt = typeof settings?.aboutImage === 'object' && settings.aboutImage ? settings.aboutImage.alt || 'The MARSMENT team at work' : 'MARSMENT Mission Headquarters'

  return (
    <main className="about-page">
      <PageIntro
        eyebrow="MISSION CONTROL • ABOUT MARSMENT"
        title={<>Precision Engineering.<br />Interplanetary Ambition.</>}
        text={settings?.tagline || 'A high-velocity digital partner forging web platforms, software systems, and growth marketing for ambitious brands.'}
      />

      <section className="about-feature container">
        <div className="about-feature-image" data-reveal>
          {image ? (
            <img src={image} alt={alt} />
          ) : (
            <div className="about-cosmic-frame">
              <div className="frame-glow" />
              <div className="frame-content">
                <Rocket size={48} className="text-orange" />
                <span>EXPEDITIONARY EXCELLENCE</span>
              </div>
            </div>
          )}
          <div className="image-telemetry-tag">
            <span className="dot-cyan" />
            <span>DISCIPLINED CREW. TECHNICAL MASTERY.</span>
          </div>
        </div>

        <div className="about-feature-copy" data-reveal>
          <div className="mars-eyebrow">
            <span className="eyebrow-beacon" />
            <span>THE FIRM</span>
          </div>
          <h2 className="section-title">
            Different disciplines.<br />
            <span className="text-mars">One relentless vector.</span>
          </h2>
          <RichText value={settings?.about} />
          {!settings?.about && (
            <div className="about-body-default">
              <p>
                MARSMENT was founded on a singular premise: modern enterprises cannot afford sluggish, generic digital assets. To command attention in an hyper-competitive marketplace, you require software and digital marketing engineered with the precision of aerospace telemetry.
              </p>
              <p>
                From custom full-stack web applications and scalable cloud backends to razor-sharp search optimization (SEO/GEO) and conversion-engineered marketing funnels, we remove guesswork and build digital engines that deliver sustainable commercial superiority.
              </p>
            </div>
          )}
          <div className="about-action-row">
            <Link className="button button-mars-quote" href="/contact">
              <span>Get a Quote / Meet the Crew</span>
              <ArrowUpRight size={15} />
            </Link>
            <Link className="button button-glass-cyan" href="/services">
              <span>View Capabilities</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Purpose / Pillars Section */}
      <section className="purpose-section">
        <div className="container purpose-heading" data-reveal>
          <div className="mars-eyebrow">
            <span className="eyebrow-beacon" />
            <span>OUR TRAJECTORY</span>
          </div>
          <h2 className="section-title">
            Clear directives.<br />
            <span className="text-mars">Measurable supremacy.</span>
          </h2>
        </div>
        <div className="container purpose-grid">
          <article className="purpose-card" data-reveal>
            <div className="purpose-card-head">
              <span className="purpose-step">01 / MISSION</span>
              <Target size={22} className="text-cyan" />
            </div>
            <h3 className="purpose-title">Accelerate human & commercial progress.</h3>
            <p className="purpose-desc">
              {settings?.mission || 'We empower forward-thinking organizations to achieve undisputed market leadership through robust custom engineering, distinct visual identity, and predictable customer acquisition channels.'}
            </p>
            <div className="card-border-glow" />
          </article>

          <article className="purpose-card" data-reveal>
            <div className="purpose-card-head">
              <span className="purpose-step">02 / VISION</span>
              <Eye size={22} className="text-orange" />
            </div>
            <h3 className="purpose-title">A modern web without compromise.</h3>
            <p className="purpose-desc">
              {settings?.vision || 'A digital reality where applications are blisteringly fast, identities are unmistakable, and every customer interaction generates compounded enterprise value.'}
            </p>
            <div className="card-border-glow" />
          </article>
        </div>
      </section>

      {/* Values Grid */}
      <section className="values-section">
        <div className="container">
          <div className="values-header" data-reveal>
            <div className="mars-eyebrow">
              <span className="eyebrow-beacon" />
              <span>CORE OPERATIONAL PRINCIPLES</span>
            </div>
            <h2 className="section-title">Built on unwavering standards.</h2>
          </div>
          <div className="values-grid">
            <article className="val-card" data-reveal>
              <div className="val-icon"><Shield size={20} className="text-cyan" /></div>
              <h3>Radical Craftsmanship</h3>
              <p>We do not cut corners. From database queries to responsive typography, every line of our work undergoes stringent review.</p>
            </article>
            <article className="val-card" data-reveal>
              <div className="val-icon"><Sparkles size={20} className="text-orange" /></div>
              <h3>Commercial Impact First</h3>
              <p>Aesthetics without conversions is vanity. Everything we build is tied directly to user engagement, sales pipelines, and business momentum.</p>
            </article>
            <article className="val-card" data-reveal>
              <div className="val-icon"><Rocket size={20} className="text-cyan" /></div>
              <h3>Speed & Decisiveness</h3>
              <p>Modern markets penalize delays. We prioritize tight delivery loops, agile sprints, and transparent communication.</p>
            </article>
            <article className="val-card" data-reveal>
              <div className="val-icon"><Compass size={20} className="text-orange" /></div>
              <h3>Transparent Telemetry</h3>
              <p>Zero black boxes. Real-time reporting, honest appraisals, and continuous support after deployment.</p>
            </article>
          </div>
        </div>
      </section>

      {/* Closer Callout */}
      <section className="about-closer container" data-reveal>
        <div className="closer-card">
          <div className="closer-copy">
            <div className="mars-eyebrow">
              <span className="eyebrow-beacon" />
              <span>COMMENCE COUNTDOWN</span>
            </div>
            <h2 className="closer-title">
              Ready to break atmospheric drag?<br />
              <span className="text-mars">Let’s engineer what’s next.</span>
            </h2>
            <p className="closer-desc">
              Join forward-looking brands that trust MARSMENT for digital development, systems design, and performance growth.
            </p>
          </div>
          <div className="closer-action">
            <Link className="button button-mars-quote" href="/contact">
              <span>Get a Quote / Launch</span>
              <ArrowUpRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      <CTA />
    </main>
  )
}
