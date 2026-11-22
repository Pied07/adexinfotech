import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  upload: { staticDir: 'public/media', disableLocalStorage: Boolean(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET), imageSizes: [{ name: 'card', width: 900, height: 650, position: 'centre' }, { name: 'hero', width: 1600, height: 1100, position: 'centre' }] },
  access: { read: () => true },
  fields: [{ name: 'alt', type: 'text', required: true }],
}
