import { Education } from '@/components/about/education'
import { Experience } from '@/components/about/experience'
import { PortraitMorph } from '@/components/about/portrait-morph'
import { Skills } from '@/components/about/skills'
import { Stack } from '@/components/about/stack'
import { ContactCard } from '@/components/contact/contact-card'
import { FadeIn, ScaleUnblur } from '@/components/ui/motion-primitives'
import { createMetadata } from '@/lib/metadata'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = createMetadata({
  title: 'About',
  description: 'About me, background, and how to get in touch.',
  path: '/about',
})

export default function AboutPage(): ReactNode {
  return (
    <main id='main-content' className='flex flex-1 flex-col'>
      <section className='mx-auto w-full max-w-300 px-6 pt-36 pb-16 sm:px-10 sm:pt-48 sm:pb-24'>
        <div className='grid items-center gap-8 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] md:gap-10'>
          <FadeIn delay={0.3} className='order-2 md:order-1'>
            <div>
              <h1 className='text-foreground text-[1.75rem] font-medium tracking-tight sm:text-[2rem]'>
                Hello! {/* two lines below desktop, one line from lg up */}
                <span className='block lg:inline'>
                  I&rsquo;m{' '}
                  <span className='border-foreground/30 border-b pb-0.5 whitespace-nowrap'>
                    Sepehr Gorgini
                  </span>
                  .
                </span>
              </h1>
              <div className='text-foreground/75 mt-8 max-w-[62ch] space-y-6 text-[17px] leading-[1.7] tracking-tight sm:text-[18px]'>
                <p>
                  I&rsquo;m a{' '}
                  <strong className='text-foreground font-semibold'>
                    frontend engineer
                  </strong>
                  . Since 2022 I&rsquo;ve been freelancing, building websites
                  and web apps for clients, mostly with React, Next.js and
                  TypeScript.
                </p>
                <p>
                  I spend most of my time on the parts people actually touch:
                  layouts that hold up on any screen, interactions that feel
                  right, and pages that don&rsquo;t keep you waiting. I like
                  sweating the small details, because they&rsquo;re usually what
                  makes something feel finished.
                </p>
                <p>
                  I studied Computer Science at the University of Hormozgan.
                  Right now I&rsquo;m open to new work, whether that&rsquo;s a
                  full-time role or a freelance project. If you have something
                  in mind, I&rsquo;d like to hear about it.
                </p>
              </div>
            </div>
          </FadeIn>

          <ScaleUnblur className='order-1 mx-auto w-full max-w-90 md:order-2 md:max-w-none'>
            <div className='border-foreground/8 bg-background relative aspect-square w-full overflow-hidden rounded-4xl border p-1.5 shadow-sm'>
              <div className='relative h-full w-full overflow-hidden rounded-[1.6rem]'>
                <PortraitMorph
                  srcA='/sepehr.webp'
                  srcB='/sepehr-wave.webp'
                  alt='Illustrated portrait of Sepehr Gorgini'
                />
              </div>
            </div>
          </ScaleUnblur>
        </div>
      </section>

      <section className='mx-auto w-full max-w-160 px-6 pb-20 sm:px-10 sm:pb-28'>
        <FadeIn delay={0.1}>
          <div className='flex flex-col gap-10'>
            <Experience />
            <Education />
            <Skills />
            <Stack />
          </div>
        </FadeIn>
      </section>

      <ContactCard />
      <div className='h-12 sm:h-16' />
    </main>
  )
}
