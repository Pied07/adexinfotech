'use client'

import { ArrowUpRight, LoaderCircle } from 'lucide-react'
import { useRef, useState } from 'react'

export function InquiryForm({ services = [] }: { services?: { title: string }[] }) {
  const [state, setState] = useState('')
  const [busy, setBusy] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const inFlight = useRef(false)

  async function submit(formData: FormData) {
    if (inFlight.current) return
    inFlight.current = true
    setBusy(true)
    setState('')

    try {
      const response = await fetch('/api/inquiries', { method: 'POST', body: formData })
      if (!response.ok) throw new Error('Unable to send your enquiry right now.')
      setState('Thanks for reaching out. Our team will be in touch shortly.')
      formRef.current?.reset()
    } catch {
      setState('We could not send that just now. Please try again or contact us by email.')
    } finally {
      inFlight.current = false
      setBusy(false)
    }
  }

  return <form ref={formRef} id="inquiry-form" className="inquiry-form" action={submit} aria-busy={busy}>
    <div className="form-grid">
      <label>Your name<input name="name" required placeholder="Jane Smith" /></label>
      <label>Email address<input type="email" name="email" required placeholder="jane@company.com" /></label>
      <label>Phone number<input name="phone" placeholder="+1 555 000 0000" /></label>
      <label>I'm interested in<select name="service" defaultValue=""><option value="">Choose a service</option>{services.map(({ title }) => <option key={title}>{title}</option>)}</select></label>
      <label className="form-wide">Tell us about your project<textarea name="message" required rows={4} placeholder="A little about your goals, timeline or challenge..." /></label>
    </div>
    <button type="submit" disabled={busy} className="button button-blue">
      {busy ? <><LoaderCircle className="inquiry-spinner" aria-hidden="true" /> Sending enquiry...</> : <>Send enquiry <ArrowUpRight aria-hidden="true" /></>}
    </button>
    {state && <p className="form-status" role="status" aria-live="polite">{state}</p>}
  </form>
}
