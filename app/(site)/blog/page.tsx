import Link from 'next/link'
import { CTA, PageIntro } from '@/components/Blocks'
import { getPosts, mediaURL } from '@/lib/cms'

export default async function BlogPage() {
  const posts = await getPosts()
  return <main>
    <PageIntro eyebrow="IDEAS & INSIGHTS" title={<>A little food<br />for thought.</>} text="Ideas, perspectives and practical thinking from our team." />
    <section className="listing-section container"><div className="blog-grid">
      {posts.map((post) => {
        const image = mediaURL(post.coverImage) || process.env.NEXT_PUBLIC_BLOG_IMAGE_URL
        const alt = typeof post.coverImage === 'object' && post.coverImage ? post.coverImage.alt || post.title : post.title
        return <Link className="blog-card" href={`/blog/${post.slug}`} key={post.id}>
          <div className="blog-cover">{image ? <img src={image} alt={alt} /> : <div className="cover-art"><span>IDEAS<br />IN MOTION</span><i>✳</i></div>}</div>
          <div className="blog-meta"><span>{post.author || 'Adex team'}</span><span>{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : ''}</span></div>
          <h2>{post.title}</h2><p>{post.excerpt}</p><span className="text-link">Read article →</span>
        </Link>
      })}
    </div>{!posts.length && <div className="empty-cms">No articles yet. Publish your first post from the Payload admin.</div>}</section>
    <CTA />
  </main>
}
