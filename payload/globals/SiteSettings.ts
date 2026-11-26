import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site settings',
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'General & Brand',
          fields: [
            { name: 'businessName', type: 'text', required: true, defaultValue: 'MARSMENT' },
            { name: 'tagline', type: 'text', defaultValue: 'Web • Development • Marketing' },
            { name: 'logo', type: 'upload', relationTo: 'media' },
            {
              name: 'logoIcon',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'Square or compact logo used for the browser tab icon. Falls back to Logo when empty.' },
            },
            { name: 'email', type: 'email' },
            { name: 'phone', type: 'text' },
            { name: 'address', type: 'textarea' },
            { name: 'whatsappNumber', type: 'text', admin: { description: 'Country code and number, digits only.' } },
            {
              name: 'socialLinks',
              type: 'array',
              fields: [
                { name: 'label', type: 'text', required: true },
                { name: 'url', type: 'text', required: true },
              ],
            },
            { name: 'footerNote', type: 'text', defaultValue: 'EXPEDITION TO THE EXTRAORDINARY' },
          ],
        },
        {
          label: 'Certificates',
          fields: [
            {
              name: 'certificates',
              type: 'array',
              label: 'Company Certificates',
              admin: {
                description: 'Upload your MSME certificate or other official recognitions. Displayed on the Home and About pages.',
              },
              fields: [
                { name: 'title', type: 'text', required: true, defaultValue: 'MSME Certified' },
                { name: 'subtitle', type: 'text', defaultValue: 'Government-Recognized MSME Registered Enterprise' },
                { name: 'image', type: 'upload', relationTo: 'media', required: true },
                { name: 'showInHero', type: 'checkbox', defaultValue: true },
              ],
            },
          ],
        },
        {
          label: 'Home Page',
          fields: [
            { name: 'heroEyebrow', type: 'text', defaultValue: 'MISSION BRIEFING • EXPEDITION 01' },
            { name: 'heroTitle', type: 'text', defaultValue: 'Engineering Velocity' },
            { name: 'heroAccent', type: 'text', defaultValue: 'Beyond Boundaries.' },
            {
              name: 'heroDescription',
              type: 'textarea',
              defaultValue: 'We architect resilient web applications, intelligent software ecosystems, and high-impact growth marketing designed to conquer new frontiers.',
            },
            { name: 'heroImage', type: 'upload', relationTo: 'media' },
            { name: 'heroOrbitalSpeed', type: 'text', defaultValue: 'ORBITAL SPEED: 11.2 KM/S' },
            { name: 'heroMotto', type: 'text', defaultValue: 'Precision Strategy. Interplanetary Impact.' },
            {
              name: 'heroTickerItems',
              type: 'array',
              fields: [{ name: 'label', type: 'text', required: true }],
            },
            { name: 'introEyebrow', type: 'text', defaultValue: 'THE MARSMENT STANDARD' },
            { name: 'introTitle', type: 'text', defaultValue: 'We bring the' },
            { name: 'introAccent', type: 'text', defaultValue: 'whole mission' },
            { name: 'introTitleEnd', type: 'text', defaultValue: 'into focus.' },
            {
              name: 'introLead',
              type: 'textarea',
              defaultValue: 'Every ambitious venture demands an extraordinary leap. We fuse bold visual identity, state-of-the-art engineering, and razor-sharp market traction to propel your company far ahead of the competition.',
            },
            {
              name: 'introMetrics',
              type: 'array',
              fields: [
                { name: 'value', type: 'number', required: true },
                { name: 'suffix', type: 'text' },
                { name: 'label', type: 'text', required: true },
              ],
            },
            { name: 'servicesEyebrow', type: 'text', defaultValue: 'CAPABILITIES IN ORBIT' },
            { name: 'servicesHeading', type: 'text', defaultValue: 'One unified crew.' },
            { name: 'servicesHeadingAccent', type: 'text', defaultValue: 'Every technical advantage.' },
            {
              name: 'servicesSubtitle',
              type: 'textarea',
              defaultValue: 'From initial atmospheric lift-off to planetary dominance, our interdisciplinary capabilities deliver unwavering speed, security and measurable business growth.',
            },
            { name: 'studioEyebrow', type: 'text', defaultValue: 'MISSION ETHOS' },
            { name: 'studioHeading', type: 'text', defaultValue: 'Groundbreaking work is' },
            { name: 'studioHeadingAccent', type: 'text', defaultValue: 'an orbital discipline.' },
            {
              name: 'studioDescription',
              type: 'textarea',
              defaultValue: 'We operate at the nexus of imaginative design and battle-tested engineering. By removing friction, automating repetitive bottlenecks, and crafting breathtaking user touchpoints, we transform complex enterprise challenges into clear, unstoppable momentum.',
            },
            {
              name: 'studioHighlights',
              type: 'array',
              fields: [
                { name: 'title', type: 'text', required: true },
                { name: 'description', type: 'text', required: true },
              ],
            },
            { name: 'processEyebrow', type: 'text', defaultValue: 'FLIGHT PROTOCOL' },
            { name: 'processHeading', type: 'text', defaultValue: 'The four stages of' },
            { name: 'processHeadingAccent', type: 'text', defaultValue: 'interplanetary execution.' },
            {
              name: 'processSubtitle',
              type: 'textarea',
              defaultValue: 'A transparent, battle-tested launch sequence from initial recon to sustainable orbital velocity.',
            },
            {
              name: 'processStages',
              type: 'array',
              fields: [
                { name: 'step', type: 'text', required: true },
                { name: 'title', type: 'text', required: true },
                { name: 'description', type: 'textarea', required: true },
              ],
            },
            { name: 'transmissionHeadline', type: 'text', defaultValue: 'Less static.' },
            { name: 'transmissionAccent', type: 'text', defaultValue: 'Maximum velocity.' },
            { name: 'transmissionLabel', type: 'text', defaultValue: 'MARS TRANSMISSION 01' },
            {
              name: 'transmissionCopy',
              type: 'textarea',
              defaultValue: 'A clearer trajectory begins with a direct transmission. Our launchpad is primed for your project.',
            },
          ],
        },
        {
          label: 'About Page',
          fields: [
            { name: 'aboutEyebrow', type: 'text', defaultValue: 'MISSION CONTROL • ABOUT MARSMENT' },
            { name: 'aboutIntroTitle', type: 'text', defaultValue: 'Precision Engineering.' },
            { name: 'aboutIntroAccent', type: 'text', defaultValue: 'Interplanetary Ambition.' },
            { name: 'aboutImage', type: 'upload', relationTo: 'media' },
            { name: 'aboutFirmEyebrow', type: 'text', defaultValue: 'THE FIRM' },
            { name: 'aboutFirmHeading', type: 'text', defaultValue: 'Different disciplines.' },
            { name: 'aboutFirmAccent', type: 'text', defaultValue: 'One relentless vector.' },
            { name: 'about', type: 'richText' },
            { name: 'mission', type: 'textarea' },
            { name: 'vision', type: 'textarea' },
            {
              name: 'aboutValues',
              type: 'array',
              fields: [
                { name: 'title', type: 'text', required: true },
                { name: 'description', type: 'textarea', required: true },
              ],
            },
            { name: 'aboutCloserEyebrow', type: 'text', defaultValue: 'COMMENCE COUNTDOWN' },
            { name: 'aboutCloserHeading', type: 'text', defaultValue: 'Ready to break atmospheric drag?' },
            { name: 'aboutCloserAccent', type: 'text', defaultValue: 'Let’s engineer what’s next.' },
            {
              name: 'aboutCloserDescription',
              type: 'textarea',
              defaultValue: 'Join forward-looking brands that trust MARSMENT for digital development, systems design, and performance growth.',
            },
          ],
        },
        {
          label: 'Services & Blog',
          fields: [
            { name: 'servicesPageEyebrow', type: 'text', defaultValue: 'CAPABILITIES & SYSTEMS • MARSMENT' },
            { name: 'servicesPageTitle', type: 'text', defaultValue: 'Specialized Disciplines.' },
            { name: 'servicesPageAccent', type: 'text', defaultValue: 'Singular Mastery.' },
            {
              name: 'servicesPageSubtitle',
              type: 'textarea',
              defaultValue: 'Battle-tested technical and growth capabilities, unified under one relentless engineering standard.',
            },
            { name: 'servicesEditorialTitle', type: 'text', defaultValue: 'Built for Velocity & Conversion' },
            {
              name: 'servicesEditorialDescription',
              type: 'textarea',
              defaultValue: 'Whether deploying high-load SaaS platforms, revamping visual brands, or orchestrating generative search & omnichannel ad campaigns, our capabilities scale seamlessly with your ambition.',
            },
            { name: 'customSolutionTitle', type: 'text', defaultValue: 'Need a tailored multi-discipline engagement?' },
            {
              name: 'customSolutionDescription',
              type: 'textarea',
              defaultValue: 'Most enterprise projects require an orchestrated mix of web engineering, CRM automation, and targeted lead generation. We build dedicated project squads shaped around your exact metrics.',
            },
            { name: 'blogPageEyebrow', type: 'text', defaultValue: 'TRANSMISSIONS & RADAR • MARSMENT' },
            { name: 'blogPageTitle', type: 'text', defaultValue: 'Insights From The Edge' },
            { name: 'blogPageAccent', type: 'text', defaultValue: 'Of Innovation.' },
            {
              name: 'blogPageSubtitle',
              type: 'textarea',
              defaultValue: 'Deep dives into web architecture, search engine algorithms, artificial intelligence, and digital performance strategy.',
            },
          ],
        },
        {
          label: 'Contact & CTA',
          fields: [
            { name: 'contactPageEyebrow', type: 'text', defaultValue: 'DIRECT TRANSMISSION • MARSMENT' },
            { name: 'contactPageTitle', type: 'text', defaultValue: 'Establish Contact.' },
            { name: 'contactPageAccent', type: 'text', defaultValue: 'Initiate Your Launch.' },
            {
              name: 'contactPageSubtitle',
              type: 'textarea',
              defaultValue: 'A detailed brief, a rough idea, or a high-stakes challenge—our engineering and growth crew is ready to engage.',
            },
            { name: 'contactDetailsHeading', type: 'text', defaultValue: 'Good ideas deserve' },
            { name: 'contactDetailsAccent', type: 'text', defaultValue: 'immediate attention.' },
            {
              name: 'contactBlurb',
              type: 'textarea',
              defaultValue: 'Reach our leadership directly. We analyze every inquiry thoroughly and reply with clear scope recommendations within one working day.',
            },
            {
              name: 'contactResponseGuarantee',
              type: 'text',
              defaultValue: 'Standard response window: within 24 operational hours.',
            },
            { name: 'contactFormTitle', type: 'text', defaultValue: 'Request a Quote / Consultation' },
            {
              name: 'contactFormIntro',
              type: 'textarea',
              defaultValue: 'Provide project details below to schedule an introductory discovery session with our technical leads.',
            },
            { name: 'ctaEyebrow', type: 'text', defaultValue: 'EXPEDITION READY' },
            { name: 'ctaHeading', type: 'text', defaultValue: 'Ready to Launch' },
            { name: 'ctaAccent', type: 'text', defaultValue: 'Your Next Breakthrough?' },
            {
              name: 'ctaDescription',
              type: 'textarea',
              defaultValue: 'Whether you need a world-class web platform, custom software architecture, or aggressive digital growth marketing, our team is primed for departure.',
            },
          ],
        },
        {
          label: 'Privacy & Terms',
          fields: [
            { name: 'privacyEyebrow', type: 'text', defaultValue: 'LEGAL PROTOCOL • MARSMENT' },
            { name: 'privacyTitle', type: 'text', defaultValue: 'Privacy Policy' },
            {
              name: 'privacySubtitle',
              type: 'textarea',
              defaultValue: 'How we protect, process, and handle your data across all digital touchpoints.',
            },
            {
              name: 'privacyPolicy',
              type: 'richText',
              admin: {
                description: 'Write your full Privacy Policy using rich text headings, lists, links, and tables.',
              },
            },
            { name: 'termsEyebrow', type: 'text', defaultValue: 'TERMS OF ENGAGEMENT • MARSMENT' },
            { name: 'termsTitle', type: 'text', defaultValue: 'Terms & Conditions' },
            {
              name: 'termsSubtitle',
              type: 'textarea',
              defaultValue: 'The operational framework governing your use of our platforms and digital services.',
            },
            {
              name: 'terms',
              type: 'richText',
              admin: {
                description: 'Write your full Terms & Conditions using rich text headings, lists, links, and tables.',
              },
            },
          ],
        },
        {
          label: 'SEO',
          fields: [
            { name: 'seoTitle', type: 'text' },
            { name: 'seoDescription', type: 'textarea' },
          ],
        },
      ],
    },
  ],
}
