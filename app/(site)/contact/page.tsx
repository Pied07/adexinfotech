import { getServices, getSettings, mediaURL } from '@/lib/cms'
import { InquiryForm } from '@/components/InquiryForm'
import { PageIntro } from '@/components/Blocks'

export default async function ContactPage() {
  const [settings, services] = await Promise.all([getSettings(), getServices()])
  const image = mediaURL(settings?.aboutImage) || process.env.NEXT_PUBLIC_ABOUT_IMAGE_URL
  return <main className="contact-page">
    <PageIntro eyebrow="LET’S START SOMEWHERE" title="Tell us what’s next." text="A clear brief, a rough idea or a problem to solve—we’re ready to listen." />
    <section className="contact-layout container">
      <div className="contact-left" data-reveal>
        <div className="contact-photo">{image && <img src={image} alt="A thoughtful working session"/>}<span>THE FIRST STEP<br/>IS A CONVERSATION.</span></div>
        <div className="contact-details"><p className="eyebrow"><i /> FIND YOUR WAY TO US</p><h2>Good ideas are<br/><span>better shared.</span></h2><p className="contact-blurb">Whether you have a clear brief or just the start of an idea, we’d love to hear from you.</p>
          {settings?.email && <a className="contact-method" href={`mailto:${settings.email}`}><span>✉</span><div><small>EMAIL US</small><b>{settings.email}</b></div><i>↗</i></a>}
          {settings?.phone && <a className="contact-method" href={`tel:${settings.phone}`}><span>↗</span><div><small>CALL US</small><b>{settings.phone}</b></div><i>↗</i></a>}
          {settings?.address && <div className="contact-method"><span>⌖</span><div><small>FIND US</small><b>{settings.address}</b></div></div>}
          <div className="response-note"><span>◷</span> We usually reply within one working day.</div>
        </div>
      </div>
      <div className="form-panel" data-reveal><p className="eyebrow"><i /> REQUEST A CONSULTATION</p><h2>Tell us a little about it.</h2><p className="form-intro">Share a few details and our team will get back to you shortly.</p><InquiryForm services={services as unknown as { title: string }[]} /></div>
    </section>
  </main>
}
