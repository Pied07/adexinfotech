import Link from 'next/link'
import { CTA, PageIntro, RichText } from '@/components/Blocks'
import { getSettings, mediaURL } from '@/lib/cms'

export default async function AboutPage() {
  const settings = await getSettings()
  const image = mediaURL(settings?.aboutImage) || process.env.NEXT_PUBLIC_ABOUT_IMAGE_URL
  const alt = typeof settings?.aboutImage === 'object' && settings.aboutImage ? settings.aboutImage.alt || 'The Adex team at work' : 'A collaborative creative workspace'
  return <main className="about-page">
    <PageIntro eyebrow="THE PEOPLE BEHIND THE PROGRESS" title={<>Good work starts with<br />good understanding.</>} text={settings?.tagline || 'A digital partner for brands ready to move forward.'} />
    <section className="about-feature container">
      <div className="about-feature-image" data-reveal>{image ? <img src={image} alt={alt} /> : <div className="photo-placeholder">A clearer point of view.</div>}<span>CURIOUS MINDS. CONSIDERED WORK.</span></div>
      <div className="about-feature-copy" data-reveal><p className="eyebrow"><i /> OUR COMPANY</p><h2>Different skills.<br/><span>Shared ambition.</span></h2><RichText value={settings?.about} />{!settings?.about && <p>We’re a team of thinkers, makers and technologists who help businesses make their next move with confidence. We connect insight, imagination and execution to turn complex challenges into clear, lasting progress.</p>}<Link className="editorial-link" href="/contact">Meet your next partner <span>↗</span></Link></div>
    </section>
    <section className="purpose-section"><div className="container purpose-heading" data-reveal><p className="eyebrow"><i /> WHAT GUIDES US</p><h2>Good intent.<br/><span>Made tangible.</span></h2></div><div className="container purpose-grid">
      <article data-reveal><span>01 / MISSION</span><i>↗</i><h3>Make meaningful<br/>progress possible.</h3><p>{settings?.mission || 'We help businesses turn ambition into measurable progress through clear strategy, thoughtful creativity and useful technology.'}</p></article>
      <article data-reveal><span>02 / VISION</span><i>✳</i><h3>A brighter digital<br/>future for everyone.</h3><p>{settings?.vision || 'A world where every organisation can use digital thinking to create better experiences and stronger futures.'}</p></article>
    </div></section>
    <section className="about-closer container" data-reveal><p className="eyebrow"><i /> A GOOD PLACE TO START</p><h2>Tell us what<br/><span>you’re imagining.</span></h2><Link className="button button-blue" href="/contact">Start a conversation <span>↗</span></Link></section>
    <CTA />
  </main>
}
