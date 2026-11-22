import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site settings',
  fields: [
    { name: 'businessName', type: 'text', required: true, defaultValue: 'Adex Infotech' },
    { name: 'tagline', type: 'text', defaultValue: 'Ideas into impact.' },
    { name: 'logo', type: 'upload', relationTo: 'media' },
    { name: 'heroTitle', type: 'text', defaultValue: 'Make your next move your best one.' },
    { name: 'heroAccent', type: 'text', defaultValue: 'Build what’s next.' },
    { name: 'heroDescription', type: 'textarea', defaultValue: 'We bring strategy, design and technology together to help ambitious brands move forward.' },
    { name: 'heroImage', type: 'upload', relationTo: 'media' },
    { name: 'aboutImage', type: 'upload', relationTo: 'media' },
    { name: 'about', type: 'richText' },
    { name: 'mission', type: 'textarea' },
    { name: 'vision', type: 'textarea' },
    { name: 'email', type: 'email' },
    { name: 'phone', type: 'text' },
    { name: 'address', type: 'textarea' },
    { name: 'whatsappNumber', type: 'text', admin: { description: 'Country code and number, digits only.' } },
    { name: 'socialLinks', type: 'array', fields: [{ name: 'label', type: 'text', required: true }, { name: 'url', type: 'text', required: true }] },
    { name: 'privacyPolicy', type: 'richText' },
    { name: 'terms', type: 'richText' },
    { name: 'footerNote', type: 'text' },
    { name: 'seoTitle', type: 'text' },
    { name: 'seoDescription', type: 'textarea' },
  ],
}
