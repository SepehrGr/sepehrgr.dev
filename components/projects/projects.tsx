'use client'

import { ArrowRight, ArrowUpRight, Github } from 'lucide-react'
import { motion, useMotionValue, useSpring } from 'motion/react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'

import { FadeIn } from '@/components/ui/motion-primitives'
import { useReducedMotion } from '@/lib/motion'

import { PROJECTS, type Project } from './data'
import styles from './projects.module.css'

const EASE = [0.22, 1, 0.36, 1] as const
const NEW_TAB = { target: '_blank', rel: 'noopener noreferrer' } as const
const HOME_COUNT = 4

function domainOf(url: string): string {
  return new URL(url).hostname.replace(/^www\./, '')
}

function StackList({ stack }: { stack: string[] }): ReactNode {
  return (
    <ul className='flex flex-wrap gap-1.5' aria-label='Stack'>
      {stack.map(item => (
        <li
          key={item}
          className='border-foreground/12 text-foreground/75 rounded-md border px-2 py-0.5 text-[13px] tracking-tight'
        >
          {item}
        </li>
      ))}
    </ul>
  )
}

function CodeLink({ project }: { project: Project }): ReactNode {
  if (!project.repoUrl) return null
  return (
    <a
      href={project.repoUrl}
      {...NEW_TAB}
      aria-label={`${project.name} source code (opens in new tab)`}
      className='focus-ring border-foreground/15 text-foreground hover:bg-foreground/6 inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-sm font-medium transition-colors'
    >
      <Github className='h-4 w-4' aria-hidden='true' />
      Code
    </a>
  )
}

function VisitButton({ project }: { project: Project }): ReactNode {
  return (
    <a
      href={project.liveUrl}
      {...NEW_TAB}
      className='focus-ring border-foreground/15 text-foreground hover:bg-foreground/6 inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-sm font-medium transition-colors'
    >
      Visit project
      <ArrowUpRight className='h-4 w-4' aria-hidden='true' />
      <span className='sr-only'> (opens in new tab)</span>
    </a>
  )
}

/**
 * Homepage: an index of projects, one row each, with every fact readable at
 * rest. Hovering a row tints it and floats its screenshot above the row;
 * only the Visit project button links to the site.
 */
