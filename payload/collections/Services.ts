import { slugField, type CollectionConfig } from 'payload'

export const Services: CollectionConfig = {
  slug: 'services',
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'category', 'featured', 'updatedAt'] },
  access: { read: () => true },
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField({ useAsSlug: 'title' }),
    { name: 'category', type: 'text' },
    { name: 'eyebrow', type: 'text' },
    { name: 'summary', type: 'textarea', required: true, admin: { description: 'Short listing copy. The public service tile displays a maximum of three lines.' } },
    { name: 'description', type: 'richText', admin: { description: 'First detail section. Add paragraphs, headings, lists, or a table. Keep highlighted pull quotes for the second description.' } },
    { name: 'secondDescription', type: 'richText', admin: { description: 'Optional second detail section. Use the quote button to add a highlighted line on a light blue background.' } },
    { name: 'icon', type: 'text', admin: { description: 'Lucide icon name, for example Palette or Search.' } },
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'featured', type: 'checkbox', defaultValue: false },
    { name: 'sortOrder', type: 'number', defaultValue: 0 },
    { name: 'seoTitle', type: 'text' },
    { name: 'seoDescription', type: 'textarea' },
  ],
}
