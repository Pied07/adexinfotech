# Adex Infotech

An editable digital agency website built with Next.js and Payload CMS.

## Local setup

1. Create a managed PostgreSQL database with your hosting provider. Copy `.env.example` to `.env` and set `PAYLOAD_SECRET`, `DATABASE_URI`, and `NEXT_PUBLIC_SERVER_URL`. Use the provider's pooled connection URL when offered, and follow its SSL requirements.
2. Install packages with `npm install`.
3. Create the Payload database schema with `npm run payload -- migrate`.
4. Add the editable service catalogue with `npm run seed` (safe to rerun; existing services are kept).
5. Start the site with `npm run dev` and visit `/admin` to create the first CMS user.

Use Node.js 20.9 or later for the Payload commands. Add the same database URL and Payload secret to your web host's environment settings before deploying. Run migrations against that cloud database before the site receives traffic; do not use the example hostname or credentials as real values.

Site identity, logo, hero content and image, company details, contact information, policies, service pages and published articles are managed from Payload. For production images, set `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET`; the Cloudinary plugin stays disabled until all three are set. Enquiries submitted on the contact page are stored in the private Inquiries collection.

The site can render with its designed identity fallback before the CMS is configured. CMS managed content appears once the database is available.
