import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Calendar, User, Radio } from 'lucide-react'
import { CTA, RichText, richTextHasContent } from '@/components/Blocks'
import { getPost, mediaURL } from '@/lib/cms'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPost(slug)
  return post ? { title: post.seoTitle || `${post.title} | MARSMENT`, description: post.seoDescription || post.excerpt } : {}
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) notFound()

  const image = mediaURL(post.coverImage) || process.env.NEXT_PUBLIC_BLOG_IMAGE_URL
  const alt = typeof post.coverImage === 'object' && post.coverImage ? post.coverImage.alt || post.title : post.title

  return (
    <main className="article-page">
      <article className="article container">
        <Link href="/blog" className="back-link">
          <ArrowLeft size={14} />
          <span>RETURN TO TRANSMISSIONS</span>
        </Link>

        <div className="article-heading" data-reveal>
          <div className="mars-eyebrow">
            <span className="eyebrow-beacon" />
            <span>TRANSMISSION RADAR</span>
          </div>
          <h1 className="article-title">{post.title}</h1>
          <p className="lead article-lead">{post.excerpt}</p>
          
          <div className="article-meta">
            <span className="meta-author">
              <User size={14} className="text-cyan" />
              {post.author || 'MARSMENT Team'}
            </span>
            {post.publishedAt && (
              <span className="meta-date">
                <Calendar size={14} />
                {new Date(post.publishedAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            )}
          </div>
        </div>

        {image && (
          <div className="article-image-wrap" data-reveal>
            <img className="article-image" src={image} alt={alt} />
            <div className="article-img-badge">
              <Radio size={14} className="text-orange" />
              <span>DISPATCH ASSET</span>
            </div>
          </div>
        )}

        <div className="article-content detail-rich" data-reveal>
          {richTextHasContent(post.content) ? <RichText value={post.content} /> : <p>{post.excerpt}</p>}
        </div>
      </article>

      <CTA />
    </main>
  )
}
