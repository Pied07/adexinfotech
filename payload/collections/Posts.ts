import { slugField, type CollectionConfig } from 'payload'

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: { useAsTitle: 'title', defaultColumns: ['title', '_status', 'publishedAt'] },
  access: { read: ({ req }) => req.user ? true : { _status: { equals: 'published' } } },
  versions: { drafts: true },
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField({ useAsSlug: 'title' }),
    { name: 'excerpt', type: 'textarea', required: true },
    { name: 'content', type: 'richText', admin: { description: 'Optional: add the full article body here. If left empty, the article page shows the excerpt.' } },
    { name: 'coverImage', type: 'upload', relationTo: 'media' },
    { name: 'author', type: 'text' },
    { name: 'publishedAt', type: 'date' },
    { name: 'status', type: 'select', defaultValue: 'draft', admin: { hidden: true }, options: [{ label: 'Draft', value: 'draft' }, { label: 'Published', value: 'published' }] },
    { name: 'seoTitle', type: 'text' },
    { name: 'seoDescription', type: 'textarea' },
  ],
}
