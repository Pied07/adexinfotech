import Link from 'next/link'
import { ArrowDown, ArrowUpRight, Clock3, Sparkles } from 'lucide-react'
import { CTA } from '@/components/Blocks'
import { HomeServicesCarousel } from '@/components/HomeServicesCarousel'
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
  const name = settings?.businessName || process.env.NEXT_PUBLIC_BUSINESS_NAME || 'Adex Infotech'
  const heroImage = mediaURL(settings?.heroImage) || process.env.NEXT_PUBLIC_HERO_IMAGE_URL
  const aboutImage = mediaURL(settings?.aboutImage) || process.env.NEXT_PUBLIC_ABOUT_IMAGE_URL

  return <main>
    <section className="home-hero">
      <div className="container home-hero-grid">
        <div className="home-hero-copy" data-reveal>
          <p className="eyebrow"><i /> STRATEGY · CREATIVE · TECHNOLOGY</p>
          <h1>{settings?.heroTitle || 'Good ideas deserve'}<br/><span>{settings?.heroAccent || 'to go further.'}</span></h1>
          <p className="home-hero-description">{settings?.heroDescription || 'We turn ambitious ideas into brands, experiences and digital products that move business forward.'}</p>
          <div className="home-hero-actions"><Link href="/contact" className="button button-blue">Let's build something <ArrowUpRight aria-hidden="true" /></Link><Link className="hero-scroll-link" href="/services">Explore what we do <ArrowDown aria-hidden="true" /></Link></div>
          <div className="home-hero-foot"><span className="hero-line"/><span>Independent thinking.<br/>Connected execution.</span><span className="hero-index">01 <i>/</i> 04</span></div>
        </div>
        <div className="home-hero-image" data-reveal>
          {heroImage ? <img src={heroImage} alt={typeof settings?.heroImage === 'object' && settings.heroImage ? settings.heroImage.alt || 'Creative team collaborating around a screen' : 'Creative team collaborating around a screen'} /> : <div className="hero-image-placeholder"><span>YOUR NEXT<br/>BIG IDEA</span><b><ArrowUpRight aria-hidden="true" /></b></div>}
          <div className="hero-image-label"><span>01 — ADEX INFOTECH</span><span>Ideas into impact.</span></div>
          <div className="hero-float-card"><span className="float-mark"><Sparkles aria-hidden="true" /></span><div><b>Made to move you forward.</b><small>Digital, designed around your ambition.</small></div></div>
        </div>
      </div>
      <div className="hero-bottom-rule"><div className="container"><span>CLARITY IN THE COMPLEX</span><span>CRAFT IN EVERY DETAIL</span><span>GROWTH THAT KEEPS GOING</span></div></div>
    </section>

    <section className="home-intro section-pad">
      <div className="container home-intro-grid">
        <div data-reveal><p className="eyebrow"><i /> A PARTNER FOR WHAT'S NEXT</p><h2>We bring the<br/><span>whole picture</span><br/>into focus.</h2></div>
        <div className="home-intro-copy" data-reveal><p>Every business has a next chapter. {name} brings the right mix of imagination, expertise and follow-through to help you write it.</p><Link href="/about" className="editorial-link">Get to know us <ArrowUpRight aria-hidden="true" /></Link><div className="intro-index">01 <span>/</span> THE BIGGER PICTURE</div></div>
      </div>
    </section>

    <section className="home-services section-pad" id="services">
      <div className="container">
        <div className="home-section-heading" data-reveal><div><p className="eyebrow"><i /> WHAT WE BRING TO THE TABLE</p><h2>One team.<br/><span>Every advantage.</span></h2></div><p>From the first impression to the final conversion, we connect the pieces that make your business stronger.</p></div>
        <HomeServicesCarousel services={services.map((service, index) => ({
          href: `/services/${service.slug}`,
          title: service.title,
          category: service.category || 'Digital growth',
          summary: service.summary,
          image: mediaURL('image' in service ? service.image : undefined) || serviceImages[index % serviceImages.length] || process.env.NEXT_PUBLIC_SERVICE_IMAGE_URL,
        }))} />
        <div className="all-services-row" data-reveal><span>15 capabilities, one connected point of view.</span><Link className="editorial-link" href="/services">See all services <ArrowUpRight aria-hidden="true" /></Link></div>
      </div>
    </section>

    <section className="studio-section">
      <div className="studio-image" data-reveal>{aboutImage ? <img src={aboutImage} alt={typeof settings?.aboutImage === 'object' && settings.aboutImage ? settings.aboutImage.alt || 'Adex team at work' : 'A bright creative studio'} loading="lazy"/> : <div className="studio-placeholder"><span>GOOD WORK<br/>IS A TEAM SPORT.</span></div>}</div>
      <div className="studio-copy" data-reveal><p className="eyebrow eyebrow-light"><i /> A LITTLE ABOUT US</p><h2>Good work is<br/>a <span>team sport.</span></h2><p>We believe the best results come from bringing different minds around the same table. Curious by nature and serious about craft, we make the complex feel clear and the ambitious feel achievable.</p><Link className="studio-link" href="/about">Meet {name} <ArrowUpRight aria-hidden="true" /></Link><div className="studio-mark">A<span>+</span></div></div>
    </section>

    <section className="home-process section-pad">
      <div className="container"><div className="home-section-heading" data-reveal><div><p className="eyebrow"><i /> HOW WE MAKE IT HAPPEN</p><h2>Thoughtful at every<br/><span>turn of the journey.</span></h2></div><p>Clear thinking, considered craft and a commitment to outcomes that matter.</p></div>
        <div className="process-grid">
          {[['01','Get curious','We listen first, ask better questions and get to the heart of what needs to change.'],['02','Make a plan','We bring strategy and creative into the same conversation, then make the next step clear.'],['03','Make it real','We build, launch and keep improving together, with care in every detail.']].map(([n,title,text])=><article className="process-card" key={n} data-reveal><span className="process-number">{n}</span><div className="process-glyph">{n==='01'?<Clock3 aria-hidden="true"/>:n==='02'?<ArrowUpRight aria-hidden="true"/>:<Sparkles aria-hidden="true"/>}</div><h3>{title}</h3><p>{text}</p><span className="process-rule"/></article>)}
        </div>
      </div>
    </section>

    <section className="home-note" data-reveal><div className="container note-inner"><span className="note-spark"><Sparkles aria-hidden="true" /></span><p>Less noise.<br/><em>More momentum.</em></p><span className="note-side">A clearer way forward<br/>starts with a conversation.</span></div></section>
    <CTA />
  </main>
}