export function ProjectIndex(): ReactNode {
  const listRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState<number | null>(null)
  const reduced = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const tilt = useMotionValue(0)
  const spring = { stiffness: 260, damping: 28, mass: 0.6 }
  const sx = useSpring(x, spring)
  const sy = useSpring(y, spring)
  const rotate = useSpring(tilt, { stiffness: 180, damping: 18 })
  const lastX = useRef(0)
  const items = PROJECTS.slice(0, HOME_COUNT)

  // x follows the cursor; y stays pinned to the hovered row's top edge (set on
  // enter) so the preview never covers the row being read
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>): void => {
    if (e.pointerType !== 'mouse') return
    x.set(e.clientX - e.currentTarget.getBoundingClientRect().left)
    // lean into the direction of travel
    if (!reduced)
      tilt.set(Math.max(-8, Math.min(8, (e.clientX - lastX.current) * 0.6)))
    lastX.current = e.clientX
  }

  const onRowEnter = (e: React.PointerEvent<HTMLLIElement>, i: number) => {
    if (e.pointerType !== 'mouse') return
    y.set(e.currentTarget.offsetTop)
    setActive(i)
  }

  // keyboard focus parks the preview above the row's right edge
  const onRowFocus = (row: HTMLElement, i: number): void => {
    const list = listRef.current
    if (!list) return
    x.set(list.clientWidth - 200)
    y.set(row.offsetTop)
    setActive(i)
  }

  return (
    <section className='relative w-full' aria-labelledby='projects-heading'>
      <div className='mx-auto w-full max-w-300 px-6 sm:px-10'>
        <FadeIn className='mb-10 flex flex-col gap-4 sm:mb-14'>
          <h2
            id='projects-heading'
            className='text-foreground text-[2.5rem] leading-[1.05] font-semibold tracking-tight md:text-[3.25rem]'
          >
            Things I&rsquo;ve built
          </h2>
          <p className='text-foreground/70 max-w-[44ch] text-[18px] leading-[1.45] tracking-tight sm:text-[20px]'>
            Freelance frontend work since 2022: products, sites and experiments
            in React, Next.js and TypeScript.
          </p>
        </FadeIn>

        <div
          ref={listRef}
          onPointerMove={onPointerMove}
          onPointerLeave={() => {
            setActive(null)
            tilt.set(0)
          }}
          className='relative'
        >
          <ul>
            {items.map((p, i) => (
              <li
                key={p.id}
                onPointerEnter={e => onRowEnter(e, i)}
                onFocus={e => onRowFocus(e.currentTarget, i)}
                onBlur={() => setActive(null)}
                className='group border-foreground/10 relative border-t last:border-b'
                style={{ '--accent': p.accent } as CSSProperties}
              >
                <div
                  aria-hidden='true'
                  className='pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-focus-within:opacity-100 group-hover:opacity-100'
                  style={{
                    background:
                      'linear-gradient(90deg, color-mix(in srgb, var(--accent) 16%, transparent), transparent 70%)',
                  }}
                />
                {/* One column template for every row, so name, summary and
                    meta line up down the list; everything shares the row's
                    centre line. */}
                <div className='relative grid gap-y-4 py-7 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)_19rem] lg:items-center lg:gap-x-10 lg:py-9'>
                  <h3 className='text-foreground text-[2rem] leading-none font-semibold tracking-tight transition-transform duration-500 ease-out group-hover:translate-x-2 md:text-[2.75rem] lg:text-[2.5rem] xl:text-[2.75rem]'>
                    {p.name}
                  </h3>
                  <div className='flex flex-col gap-3'>
                    <p className='text-foreground/75 text-[17px] leading-snug tracking-tight md:text-[19px]'>
                      {p.summary}
                    </p>
                    <StackList stack={p.stack} />
                  </div>
                  <div className='flex flex-col items-start gap-3'>
                    <span className='text-foreground/70 text-sm tracking-tight'>
                      {p.year}
                      {p.repoUrl ? null : ' · Client work'}
                    </span>
                    <div className='flex items-center gap-3'>
                      <a
                        href={p.liveUrl}
                        {...NEW_TAB}
                        aria-label={`Visit ${p.name} (opens in new tab)`}
                        className='focus-ring border-foreground/15 text-foreground hover:bg-foreground/6 inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-sm font-medium transition-colors'
                      >
                        Visit project
                        <ArrowUpRight className='h-4 w-4' aria-hidden='true' />
                      </a>
                      <CodeLink project={p} />
                    </div>
                  </div>
                </div>
                {/* below lg there is no cursor to follow: the preview sits inline */}
                <div className='border-foreground/8 relative mb-7 aspect-16/10 overflow-hidden rounded-2xl border lg:hidden'>
                  <Image
                    src={p.shot.src}
                    alt={p.shot.alt}
                    fill
                    sizes='(min-width: 640px) 90vw, 100vw'
                    className='object-cover object-top'
                  />
                </div>
              </li>
            ))}
          </ul>

          <motion.div
            aria-hidden='true'
            className='pointer-events-none absolute top-0 left-0 z-20 hidden lg:block'
            style={{ x: sx, y: sy, rotate }}
          >
            <motion.div
              className='border-foreground/10 bg-background relative h-56 w-84 -translate-x-1/2 -translate-y-[calc(100%+1.25rem)] overflow-hidden rounded-2xl border p-1 shadow-[0_24px_48px_-16px_rgb(0_0_0/0.35)]'
              initial={false}
              animate={{
                opacity: active === null ? 0 : 1,
                scale: active === null ? 0.85 : 1,
              }}
              transition={{ duration: 0.35, ease: EASE }}
            >
              <div className='relative h-full w-full overflow-hidden rounded-xl'>
                {items.map((p, i) => (
                  <Image
                    key={p.id}
                    src={p.shot.src}
                    alt=''
                    fill
                    sizes='336px'
                    className='object-cover object-top transition-opacity duration-300'
                    style={{ opacity: active === i ? 1 : 0 }}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>

        <div className='mt-12 flex justify-center sm:mt-14'>
          <Link
            href='/projects'
            className='border-foreground/10 focus-ring group bg-background text-foreground hover:bg-foreground/5 inline-flex cursor-pointer items-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-medium transition-colors'
          >
            Explore all projects
            <ArrowRight
              className='h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5'
              aria-hidden='true'
            />
          </Link>
        </div>
      </div>
    </section>
  )
}

/**
 * /projects: each project in a minimal browser window; hovering pans the
 * full-page screenshot inside it, facts sit beside the frame.
 */
export function ProjectWindows(): ReactNode {
  const sectionRef = useRef<HTMLElement>(null)

  // touch screens pan each window on a loop: start it when the window is in
  // view, drop it (back to the top) when it leaves
  useEffect(() => {
    const frames = sectionRef.current?.querySelectorAll<HTMLElement>(`.${styles.frame}`)
    if (!frames?.length) return
    const io = new IntersectionObserver(
      entries => {
        for (const e of entries) e.target.toggleAttribute('data-inview', e.isIntersecting)
      },
      { threshold: 0.5 }
    )
    frames.forEach(f => io.observe(f))
    return () => io.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className='relative w-full' aria-label='Projects'>
      <div className='mx-auto flex w-full max-w-300 flex-col gap-20 px-6 sm:px-10 md:gap-28'>
        {PROJECTS.map((p, i) => (
          <FadeIn key={p.id}>
            <article
              className='grid items-center gap-8 md:grid-cols-12 md:gap-12'
              style={{ '--accent': p.accent } as CSSProperties}
            >
              <a
                href={p.liveUrl}
                {...NEW_TAB}
                aria-label={`Visit ${p.name} (opens in new tab)`}
                className={`${styles.frame} focus-ring group block rounded-[1.25rem] md:col-span-7 ${i % 2 ? 'md:order-2' : ''}`}
              >
                <div className='border-foreground/10 bg-background overflow-hidden rounded-[1.25rem] border shadow-[0_1px_2px_rgb(0_0_0/0.05),0_24px_48px_-24px_color-mix(in_srgb,var(--accent)_55%,transparent)] transition-shadow duration-500 group-hover:shadow-[0_1px_2px_rgb(0_0_0/0.05),0_32px_64px_-24px_color-mix(in_srgb,var(--accent)_80%,transparent)]'>
                  <div className='border-foreground/8 flex items-center gap-1.5 border-b px-4 py-3'>
                    {[0, 1, 2].map(d => (
                      <span
                        key={d}
                        className='bg-foreground/15 h-2.5 w-2.5 rounded-full'
                      />
                    ))}
                    <span className='bg-foreground/5 text-foreground/65 mx-auto rounded-md px-3 py-1 text-[13px] tracking-tight'>
                      {domainOf(p.liveUrl)}
                    </span>
                    <span className='w-10' />
                  </div>
                  <div
                    className={`${styles.viewport} relative aspect-16/10 overflow-hidden`}
                  >
                    <Image
                      src={p.shot.src}
                      alt={p.shot.alt}
                      width={1024}
                      height={p.shot.height}
                      sizes='(min-width: 768px) 640px, 100vw'
                      priority={i === 0}
                      className={`${styles.shot} block h-auto w-full`}
                    />
                  </div>
                </div>
              </a>

              <div className='flex flex-col md:col-span-5'>
                <h2 className='text-foreground text-[2rem] leading-none font-semibold tracking-tight md:text-[2.5rem]'>
                  {p.name}
                </h2>
                <p className='text-foreground/75 mt-4 max-w-[34ch] text-[18px] leading-snug tracking-tight'>
                  {p.summary}
                </p>
                <dl className='border-foreground/10 mt-7 grid grid-cols-[5rem_1fr] gap-y-3 border-t pt-5 text-[15px] tracking-tight'>
                  <dt className='text-foreground/60'>Role</dt>
                  <dd className='text-foreground'>{p.role}</dd>
                  <dt className='text-foreground/60'>Stack</dt>
                  <dd className='text-foreground'>{p.stack.join(' · ')}</dd>
                  <dt className='text-foreground/60'>Year</dt>
                  <dd className='text-foreground'>
                    {p.year}
                    {p.repoUrl ? null : ' · Client work'}
                  </dd>
                </dl>
                <div className='mt-8 flex items-center gap-3'>
                  <VisitButton project={p} />
                  <CodeLink project={p} />
                </div>
              </div>
            </article>
          </FadeIn>
        ))}
      </div>
    </section>
  )
}
