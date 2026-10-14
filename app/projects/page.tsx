import { ContactCard } from '@/components/contact/contact-card'
import { ProjectWindows } from '@/components/projects/projects'
import { FadeIn } from '@/components/ui/motion-primitives'
import { createMetadata } from '@/lib/metadata'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = createMetadata({
  title: 'Projects',
  description: 'Selected work and case studies.',
  path: '/projects',
})

export default function ProjectsPage(): ReactNode {
  return (
    <main id='main-content' className='flex flex-1 flex-col'>
      <section className='relative mx-auto w-full max-w-275 overflow-hidden px-6 pt-44 pb-16 sm:px-10 sm:pt-100 sm:pb-20'>
        <div className='bg-foreground/5 pointer-events-none absolute top-24 left-1/2 -z-10 h-100 w-100 -translate-x-1/2 rounded-full blur-3xl' />
        <FadeIn className='flex flex-col items-center gap-5 text-center'>
          <h1 className='text-foreground font-serif text-[2.75rem] leading-[1.05] font-medium tracking-tight md:text-[3.25rem] lg:text-[3.75rem]'>
            A little closer to the work.
          </h1>
          <p className='text-foreground/65 max-w-[38ch] text-[20px] leading-[1.4] tracking-tight sm:text-[22px]'>
            Each project sits in a live window. Hover to scroll through it, or
            visit the real thing.
          </p>
        </FadeIn>
      </section>
      <ProjectWindows />
      <ContactCard />
      <div className='h-12 sm:h-16' />
    </main>
  )
}
