import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CTA, RichText, richTextHasContent } from '@/components/Blocks'
import { getPost, mediaURL } from '@/lib/cms'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPost(slug)
  return post ? { title: post.seoTitle || post.title, description: post.seoDescription || post.excerpt } : {}
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) notFound()
  const image = mediaURL(post.coverImage) || process.env.NEXT_PUBLIC_BLOG_IMAGE_URL
  const alt = typeof post.coverImage === 'object' && post.coverImage ? post.coverImage.alt || post.title : post.title
  return <main><article className="article container">
    <Link href="/blog" className="back-link">← All insights</Link>
    <div className="article-heading"><p className="eyebrow"><i /> IDEAS & INSIGHTS</p><h1>{post.title}</h1><p className="lead">{post.excerpt}</p>
      <div className="article-meta"><span>{post.author || 'Adex team'}</span><span>{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' }) : ''}</span></div>
    </div>
    {image && <img className="article-image" src={image} alt={alt} />}
    <div className="article-content detail-rich">{richTextHasContent(post.content) ? <RichText value={post.content} /> : <p>{post.excerpt}</p>}</div>
  </article><CTA /></main>
}
