'use client'
import Link from 'next/link'
import { useEffect } from 'react'

export default function ErrorPage({error,reset}:{error:Error&{digest?:string};reset:()=>void}){useEffect(()=>{console.error(error)},[error]);return <main className="not-found container"><p className="eyebrow"><i/> SOMETHING WENT WRONG</p><h1>We hit a<br/><span>small detour.</span></h1><p>Please try again, or return to the homepage.</p><div className="hero-actions"><button className="button button-blue" onClick={()=>reset()}>Try again <span>↻</span></button><Link className="text-link" href="/">Back to home →</Link></div></main>}
