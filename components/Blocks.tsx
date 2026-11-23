import Link from 'next/link'
import type { ReactNode } from 'react'

export function PageIntro({ eyebrow, title, text }: { eyebrow: string; title: ReactNode; text?: string }) { return <section className="page-intro"><div className="container page-intro-inner"><p className="eyebrow"><i/> {eyebrow}</p><h1>{title}</h1>{text&&<p className="lead">{text}</p>}</div></section> }
export function CTA() { return <section className="cta-section"><div className="container cta-inner"><div><p className="eyebrow eyebrow-light"><i/> YOUR NEXT CHAPTER</p><h2>Good things start<br/>with a conversation.</h2></div><Link href="/contact" className="button button-white">Tell us what you’re building <span>↗</span></Link></div></section> }
export function richTextHasContent(value: unknown): boolean {
  if (!value || typeof value !== 'object') return false
  if (Array.isArray(value)) return value.some(richTextHasContent)
  const node = value as Record<string, unknown>
  if (typeof node.text === 'string' && node.text.trim()) return true
  if (node.type === 'table' || node.type === 'quote' || node.type === 'list' || node.type === 'upload') return true
  return Object.values(node).some(richTextHasContent)
}
export function RichText({ value, highlightQuotes = true }: { value: unknown; highlightQuotes?: boolean }) {
  if (!value || typeof value !== 'object') return null
  const root=(value as {root?:{children?:Array<Record<string,unknown>>}}).root
  const renderNodes = (nodes: unknown, keyPrefix: string): ReactNode[] => {
    if (!Array.isArray(nodes)) return []
    return nodes.map((raw, index) => {
      if (!raw || typeof raw !== 'object') return null
      const node = raw as Record<string, unknown>
      const key = `${keyPrefix}-${index}`
      if (node.type === 'text') {
        let text: ReactNode = String(node.text || '')
        const format = Number(node.format || 0)
        if (format & 1) text = <strong>{text}</strong>
        if (format & 2) text = <em>{text}</em>
        if (format & 4) text = <s>{text}</s>
        if (format & 8) text = <u>{text}</u>
        if (format & 16) text = <code>{text}</code>
        return <span key={key}>{text}</span>
      }
      const children = renderNodes(node.children, key)
      if (node.type === 'heading') return Number(String(node.tag).replace('h', '')) === 3 ? <h3 key={key}>{children}</h3> : <h2 key={key}>{children}</h2>
      if (node.type === 'list') {
        const isNumbered = node.listType === 'number' || node.tag === 'ol'
        const start = typeof node.start === 'number' ? node.start : undefined
        return isNumbered ? <ol key={key} start={start}>{children}</ol> : <ul key={key}>{children}</ul>
      }
      if (node.type === 'listitem') {
        const value = typeof node.value === 'number' ? node.value : undefined
        return <li key={key} value={value}>{children}</li>
      }
      if (node.type === 'quote') return highlightQuotes ? <blockquote key={key}>{children}</blockquote> : <p className="plain-quote" key={key}>{children}</p>
      if (node.type === 'link' || node.type === 'autolink') {
        const fields = node.fields && typeof node.fields === 'object' ? (node.fields as Record<string, unknown>) : null
        const href = String(fields?.url || (node as Record<string, unknown>).url || '#')
        const target = fields?.newTab ? '_blank' : undefined
        const rel = fields?.newTab ? 'noopener noreferrer' : undefined
        return <a key={key} href={href} target={target} rel={rel}>{children}</a>
      }
      if (node.type === 'table') return <div className="rich-table-wrap" key={key}><table><tbody>{children}</tbody></table></div>
      if (node.type === 'tablerow') return <tr key={key}>{children}</tr>
      if (node.type === 'tablecell') {
        const isHeader = Boolean(Number(node.headerState) || node.headerState === 'row' || node.headerState === 'column' || node.headerState === 'both')
        const colSpan = typeof node.colSpan === 'number' && node.colSpan > 1 ? node.colSpan : undefined
        const rowSpan = typeof node.rowSpan === 'number' && node.rowSpan > 1 ? node.rowSpan : undefined
        return isHeader ? <th key={key} colSpan={colSpan} rowSpan={rowSpan}>{children}</th> : <td key={key} colSpan={colSpan} rowSpan={rowSpan}>{children}</td>
      }
      if (node.type === 'horizontalrule') return <hr key={key} />
      if (node.type === 'linebreak') return <br key={key} />
      return <p key={key}>{children}</p>
    }).filter((node) => node !== null)
  }
  return <div className="rich-text">{renderNodes(root?.children, 'rich')}</div>
}
