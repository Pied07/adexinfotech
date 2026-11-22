import Link from 'next/link'

export default function NotFound(){return <main className="not-found container"><p className="eyebrow"><i/> PAGE NOT FOUND</p><h1>Looks like this<br/><span>is a new direction.</span></h1><p>The page you’re looking for may have moved or no longer exists.</p><Link className="button button-blue" href="/">Back to home <span>↗</span></Link></main>}
