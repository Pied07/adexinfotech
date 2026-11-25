import Link from 'next/link'
import { ArrowDown, ArrowUpRight, Compass, Shield, Zap, Sparkles, Terminal, Activity, Layers, Rocket } from 'lucide-react'
import { CTA } from '@/components/Blocks'
import { HomeServicesCarousel } from '@/components/HomeServicesCarousel'
import { AnimatedCounter } from '@/components/AnimatedCounter'
import { HeroMarsGlobe } from '@/components/HeroMarsGlobe'
import { getServices, getSettings, mediaURL } from '@/lib/cms'
import { serviceSlug, starterServices } from '@/lib/starter-services'

const serviceImages = [
  process.env.NEXT_PUBLIC_SERVICE_IMAGE_ONE,
  process.env.NEXT_PUBLIC_SERVICE_IMAGE_TWO,
  process.env.NEXT_PUBLIC_SERVICE_IMAGE_THREE,
]

export default async function Home() {
  const [settings, cmsServices] = await Promise.all([getSettings(), getServices(15)])
  const services = cmsServices.length ? cmsServices : starterServices.map((service) => ({ ...service, slug: serviceSlug(service.title) }))
  const name = settings?.businessName || process.env.NEXT_PUBLIC_BUSINESS_NAME || 'MARSMENT'
  const heroImage = mediaURL(settings?.heroImage) || process.env.NEXT_PUBLIC_HERO_IMAGE_URL
  const aboutImage = mediaURL(settings?.aboutImage) || process.env.NEXT_PUBLIC_ABOUT_IMAGE_URL
  const logo = mediaURL(settings?.logo)

  return (
    <main className="home-mars-page">
      {/* Hero Section */}
      <section className="home-hero">
        <div className="hero-cosmic-bg">
          <div className="hero-star-particles" />
          <div className="hero-mars-glow" />
          <div className="hero-grid-mesh" />
        </div>

        <div className="container home-hero-grid">
          <div className="home-hero-copy" data-reveal>
            <div className="mars-eyebrow">
              <span className="eyebrow-beacon" />
              <span>MISSION BRIEFING • EXPEDITION 01</span>
            </div>

            <h1 className="hero-title">
              Engineering <span className="text-white">Velocity</span><br />
              <span className="text-mars">Beyond Boundaries.</span>
            </h1>

            <p className="home-hero-description">
              {settings?.heroDescription || 'We architect resilient web applications, intelligent software ecosystems, and high-impact growth marketing designed to conquer new frontiers.'}
            </p>

            <div className="home-hero-actions">
              <Link href="/contact" className="button button-mars-quote hero-cta">
                <span>Get a Quote</span>
                <ArrowUpRight size={17} aria-hidden="true" />
              </Link>
              <Link className="button button-glass-cyan hero-secondary-btn" href="/services">
                <span>Explore Capabilities</span>
                <ArrowDown size={15} aria-hidden="true" />
              </Link>
            </div>

            <div className="home-hero-foot">
              <div className="hero-telemetry-tag">
                <span className="tag-dot" />
                <span>ORBITAL SPEED: 11.2 KM/S</span>
              </div>
              <span className="hero-foot-sep">/</span>
              <span className="hero-foot-motto">Precision Strategy. Interplanetary Impact.</span>
            </div>
          </div>

          <div className="home-hero-visual" data-reveal>
            {/* High-Tech Mars Hologram / Planet Presentation */}
            <div className="mars-planet-orb-wrap">
              <div className="mars-orb-atmosphere" />
              <div className="mars-orb-core">
                <HeroMarsGlobe />
              </div>

              {/* Orbital Ring Data Overlay (Phobos on outer orbit, Deimos on inner orbit) */}
              <div className="orb-ring ring-outer">
                <span className="orbit-node node-1" />
              </div>
              <div className="orb-ring ring-inner">
                <span className="orbit-node node-2" />
              </div>

              {/* Telemetry Floating Glass Badges */}
              <div className="hero-floating-stat stat-top-left">
                <Zap size={14} className="text-cyan" />
                <div>
                  <strong>99.98%</strong>
                  <small>System Reliability</small>
                </div>
              </div>

              <div className="hero-floating-stat stat-bottom-right">
                <Shield size={14} className="text-orange" />
                <div>
                  <strong>JEZERO BASE</strong>
                  <small>Digital Headquarters</small>
                </div>
              </div>

              <div className="hero-image-label">
                <span>MISSION: MARSMENT 2026</span>
                <span>DESTINATION: MARS</span>
              </div>
            </div>
          </div>
        </div>

        {/* Ticker / Horizon Bar */}
        <div className="hero-bottom-rule">
          <div className="container hero-ticker-inner">
            <span className="ticker-item"><span className="dot-cyan" /> FULL-STACK ARCHITECTURE</span>
            <span className="ticker-item"><span className="dot-orange" /> SAAS SYSTEMS</span>
            <span className="ticker-item"><span className="dot-cyan" /> AI & MACHINE LEARNING</span>
            <span className="ticker-item"><span className="dot-orange" /> PERFORMANCE MARKETING</span>
            <span className="ticker-item"><span className="dot-cyan" /> SEARCH OPTIMIZATION</span>
          </div>
        </div>
      </section>

      {/* Brand Intro Section */}
      <section className="home-intro section-pad">
        <div className="container home-intro-grid">
          <div data-reveal>
            <div className="mars-eyebrow">
              <span className="eyebrow-beacon" />
              <span>THE MARSMENT STANDARD</span>
            </div>
            <h2 className="section-title">
              We bring the<br />
              <span className="text-mars">whole mission</span><br />
              into focus.
            </h2>
          </div>
          <div className="home-intro-copy" data-reveal>
            <p className="body-lead">
              Every ambitious venture demands an extraordinary leap. {name} fuses bold visual identity, state-of-the-art engineering, and razor-sharp market traction to propel your company far ahead of the competition.
            </p>
            <div className="intro-metrics-row">
              <div className="metric-cell">
                <AnimatedCounter target={15} suffix="+" className="text-white" />
                <span>Specialized Capabilities</span>
              </div>
              <div className="metric-cell">
                <AnimatedCounter target={100} suffix="%" className="text-cyan" />
                <span>Custom Built Code</span>
              </div>
              <div className="metric-cell">
                <AnimatedCounter target={24} suffix="/7" className="text-orange" />
                <span>Mission Telemetry</span>
              </div>
            </div>
            <Link href="/about" className="editorial-link">
              <span>Read the MARSMENT Manifesto</span>
              <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* Capabilities / Services Section */}
      <section className="home-services section-pad" id="services">
        <div className="services-ambient-glow" />
        <div className="container">
          <div className="home-section-heading" data-reveal>
            <div>
              <div className="mars-eyebrow">
                <span className="eyebrow-beacon" />
                <span>CAPABILITIES IN ORBIT</span>
              </div>
              <h2 className="section-title">
                One unified crew.<br />
                <span className="text-mars">Every technical advantage.</span>
              </h2>
            </div>
            <p className="section-subtitle">
              From initial atmospheric lift-off to planetary dominance, our interdisciplinary capabilities deliver unwavering speed, security and measurable business growth.
            </p>
          </div>

          <HomeServicesCarousel
            services={services.map((service, index) => ({
              href: `/services/${service.slug}`,
              title: service.title,
              category: service.category || 'Digital growth',
              summary: service.summary,
              image: mediaURL('image' in service ? service.image : undefined) || serviceImages[index % serviceImages.length] || process.env.NEXT_PUBLIC_SERVICE_IMAGE_URL,
            }))}
          />

          <div className="all-services-row" data-reveal>
            <span className="text-muted">15 specialized capabilities engineered for modern digital supremacy.</span>
            <Link className="button button-mars-quote" href="/services">
              <span>Inspect All Capabilities</span>
              <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* Studio / Philosophy Section */}
      <section className="studio-section">
        <div className="studio-image-col" data-reveal>
          {aboutImage ? (
            <img src={aboutImage} alt="MARSMENT Team Engineering Room" loading="lazy" />
          ) : (
            <div className="studio-cosmic-fallback">
              <div className="studio-grid-lines" />
              <span>ENGINEERED FOR THE UNCHARTED</span>
            </div>
          )}
          <div className="studio-img-badge">
            <span className="dot-cyan" />
            <span>MISSION CONTROL ROOM</span>
          </div>
        </div>

        <div className="studio-copy-col" data-reveal>
          <div className="mars-eyebrow">
            <span className="eyebrow-beacon" />
            <span>MISSION ETHOS</span>
          </div>
          <h2 className="section-title">
            Groundbreaking work is<br />
            an <span className="text-mars">orbital discipline.</span>
          </h2>
          <p className="studio-paragraph">
            We operate at the nexus of imaginative design and battle-tested engineering. By removing friction, automating repetitive bottlenecks, and crafting breathtaking user touchpoints, we transform complex enterprise challenges into clear, unstoppable momentum.
          </p>
          <div className="studio-highlights-list">
            <div className="highlight-item">
              <span className="highlight-icon"><Sparkles size={16} /></span>
              <div>
                <strong>Zero Template Compromise</strong>
                <small>Bespoke architectures precision-tailored to your exact business objectives.</small>
              </div>
            </div>
            <div className="highlight-item">
              <span className="highlight-icon"><Terminal size={16} /></span>
              <div>
                <strong>High Velocity Deployment</strong>
                <small>Rapid iteration cycles that get your solution into orbit faster.</small>
              </div>
            </div>
          </div>
          <Link className="studio-action-link" href="/about">
            <span>Explore Our Trajectory</span>
            <ArrowUpRight size={15} aria-hidden="true" />
          </Link>
        </div>
      </section>

      {/* 4-Stage Launch Protocol Process Section */}
      <section className="home-process section-pad">
        <div className="container">
          <div className="home-section-heading" data-reveal>
            <div>
              <div className="mars-eyebrow">
                <span className="eyebrow-beacon" />
                <span>FLIGHT PROTOCOL</span>
              </div>
              <h2 className="section-title">
                The four stages of<br />
                <span className="text-mars">interplanetary execution.</span>
              </h2>
            </div>
            <p className="section-subtitle">
              A transparent, battle-tested launch sequence from initial recon to sustainable orbital velocity.
            </p>
          </div>

          <div className="process-grid">
            {[
              {
                step: 'STAGE 01',
                title: 'Recon & Strategy',
                icon: Compass,
                desc: 'We map competitive terrain, interrogate core requirements, and define rigorous technical telemetry before a single line of code is committed.',
              },
              {
                step: 'STAGE 02',
                title: 'Architecture & Design',
                icon: Layers,
                desc: 'Systems are drafted with obsessive precision. We construct ergonomic UI systems, rock-solid database schemas, and lightning-fast user pathways.',
              },
              {
                step: 'STAGE 03',
                title: 'Propulsion & Build',
                icon: Rocket,
                desc: 'Our engineers synthesize full-stack solutions, integrate third-party APIs, configure secure infrastructure, and stress-test performance.',
              },
              {
                step: 'STAGE 04',
                title: 'Orbit & Expansion',
                icon: Activity,
                desc: 'Flawless production launch followed by data-driven search optimization, paid media acceleration, and continuous feature evolution.',
              },
            ].map(({ step, title, icon: Icon, desc }, i) => (
              <article className="process-card" key={step} data-reveal style={{ '--card-delay': `${i * 90}ms` } as React.CSSProperties}>
                <div className="process-card-top">
                  <span className="process-step-badge">{step}</span>
                  <div className="process-card-icon">
                    <Icon size={20} />
                  </div>
                </div>
                <h3 className="process-card-title">{title}</h3>
                <p className="process-card-desc">{desc}</p>
                <div className="process-card-glow-bar" />
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Cosmic Note / Transmission Banner */}
      <section className="home-note" data-reveal>
        <div className="note-cosmic-glow" />
        <div className="container note-inner">
          <div className="note-left">
            <span className="note-spark">
              <Sparkles size={28} className="text-cyan" />
            </span>
            <p className="note-headline">
              Less static.<br />
              <em className="text-mars">Maximum velocity.</em>
            </p>
          </div>
          <div className="note-right">
            <span className="note-side-label">MARS TRANSMISSION 01</span>
            <p className="note-side-copy">
              A clearer trajectory begins with a direct transmission.<br />
              Our launchpad is primed for your project.
            </p>
            <Link href="/contact" className="button button-mars-quote">
              <span>Initiate Transmission</span>
              <ArrowUpRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* Global Call to Action */}
      <CTA />
    </main>
  )
}
