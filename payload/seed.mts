import config from '../payload.config.ts'
import { getPayload } from 'payload'
import { serviceSlug, starterServices } from '../lib/starter-services.ts'
import { serviceCopy, serviceRichText } from '../lib/service-copy.ts'

function hasText(value: unknown): boolean {
  if (typeof value === 'string') return Boolean(value.trim())
  if (Array.isArray(value)) return value.some(hasText)
  if (!value || typeof value !== 'object') return false
  const node = value as Record<string, unknown>
  if (node.type === 'text') return typeof node.text === 'string' && Boolean(node.text.trim())
  if (node.root && typeof node.root === 'object') return hasText((node.root as Record<string, unknown>).children)
  if ('children' in node) return hasText(node.children)
  return false
}

function hasQuote(value: unknown): boolean {
  if (!value || typeof value !== 'object') return false
  if (Array.isArray(value)) return value.some(hasQuote)
  const node = value as Record<string, unknown>
  return node.type === 'quote' || Object.values(node).some(hasQuote)
}

async function seed() {
  const payload = await getPayload({ config })
  let created = 0
  let updated = 0
  try {
    for (const [index, service] of starterServices.entries()) {
      const { title, category, summary, icon } = service
      const copy = serviceCopy[title]
      const slug = serviceSlug(title)
      const existing = await payload.find({ collection: 'services', where: { slug: { equals: slug } }, limit: 1, overrideAccess: true })
      if (!existing.docs.length) {
        await payload.create({ collection: 'services', overrideAccess: true, data: { title, slug, category, eyebrow: 'Built around your goals', summary, icon, featured: index < 6, sortOrder: index, description: serviceRichText(copy.first), secondDescription: serviceRichText([copy.second], copy.highlight) } })
        created += 1
      } else {
        const record = existing.docs[0]
        const data: Record<string, unknown> = {}
        if (!hasText(record.description)) data.description = serviceRichText(copy.first)
        if (!hasText(record.secondDescription)) data.secondDescription = serviceRichText([copy.second], copy.highlight)
        else if (!hasQuote(record.secondDescription)) {
          const current = record.secondDescription as { root?: { children?: unknown[] } }
          const quote = serviceRichText([], copy.highlight).root.children[0]
          data.secondDescription = { ...current, root: { ...current.root, children: [...(current.root?.children || []), quote] } }
        }
        if (Object.keys(data).length) {
          await payload.update({ collection: 'services', id: record.id, overrideAccess: true, data })
          updated += 1
        }
      }
    }
    console.info(`Service content ready: ${created} records created, ${updated} records updated.`)
  } finally {
    await payload.destroy()
  }
}

seed().catch((error: unknown) => {
  console.error('Could not seed services:', error)
  process.exitCode = 1
})
