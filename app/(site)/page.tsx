import Link from 'next/link'
import { ArrowDown, ArrowUpRight, Compass, Shield, Zap, Sparkles, Terminal, Activity, Layers, Rocket } from 'lucide-react'
import { CTA } from '@/components/Blocks'
import { HomeServicesCarousel } from '@/components/HomeServicesCarousel'
import { AnimatedCounter } from '@/components/AnimatedCounter'
import { HeroMarsGlobe } from '@/components/HeroMarsGlobe'
import { CertificateBadges, type CertificateItem } from '@/components/CertificateBadges'
import { getServices, getSettings, mediaURL } from '@/lib/cms'
import { serviceSlug, starterServices } from '@/lib/starter-services'

const serviceImages = [
  process.env.NEXT_PUBLIC_SERVICE_IMAGE_ONE,
  process.env.NEXT_PUBLIC_SERVICE_IMAGE_TWO,
  process.env.NEXT_PUBLIC_SERVICE_IMAGE_THREE,
]

export default async function Home() {
  const [rawSettings, cmsServices] = await Promise.all([getSettings(), getServices(15)])
  const settings = rawSettings as Record<string, unknown> | null
  const services = cmsServices.length ? cmsServices : starterServices.map((service) => ({ ...service, slug: serviceSlug(service.title) }))
  const name = (settings?.businessName as string) || process.env.NEXT_PUBLIC_BUSINESS_NAME || 'MARSMENT'
  const aboutImage = mediaURL(settings?.aboutImage) || process.env.NEXT_PUBLIC_ABOUT_IMAGE_URL
  const certificates = (settings?.certificates as CertificateItem[] | undefined) || undefined

  const tickerItems =
    Array.isArray(settings?.heroTickerItems) && settings.heroTickerItems.length
      ? (settings.heroTickerItems as Array<{ label?: string }>).map((t) => t.label || '').filter(Boolean)
      : [
          'FULL-STACK ARCHITECTURE',
          'SAAS SYSTEMS',
          'AI & MACHINE LEARNING',
          'PERFORMANCE MARKETING',
          'SEARCH OPTIMIZATION',
        ]

  const introMetrics =
    Array.isArray(settings?.introMetrics) && settings.introMetrics.length
      ? (settings.introMetrics as Array<{ value?: number; suffix?: string; label?: string }>)
      : [
          { value: 15, suffix: '+', label: 'Specialized Capabilities' },
          { value: 100, suffix: '%', label: 'Custom Built Code' },
          { value: 24, suffix: '/7', label: 'Mission Telemetry' },
        ]

  const studioHighlights =
    Array.isArray(settings?.studioHighlights) && settings.studioHighlights.length
      ? (settings.studioHighlights as Array<{ title?: string; description?: string }>)
      : [
          {
            title: 'Zero Template Compromise',
            description: 'Bespoke architectures precision-tailored to your exact business objectives.',
          },
          {
            title: 'High Velocity Deployment',
            description: 'Rapid iteration cycles that get your solution into orbit faster.',
          },
        ]

  const processStageIcons = [Compass, Layers, Rocket, Activity]
  const processStages =
    Array.isArray(settings?.processStages) && settings.processStages.length
      ? (settings.processStages as Array<{ step?: string; title?: string; description?: string }>)
      : [
          {
            step: 'STAGE 01',
            title: 'Recon & Strategy',
            description: 'We map competitive terrain, interrogate core requirements, and define rigorous technical telemetry before a single line of code is committed.',
          },
          {
            step: 'STAGE 02',
            title: 'Architecture & Design',
            description: 'Systems are drafted with obsessive precision. We construct ergonomic UI systems, rock-solid database schemas, and lightning-fast user pathways.',
          },
          {
            step: 'STAGE 03',
            title: 'Propulsion & Build',
            description: 'Our engineers synthesize full-stack solutions, integrate third-party APIs, configure secure infrastructure, and stress-test performance.',
          },
          {
            step: 'STAGE 04',
            title: 'Orbit & Expansion',
            description: 'Flawless production launch followed by data-driven search optimization, paid media acceleration, and continuous feature evolution.',
          },
        ]

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
              <span>{(settings?.heroEyebrow as string) || 'MISSION BRIEFING • EXPEDITION 01'}</span>
            </div>

            <h1 className="hero-title">
              {(settings?.heroTitle as string) || <>Engineering <span className="text-white">Velocity</span></>}<br />
              <span className="text-mars">{(settings?.heroAccent as string) || 'Beyond Boundaries.'}</span>
            </h1>

            <p className="home-hero-description">
              {(settings?.heroDescription as string) || 'We architect resilient web applications, intelligent software ecosystems, and high-impact growth marketing designed to conquer new frontiers.'}
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
              <CertificateBadges certificates={certificates} variant="hero" />
              <span className="hero-foot-sep">/</span>
              <div className="hero-telemetry-tag">
                <span className="tag-dot" />
                <span>{(settings?.heroOrbitalSpeed as string) || 'ORBITAL SPEED: 11.2 KM/S'}</span>
              </div>
              <span className="hero-foot-sep">/</span>
              <span className="hero-foot-motto">{(settings?.heroMotto as string) || 'Precision Strategy. Interplanetary Impact.'}</span>
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
            {tickerItems.map((item, idx) => (
              <span className="ticker-item" key={idx}>
                <span className={idx % 2 === 0 ? 'dot-cyan' : 'dot-orange'} /> {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Intro Section */}
      <section className="home-intro section-pad">
        <div className="container home-intro-grid">
          <div data-reveal>
            <div className="mars-eyebrow">
              <span className="eyebrow-beacon" />
              <span>{(settings?.introEyebrow as string) || `THE ${name.toUpperCase()} STANDARD`}</span>
            </div>
            <h2 className="section-title">
              {(settings?.introTitle as string) || 'We bring the'}<br />
              <span className="text-mars">{(settings?.introAccent as string) || 'whole mission'}</span><br />
              {(settings?.introTitleEnd as string) || 'into focus.'}
            </h2>
          </div>
          <div className="home-intro-copy" data-reveal>
            <p className="body-lead">
              {(settings?.introLead as string) || `Every ambitious venture demands an extraordinary leap. ${name} fuses bold visual identity, state-of-the-art engineering, and razor-sharp market traction to propel your company far ahead of the competition.`}
            </p>
            <div className="intro-metrics-row">
              {introMetrics.map((m, idx) => (
                <div className="metric-cell" key={idx}>
                  <AnimatedCounter
                    target={Number(m.value ?? 0)}
                    suffix={m.suffix || ''}
                    className={idx === 0 ? 'text-white' : idx === 1 ? 'text-cyan' : 'text-orange'}
                  />
                  <span>{m.label}</span>
                </div>
              ))}
            </div>
            <Link href="/about" className="editorial-link">
              <span>Read the {name} Manifesto</span>
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
                <span>{(settings?.servicesEyebrow as string) || 'CAPABILITIES IN ORBIT'}</span>
              </div>
              <h2 className="section-title">
                {(settings?.servicesHeading as string) || 'One unified crew.'}<br />
                <span className="text-mars">{(settings?.servicesHeadingAccent as string) || 'Every technical advantage.'}</span>
              </h2>
            </div>
            <p className="section-subtitle">
              {(settings?.servicesSubtitle as string) || 'From initial atmospheric lift-off to planetary dominance, our interdisciplinary capabilities deliver unwavering speed, security and measurable business growth.'}
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
            <span>{(settings?.studioEyebrow as string) || 'MISSION ETHOS'}</span>
          </div>
          <h2 className="section-title">
            {(settings?.studioHeading as string) || 'Groundbreaking work is'}<br />
            <span className="text-mars">{(settings?.studioHeadingAccent as string) || 'an orbital discipline.'}</span>
          </h2>
          <p className="studio-paragraph">
            {(settings?.studioDescription as string) || 'We operate at the nexus of imaginative design and battle-tested engineering. By removing friction, automating repetitive bottlenecks, and crafting breathtaking user touchpoints, we transform complex enterprise challenges into clear, unstoppable momentum.'}
          </p>
          <div className="studio-highlights-list">
            {studioHighlights.map((item, idx) => (
              <div className="highlight-item" key={idx}>
                <span className="highlight-icon">
                  {idx % 2 === 0 ? <Sparkles size={16} /> : <Terminal size={16} />}
                </span>
                <div>
                  <strong>{item.title}</strong>
                  <small>{item.description}</small>
                </div>
              </div>
            ))}
            <div className="highlight-item">
              <CertificateBadges certificates={certificates} variant="full" />
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
                <span>{(settings?.processEyebrow as string) || 'FLIGHT PROTOCOL'}</span>
              </div>
              <h2 className="section-title">
                {(settings?.processHeading as string) || 'The four stages of'}<br />
                <span className="text-mars">{(settings?.processHeadingAccent as string) || 'interplanetary execution.'}</span>
              </h2>
            </div>
            <p className="section-subtitle">
              {(settings?.processSubtitle as string) || 'A transparent, battle-tested launch sequence from initial recon to sustainable orbital velocity.'}
            </p>
          </div>

          <div className="process-grid">
            {processStages.map((stageItem, i) => {
              const Icon = processStageIcons[i % processStageIcons.length]
              return (
                <article className="process-card" key={stageItem.step || i} data-reveal style={{ '--card-delay': `${i * 90}ms` } as React.CSSProperties}>
                  <div className="process-card-top">
                    <span className="process-step-badge">{stageItem.step}</span>
                    <div className="process-card-icon">
                      <Icon size={20} />
                    </div>
                  </div>
                  <h3 className="process-card-title">{stageItem.title}</h3>
                  <p className="process-card-desc">{stageItem.description}</p>
                  <div className="process-card-glow-bar" />
                </article>
              )
            })}
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
              {(settings?.transmissionHeadline as string) || 'Less static.'}<br />
              <em className="text-mars">{(settings?.transmissionAccent as string) || 'Maximum velocity.'}</em>
            </p>
          </div>
          <div className="note-right">
            <span className="note-side-label">{(settings?.transmissionLabel as string) || 'MARS TRANSMISSION 01'}</span>
            <p className="note-side-copy">
              {(settings?.transmissionCopy as string) || 'A clearer trajectory begins with a direct transmission. Our launchpad is primed for your project.'}
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
