import Link from 'next/link'
import type { ReactNode } from 'react'

export function PageIntro({ eyebrow, title, text }: { eyebrow: string; title: ReactNode; text?: string }) { return <section className="page-intro"><div className="container page-intro-inner"><p className="eyebrow"><i/> {eyebrow}</p><h1>{title}</h1>{text&&<p className="lead">{text}</p>}</div></section> }
export function CTA() { return <section className="cta-section"><div className="container cta-inner"><div><p className="eyebrow eyebrow-light"><i/> YOUR NEXT CHAPTER</p><h2>Good things start<br/>with a conversation.</h2></div><Link href="/contact" className="button button-white">Tell us what you’re building <span>↗</span></Link></div></section> }
export function richTextHasContent(value: unknown): boolean {
  if (!value || typeof value !== 'object') return false
  if (Array.isArray(value)) return value.some(richTextHasContent)
  const node = value as Record<string, unknown>
  if (typeof node.text === 'string' && node.text.trim()) return true
  return Object.values(node).some(richTextHasContent)
}
export function RichText({ value }: { value: unknown }) {
  if (!value || typeof value !== 'object') return null
  const root=(value as {root?:{children?:Array<Record<string,unknown>>}}).root
  return <div className="rich-text">{root?.children?.map((node,index)=>{const text=Array.isArray(node.children)?node.children.map((c)=>typeof c==='object'?(c as {text?:string}).text||'':'').join(''):''; if(node.type==='heading') {const level=Number(node.tag?.toString().replace('h',''))||2;return level===3?<h3 key={index}>{text}</h3>:<h2 key={index}>{text}</h2>} if(node.type==='list') return <ul key={index}>{(node.children as Array<{children?:Array<{text?:string}>}>).map((li,i)=><li key={i}>{li.children?.map(c=>c.text).join('')}</li>)}</ul>; return <p key={index}>{text}</p>})}</div>
}
