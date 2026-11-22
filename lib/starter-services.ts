export const starterServices = [
  { title: 'Graphic Design', category: 'Creative', summary: 'Identity systems and brand visuals that give good ideas a memorable shape.', icon: 'Palette' },
  { title: 'Video Editing', category: 'Creative', summary: 'Purposeful video stories shaped for the platforms and people that matter.', icon: 'Clapperboard' },
  { title: 'Website Development', category: 'Technology', summary: 'Fast, accessible digital experiences designed around your customers and goals.', icon: 'PanelsTopLeft' },
  { title: 'SaaS', category: 'Technology', summary: 'Scalable software products that solve real problems and grow with your business.', icon: 'Layers3' },
  { title: 'SEO and GEO', category: 'Growth', summary: 'Search and generative engine optimisation that helps people discover your expertise.', icon: 'Search' },
  { title: 'WordPress and SEO', category: 'Technology', summary: 'Flexible WordPress websites built for visibility, speed and easy publishing.', icon: 'Blocks' },
  { title: 'AI/ML', category: 'Technology', summary: 'Practical machine learning and AI solutions for smarter workflows and services.', icon: 'BrainCircuit' },
  { title: 'Digital Marketing', category: 'Growth', summary: 'Connected campaigns that bring the right audience closer to your brand.', icon: 'Megaphone' },
  { title: 'Social Media', category: 'Growth', summary: 'Channel strategy and content that build a genuine, consistent presence.', icon: 'Share2' },
  { title: 'GMB', category: 'Growth', summary: 'Google Business Profile improvements that strengthen local visibility and trust.', icon: 'MapPin' },
  { title: 'WhatsApp Marketing', category: 'Growth', summary: 'Helpful WhatsApp messaging journeys that keep customer conversations moving.', icon: 'MessageCircle' },
  { title: 'Email Marketing', category: 'Growth', summary: 'Thoughtful email programmes that nurture relationships and encourage action.', icon: 'Mail' },
  { title: 'Google Ads', category: 'Growth', summary: 'Performance-focused paid search and display campaigns with clear reporting.', icon: 'MousePointerClick' },
  { title: 'Google Listing', category: 'Growth', summary: 'Accurate, engaging Google listings that make it easier for customers to find you.', icon: 'MapPinned' },
  { title: 'Lead Generation', category: 'Growth', summary: 'Practical acquisition systems that turn qualified interest into conversations.', icon: 'Target' },
] as const

export function serviceSlug(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}
