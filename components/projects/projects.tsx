'use client'

import {
  ArrowRight,
  Bot,
  Compass,
  ExternalLink,
  Layers,
  LineChart,
  Sparkles,
  Wand2,
} from 'lucide-react'
import { AnimatePresence, motion, type MotionStyle } from 'motion/react'
import { useState, type ComponentType, type ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'

import { FadeIn } from '@/components/ui/motion-primitives'
import { useReducedMotion } from '@/lib/motion'

type Project = {
  id: string
  icon: ComponentType<{ className?: string }>
  name: string
  category: string
  title: string
  description: string
  role: string
  year: string
  duration: string
  accent: string
  imageRatio: number
  image: string
  imageAlt: string
  projectUrl: string
  highlights: string[]
  tools: string[]
}

// Keep project links and case-study details here so the home and projects pages
// always stay in sync. Replace the sample destinations with published project URLs.
const PROJECTS: Project[] = [
  {
    id: 'loom',
    icon: Sparkles,
    name: 'LOOM',
    category: 'AI product design',
    title: 'A writing companion that thinks alongside you.',
    description:
      'A focused writing surface where ideas, edits, and drafts coexist without the chat clutter.',
    role: 'Design Engineer',
    year: '2024',
    duration: '8 weeks',
    accent: '#f0a675',
    imageRatio: 752 / 497,
    image:
      'https://cdn.dribbble.com/userupload/46128964/file/b92b9d268dd928642ca94bd49e32923a.jpg?resize=752x497&vertical=center',
    imageAlt: 'Loom AI writing companion mockup',
    projectUrl: 'https://www.loom.com',
    highlights: [
      'Designed a distraction-free drafting flow',
      'Made AI suggestions feel editorial, not intrusive',
      'Created a flexible system for notes and revisions',
    ],
    tools: ['Product design', 'Prototyping', 'React'],
  },
  {
    id: 'atlas',
    icon: Compass,
    name: 'Atlas Studio',
    category: 'Brand & web',
    title: 'A two-week brand and product sprint for a creative studio.',
    description:
      'An identity, marketing site, and product surface designed to feel quietly confident at every touchpoint.',
    role: 'Product & Brand Designer',
    year: '2025',
    duration: '2 weeks',
    accent: '#b6a0f7',
    imageRatio: 1024 / 768,
    image:
      'https://cdn.dribbble.com/userupload/24599416/file/original-1ae5075dcd129aebb16bdbca24b41ac7.png?resize=1024x768&vertical=center',
    imageAlt: 'Atlas Studio brand and product sprint mockup',
    projectUrl: 'https://dribbble.com',
    highlights: [
      'Established the visual direction in a single workshop',
      'Built a modular landing-page system',
      'Connected brand moments to product interactions',
    ],
    tools: ['Brand strategy', 'Web design', 'Framer'],
  },
  {
    id: 'rhythm',
    icon: LineChart,
    name: 'Rhythm',
    category: 'Analytics product',
    title: 'Calm analytics for indie founders.',
    description:
      'A weekly digest that turns raw product data into a simple narrative worth reading with Sunday coffee.',
    role: 'Founder & Designer',
    year: '2024',
    duration: '12 weeks',
    accent: '#6ec7b5',
    imageRatio: 1024 / 768,
    image:
      'https://cdn.dribbble.com/userupload/47357856/file/75841fa59f32f05ca6c5ddf02d08dfe6.png?resize=1024x768&vertical=center',
    imageAlt: 'Rhythm calm analytics mockup',
    projectUrl: 'https://dribbble.com',
    highlights: [
      'Translated key metrics into a readable weekly story',
      'Designed a low-noise dashboard for recurring review',
      'Prioritized trends over one-off spikes',
    ],
    tools: ['Product strategy', 'Data visualisation', 'UI design'],
  },
  {
    id: 'groove',
    icon: Wand2,
    name: 'Groove',
    category: 'Service redesign',
    title: 'A clearer path to the right music lesson.',
    description:
      'A redesigned booking experience that makes finding a teacher and choosing a time feel as natural as opening a calendar.',
    role: 'Lead Designer',
    year: '2023',
    duration: '10 weeks',
    accent: '#f2c36f',
    imageRatio: 1024 / 768,
    image:
      'https://cdn.dribbble.com/userupload/43955214/file/original-d4cde1de803e84b97d8892e3444c04b0.png?resize=1024x768&vertical=center',
    imageAlt: 'Groove music school booking flow mockup',
    projectUrl: 'https://dribbble.com',
    highlights: [
      'Simplified the lesson selection journey',
      'Reduced friction around availability and scheduling',
      'Created reusable patterns for the wider platform',
    ],
    tools: ['UX research', 'Service design', 'Design systems'],
  },
  {
    id: 'fieldnote',
    icon: Layers,
    name: 'Fieldnote',
    category: 'Research tool',
    title: 'A research tool that gets teams out of their docs.',
    description:
      'A pocket-sized workspace for capturing quotes, tagging patterns, and synthesising what teams learn in the field.',
    role: 'Design Engineer',
    year: '2024',
    duration: '6 weeks',
    accent: '#77a8e8',
    imageRatio: 1024 / 768,
    image:
      'https://cdn.dribbble.com/userupload/30310902/file/original-621e7fe47be9d11ee14544456c693bec.png?resize=1024x768&vertical=center',
    imageAlt: 'Fieldnote research tool mockup',
    projectUrl: 'https://dribbble.com',
    highlights: [
      'Made in-the-moment capture feel lightweight',
      'Designed an approachable synthesis workflow',
      'Kept the interface out of the research conversation',
    ],
    tools: ['UX design', 'Information architecture', 'React'],
  },
  {
    id: 'talkback',
    icon: Bot,
    name: 'Talkback',
    category: 'AI exploration',
    title: 'A friendlier interface for talking to language models.',
    description:
      'An exploration of how AI chat can feel less like a terminal and more like a conversation with a curious friend.',
    role: 'Independent Project',
    year: '2025',
    duration: '4 weeks',
    accent: '#db8ca8',
    imageRatio: 1024 / 768,
    image:
      'https://cdn.dribbble.com/userupload/16560717/file/original-c6f745d50302d66609bfe080f99f5396.png?resize=1024x768&vertical=center',
    imageAlt: 'Talkback friendlier AI chat interface mockup',
    projectUrl: 'https://dribbble.com',
    highlights: [
      'Explored softer, more human conversation patterns',
      'Created clearer context and response states',
      'Prototyped interaction details for long conversations',
    ],
    tools: ['Interaction design', 'Motion', 'Prototyping'],
  },
]

export type ProjectsProps = {
  withHeadline?: boolean
  viewMoreVisible?: boolean
}

export function Projects({
  withHeadline = false,
  viewMoreVisible = false,
}: ProjectsProps): ReactNode {
  const items = viewMoreVisible ? PROJECTS.slice(0, 4) : PROJECTS

  return (
    <section
      className='relative w-full'
      aria-labelledby={withHeadline ? 'projects-heading' : undefined}
    >
      <div className='mx-auto w-full max-w-300 px-6 sm:px-10'>
        {withHeadline ? (
          <FadeIn className='flex flex-col items-center gap-5 pt-12 pb-10 text-center sm:pt-20 sm:pb-14'>
            <p className='text-foreground/50 text-xs font-medium tracking-[0.16em] uppercase'>
              Selected work
            </p>
            <h2
              id='projects-heading'
              className='text-foreground font-serif text-[2.5rem] leading-[1.05] font-medium tracking-tight md:text-[3rem] lg:text-[3.5rem]'
            >
              Projects with room to explore
            </h2>
            <p className='text-foreground/65 max-w-[37ch] text-[18px] leading-[1.45] tracking-tight sm:text-[20px]'>
              A selection of product, brand, and experimental work. Open a
              project for the story behind it.
            </p>
          </FadeIn>
        ) : null}

        <div className='grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-7 lg:grid-cols-12'>
          {items.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>

        {viewMoreVisible ? (
          <div className='mt-12 flex justify-center sm:mt-16'>
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
        ) : null}
      </div>
    </section>
  )
}

function ProjectCard({
  project,
  index,
}: {
  project: Project
  index: number
}): ReactNode {
  const Icon = project.icon
  const [isHovered, setIsHovered] = useState(false)
  const [isPinned, setIsPinned] = useState(false)
  const prefersReducedMotion = useReducedMotion()
  const isExpanded = isHovered || isPinned

  const isTouchLayout = (): boolean =>
    window.matchMedia('(hover: none), (pointer: coarse)').matches

  return (
    <FadeIn
      delay={Math.min(index * 0.06, 0.3)}
      className={
        index % 4 === 0 || index % 4 === 3 ? 'lg:col-span-7' : 'lg:col-span-5'
      }
    >
      <motion.article
        layout
        onHoverStart={event => {
          if (event.pointerType === 'mouse') setIsHovered(true)
        }}
        onHoverEnd={event => {
          if (event.pointerType === 'mouse') setIsHovered(false)
        }}
        onClick={event => {
          if (!isTouchLayout()) return
          if ((event.target as HTMLElement).closest('a')) return
          setIsPinned(value => !value)
        }}
        onKeyDown={event => {
          if (!isTouchLayout()) return
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            setIsPinned(value => !value)
          }
        }}
        tabIndex={0}
        aria-label={`${project.name}: activate to ${isPinned ? 'close' : 'keep open'} project details`}
        transition={{
          duration: prefersReducedMotion ? 0 : 0.45,
          ease: [0.22, 1, 0.36, 1],
        }}
        className={`project-card border-foreground/8 bg-background group relative overflow-hidden rounded-3xl border p-3 sm:p-3.5 ${isExpanded ? 'is-expanded' : ''}`}
        style={{ '--project-accent': project.accent } as MotionStyle}
      >
        <div>
          <div className='flex items-center justify-between gap-3 px-1 pt-2'>
            <div className='flex min-w-0 items-center gap-2.5'>
              <span className='border-foreground/10 bg-background inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border'>
                <Icon
                  className='text-foreground h-3.5 w-3.5'
                  aria-hidden='true'
                />
              </span>
              <div className='min-w-0'>
                <span className='text-foreground block truncate text-sm font-medium tracking-tight'>
                  {project.name}
                </span>
                <span className='text-foreground/45 block text-[11px] tracking-tight'>
                  {project.category}
                </span>
              </div>
            </div>
          </div>

          <div
            className='project-card__image ring-foreground/5 bg-foreground/5 relative mt-4 w-full overflow-hidden rounded-2xl ring-1'
            style={{ aspectRatio: project.imageRatio }}
          >
            <div className='project-card__image-inner'>
              <Image
                src={project.image}
                alt={project.imageAlt}
                fill
                sizes='(min-width: 1024px) 540px, (min-width: 768px) 45vw, 100vw'
                className='object-cover'
                priority={index < 2}
              />
            </div>
          </div>

          <div className='flex flex-col gap-2.5 px-1 pt-4 pb-2'>
            <h3 className='text-foreground text-[20px] leading-[1.17] font-medium tracking-tight sm:text-[22px]'>
              {project.title}
            </h3>
            <p className='text-foreground/65 text-[14px] leading-normal tracking-tight sm:text-[15px]'>
              {project.description}
            </p>
          </div>

          <dl className='border-foreground/8 mx-1 grid grid-cols-3 border-t pt-3 pb-1 text-[11px] tracking-tight'>
            <div>
              <dt className='text-foreground/45'>Role</dt>
              <dd className='text-foreground/75 mt-1 font-medium'>
                {project.role}
              </dd>
            </div>
            <div>
              <dt className='text-foreground/45'>Year</dt>
              <dd className='text-foreground/75 mt-1 font-medium'>
                {project.year}
              </dd>
            </div>
            <div>
              <dt className='text-foreground/45'>Timeline</dt>
              <dd className='text-foreground/75 mt-1 font-medium'>
                {project.duration}
              </dd>
            </div>
          </dl>
        </div>

        <AnimatePresence initial={false}>
          {isExpanded ? (
            <motion.div
              key='details'
              initial={
                prefersReducedMotion ? false : { height: 0, opacity: 0, y: -12 }
              }
              animate={{ height: 'auto', opacity: 1, y: 0 }}
              {...(prefersReducedMotion
                ? {}
                : { exit: { height: 0, opacity: 0, y: -12 } })}
              transition={{
                duration: prefersReducedMotion ? 0 : 0.38,
                ease: [0.22, 1, 0.36, 1],
              }}
              className='project-card__details'
            >
              <div className='border-foreground/8 mx-1 mt-3 border-t pt-5 pb-1'>
                <div className='grid gap-6 sm:grid-cols-[1.15fr_0.85fr]'>
                  <div>
                    <p className='text-foreground/45 text-[11px] font-medium tracking-[0.14em] uppercase'>
                      Project focus
                    </p>
                    <ul className='mt-3 space-y-2'>
                      {project.highlights.map(highlight => (
                        <li
                          key={highlight}
                          className='text-foreground/70 flex gap-2 text-[13px] leading-snug'
                        >
                          <span className='bg-foreground/45 mt-1.5 h-1 w-1 shrink-0 rounded-full' />
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className='text-foreground/45 text-[11px] font-medium tracking-[0.14em] uppercase'>
                      Contribution
                    </p>
                    <div className='mt-3 flex flex-wrap gap-1.5'>
                      {project.tools.map(tool => (
                        <span
                          key={tool}
                          className='border-foreground/10 bg-foreground/3 text-foreground/65 rounded-md border px-2 py-1 text-[11px]'
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <a
                  href={project.projectUrl}
                  target='_blank'
                  rel='noreferrer'
                  className='border-foreground/10 focus-ring group/link text-foreground hover:bg-foreground hover:text-background mt-6 inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-medium transition-colors'
                >
                  Visit project
                  <ExternalLink
                    className='h-3.5 w-3.5 transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5'
                    aria-hidden='true'
                  />
                </a>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.article>
    </FadeIn>
  )
}
