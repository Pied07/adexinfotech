import Link from 'next/link'
import { ArrowUpRight, Radio, Calendar, User } from 'lucide-react'
import { CTA, PageIntro } from '@/components/Blocks'
import { getPosts, getSettings, mediaURL } from '@/lib/cms'

export default async function BlogPage() {
  const [posts, rawSettings] = await Promise.all([getPosts(), getSettings()])
  const settings = rawSettings as Record<string, unknown> | null

  return (
    <main className="blog-page">
      <PageIntro
        eyebrow={(settings?.blogPageEyebrow as string) || 'TRANSMISSIONS & RADAR • MARSMENT'}
        title={<>{(settings?.blogPageTitle as string) || 'Insights From The Edge'}<br />{(settings?.blogPageAccent as string) || 'Of Innovation.'}</>}
        text={(settings?.blogPageSubtitle as string) || 'Deep dives into web architecture, search engine algorithms, artificial intelligence, and digital performance strategy.'}
      />

      <section className="listing-section container">
        <div className="blog-grid">
          {posts.map((post, index) => {
            const image = mediaURL(post.coverImage) || process.env.NEXT_PUBLIC_BLOG_IMAGE_URL
            const alt = typeof post.coverImage === 'object' && post.coverImage ? post.coverImage.alt || post.title : post.title

            return (
              <Link
                className="blog-card"
                href={`/blog/${post.slug}`}
                key={post.id}
                data-reveal
                style={{ '--card-delay': `${(index % 3) * 80}ms` } as React.CSSProperties}
              >
                <div className="blog-cover">
                  {image ? (
                    <img src={image} alt={alt} />
                  ) : (
                    <div className="cover-art">
                      <Radio size={28} className="text-orange" />
                      <span>MARSMENT RADAR</span>
                    </div>
                  )}
                  <div className="cover-badge">
                    <span className="dot-cyan" />
                    <span>TRANSMISSION {String(index + 1).padStart(2, '0')}</span>
                  </div>
                </div>

                <div className="blog-meta">
                  <span className="meta-author">
                    <User size={13} className="text-cyan" />
                    {post.author || 'MARSMENT Team'}
                  </span>
                  {post.publishedAt && (
                    <span className="meta-date">
                      <Calendar size={13} />
                      {new Date(post.publishedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  )}
                </div>

                <h2 className="blog-card-title">{post.title}</h2>
                <p className="blog-card-excerpt">{post.excerpt}</p>

                <div className="blog-card-foot">
                  <span className="text-link">
                    <span>Read Full Transmission</span>
                    <ArrowUpRight size={14} />
                  </span>
                </div>
              </Link>
            )
          })}
        </div>

        {!posts.length && (
          <div className="empty-cms">
            <span>No transmissions published yet. Check back soon or tune your receiver.</span>
          </div>
        )}
      </section>

      <CTA />
    </main>
  )
}
