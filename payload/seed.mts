import config from '../payload.config.ts'
import { getPayload } from 'payload'
import { serviceSlug, starterServices } from '../lib/starter-services.ts'

async function seed() {
  const payload = await getPayload({ config })
  let created = 0
  try {
    for (const [index, service] of starterServices.entries()) {
      const { title, category, summary, icon } = service
      const slug = serviceSlug(title)
      const existing = await payload.find({ collection: 'services', where: { slug: { equals: slug } }, limit: 1, overrideAccess: true })
      if (!existing.docs.length) {
        await payload.create({ collection: 'services', overrideAccess: true, data: { title, slug, category, eyebrow: 'Built around your goals', summary, icon, featured: index < 6, sortOrder: index } })
        created += 1
      }
    }
    console.info(created ? `Seeded ${created} editable service records.` : 'Services already exist. No changes were made.')
  } finally {
    await payload.destroy()
  }
}

seed().catch((error: unknown) => {
  console.error('Could not seed services:', error)
  process.exitCode = 1
})
