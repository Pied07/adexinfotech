import Link from 'next/link'
import type { ReactNode } from 'react'
import { ArrowUpRight, MessageCircle, Sparkles, Mail, Phone, MapPin } from 'lucide-react'
import { getSettings, mediaURL } from '@/lib/cms'
import { ScrollReveal } from '@/components/ScrollReveal'
import { MobileNav } from '@/components/MobileNav'
import { PageTransition } from '@/components/PageTransition'
// RocketLaunchExperienceClient is a 'use client' wrapper that loads the rocket
// with next/dynamic ssr:false — that flag is only allowed in Client Components.
import { RocketLaunchExperienceClient } from '@/components/RocketLaunchExperienceClient'
import { ConditionalReplayButton } from '@/components/ConditionalReplayButton'
import { FloatingWhatsApp } from '@/components/FloatingWhatsApp'

export async function SiteShell({ children }: { children: ReactNode }) {
  const settings = await getSettings()
  const name = settings?.businessName || process.env.NEXT_PUBLIC_BUSINESS_NAME || 'MARSMENT'
  const tagline = settings?.tagline || process.env.NEXT_PUBLIC_TAGLINE || 'Web • Development • Marketing'
  const logo = mediaURL(settings?.logo) || '/marsment-logo.jpg'
  const email = settings?.email || 'info@marsment.com'
  const phone = settings?.phone
  const address = settings?.address
  const whatsapp = settings?.whatsappNumber || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER

  return (
    <div className="mars-theme-root">
      {/* Full-Screen Interactive Rocket Launch Experience */}
      <RocketLaunchExperienceClient />

      {/* Space Topline */}
      <div className="topline">
        <div className="container topline-inner">
          <div className="topline-left">
            <span className="topline-tag">
              <span className="pulse-dot" />
              MISSION CONTROL
            </span>
            <span className="topline-note">{settings?.footerNote || 'EXPEDITION TO THE EXTRAORDINARY'}</span>
          </div>
          <div className="topline-right">
            <ConditionalReplayButton />
            {phone && (
              <a href={`tel:${phone}`} className="topline-contact-link">
                <Phone size={12} />
                <span>{phone}</span>
              </a>
            )}
            <a href={`mailto:${email}`} className="topline-contact-link">
              <Mail size={12} />
              <span>{email}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Futuristic Main Header */}
      <header className="site-header">
        <div className="container nav-wrap">
          <Link href="/" className="brand" aria-label={name}>
            <div className="brand-logo-frame">
              <img src={logo} alt={name} className="brand-logo-img" />
            </div>
            <div className="brand-copy">
              <strong className="brand-title">
                {name.toUpperCase() === 'MARSMENT' ? (
                  <>
                    <span className="brand-part-mars">MARS</span>
                    <span className="brand-part-ment">MENT</span>
                  </>
                ) : (
                  <span className="brand-part-mars">{name}</span>
                )}
              </strong>
              <small className="brand-sub">{tagline}</small>
            </div>
          </Link>

          <nav className="main-nav" aria-label="Main Navigation">
            <Link href="/" className="nav-item">
              <span>Home</span>
            </Link>
            <Link href="/services" className="nav-item">
              <span>Services</span>
            </Link>
            <Link href="/about" className="nav-item">
              <span>About</span>
            </Link>
            <Link href="/blog" className="nav-item">
              <span>Insights</span>
            </Link>
            <Link href="/contact" className="nav-item">
              <span>Contact</span>
            </Link>
          </nav>

          <div className="nav-actions">
            <Link className="button button-mars-quote nav-cta" href="/contact">
              <span>Get a Quote</span>
              <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
            <MobileNav />
          </div>
        </div>
      </header>

      {/* Smooth Page Transition & Scroll Reveal */}
      <PageTransition>
        <ScrollReveal>
          {children}
        </ScrollReveal>
      </PageTransition>

      {/* Redesigned Futuristic Site Footer */}
      <footer className="site-footer">
        <div className="footer-ambient-glow" />
        <div className="container footer-top">
          <div className="footer-brand-col">
            <Link href="/" className="brand footer-brand">
              <div className="brand-logo-frame">
                <img src={logo} alt={name} className="brand-logo-img" />
              </div>
              <div className="brand-copy">
                <strong className="brand-title">
                  {name.toUpperCase() === 'MARSMENT' ? (
                    <>
                      <span className="brand-part-mars">MARS</span>
                      <span className="brand-part-ment">MENT</span>
                    </>
                  ) : (
                    <span className="brand-part-mars">{name}</span>
                  )}
                </strong>
                <small className="brand-sub">{tagline}</small>
              </div>
            </Link>
            <p className="footer-mission-statement">
              {settings?.heroDescription || 'Deep-space precision engineering for modern brands. We forge web solutions, custom digital architectures, and aggressive growth marketing that propel businesses beyond conventional boundaries.'}
            </p>
            <div className="footer-mars-badge">
              <span className="badge-orbit" />
              <span>STATION: MARS HEADQUARTERS</span>
            </div>
          </div>

          <div className="footer-links-col">
            <h4>Capabilities</h4>
            <Link href="/services/website-development">Website Development</Link>
            <Link href="/services/saas">SaaS Systems</Link>
            <Link href="/services/ai-ml">AI & Machine Learning</Link>
            <Link href="/services/digital-marketing">Digital Marketing</Link>
            <Link href="/services/seo-and-geo">SEO & GEO Optimization</Link>
            <Link href="/services">View All 15 Services →</Link>
          </div>

          <div className="footer-links-col">
            <h4>Company</h4>
            <Link href="/about">About MARSMENT</Link>
            <Link href="/blog">Transmission Insights</Link>
            <Link href="/contact">Contact Mission Control</Link>
            <Link href="/privacy-policy">Privacy Policy</Link>
            <Link href="/terms">Terms & Conditions</Link>
          </div>

          <div className="footer-contact-col">
            <h4>Direct Channel</h4>
            <a href={`mailto:${email}`} className="footer-contact-row">
              <Mail size={15} className="text-cyan" />
              <span>{email}</span>
            </a>
            {phone && (
              <a href={`tel:${phone}`} className="footer-contact-row">
                <Phone size={15} className="text-cyan" />
                <span>{phone}</span>
              </a>
            )}
            {address && (
              <div className="footer-contact-row">
                <MapPin size={15} className="text-cyan" />
                <span>{address}</span>
              </div>
            )}
            <Link href="/contact" className="button button-mars-quote footer-cta">
              <span>Initiate Project</span>
              <ArrowUpRight size={14} aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div className="container footer-bottom">
          <div className="footer-copyright">
            <span>© {new Date().getFullYear()} {name}. {settings?.footerNote || 'All systems operational.'}</span>
            <span className="footer-divider">•</span>
            <span>Email: <a href={`mailto:${email}`} className="text-cyan">{email}</a></span>
          </div>
          <div className="footer-legal-links">
            <Link href="/privacy-policy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/contact">Support</Link>
          </div>
        </div>
      </footer>

      {/* Floating Draggable WhatsApp Contact */}
      {whatsapp && <FloatingWhatsApp phone={whatsapp} />}
    </div>
  )
}
