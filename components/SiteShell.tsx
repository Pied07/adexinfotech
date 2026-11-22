import Link from 'next/link'
import type { ReactNode } from 'react'
import { ArrowUpRight, MessageCircle } from 'lucide-react'
import { getSettings, mediaURL } from '@/lib/cms'
import { ScrollReveal } from '@/components/ScrollReveal'
import { MobileNav } from '@/components/MobileNav'

export async function SiteShell({ children }: { children: ReactNode }) {
  const settings = await getSettings()
  const name = settings?.businessName || process.env.NEXT_PUBLIC_BUSINESS_NAME || 'Adex Infotech'
  const tagline = settings?.tagline || process.env.NEXT_PUBLIC_TAGLINE || 'Ideas into impact.'
  const logo = mediaURL(settings?.logo)
  const whatsapp = settings?.whatsappNumber || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER
  return <>
    <div className="topline"><div className="container topline-inner"><span>{settings?.footerNote || tagline}</span><div>{settings?.phone && <a href={`tel:${settings.phone}`}>{settings.phone}</a>}{settings?.email && <a href={`mailto:${settings.email}`}>{settings.email}</a>}</div></div></div>
    <header className="site-header"><div className="container nav-wrap"><Link href="/" className="brand" aria-label={name}>{logo ? <img src={logo} alt={name} className="brand-logo"/> : <span className="brand-mark">A<span>.</span></span>}<span className="brand-copy"><strong>{name}</strong><small>{tagline}</small></span></Link><nav className="main-nav"><Link href="/services">Services</Link><Link href="/about">About</Link><Link href="/blog">Insights</Link><Link href="/contact">Contact</Link></nav><Link className="button button-blue nav-cta" href="/contact">Let's talk <ArrowUpRight aria-hidden="true" /></Link><MobileNav /></div></header>
    <ScrollReveal>{children}</ScrollReveal>
    <footer className="site-footer"><div className="container footer-top"><div><Link href="/" className="brand footer-brand">{logo?<img src={logo} alt={name} className="brand-logo"/>:<span className="brand-mark">A<span>.</span></span>}<span className="brand-copy"><strong>{name}</strong><small>{tagline}</small></span></Link><p>Creative thinking. Thoughtful technology.<br/>A clearer way forward.</p></div><div><h4>Explore</h4><Link href="/services">Our services</Link><Link href="/about">About us</Link><Link href="/blog">Ideas & insights</Link></div><div><h4>Get in touch</h4>{settings?.email && <a href={`mailto:${settings.email}`}>{settings.email}</a>}{settings?.phone && <a href={`tel:${settings.phone}`}>{settings.phone}</a>}{settings?.address && <p>{settings.address}</p>}<Link href="/contact">Request a consultation <ArrowUpRight aria-hidden="true" /></Link></div></div><div className="container footer-bottom"><span>© {new Date().getFullYear()} {name}. {settings?.footerNote || 'All rights reserved.'}</span><div><Link href="/privacy-policy">Privacy</Link><Link href="/terms">Terms</Link></div></div></footer>
    {whatsapp && <a className="whatsapp" href={`https://wa.me/${whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" aria-label="Enquire on WhatsApp"><MessageCircle aria-hidden="true" /><b>WhatsApp us</b></a>}
  </>
}


