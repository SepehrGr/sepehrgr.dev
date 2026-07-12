import { Education } from '@/components/about/education'
import { Experience } from '@/components/about/experience'
import { PolaroidStrip } from '@/components/about/polaroid-strip'
import { Skills } from '@/components/about/skills'
import { Stack } from '@/components/about/stack'
import { ContactCard } from '@/components/contact/contact-card'
import { FadeIn } from '@/components/ui/motion-primitives'
import { createMetadata } from '@/lib/metadata'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = createMetadata({
  title: 'About',
  description: 'About me, background, and how to get in touch.',
  path: '/about'
})

export default function AboutPage(): ReactNode {
  return (
    <main id='main-content' className='flex flex-1 flex-col'>
      <section className='mx-auto w-full max-w-312 pt-40 sm:pt-56'>
        <PolaroidStrip />
      </section>

      <section className='mx-auto w-full max-w-160 px-6 pt-20 pb-16 sm:px-10 sm:pt-28 sm:pb-24'>
        <FadeIn delay={0.5}>
          <div className='border-foreground/5 bg-foreground/1.5 dark:bg-foreground/3 rounded-4xl border p-8 backdrop-blur-sm sm:p-12'>
            <h1 className='text-foreground font-serif text-[1.75rem] font-medium tracking-tight sm:text-[2rem]'>
              Hello! I&rsquo;m{' '}
              <span className='border-foreground/30 border-b pb-0.5'>
                Sepehr Gorgini
              </span>
              .
            </h1>
            <div className='text-foreground/75 mt-8 space-y-6 text-[17px] leading-[1.7] tracking-tight sm:text-[18px]'>
              <p>
                A{' '}
                <strong className='text-foreground font-semibold'>
                  product designer and frontend engineer
                </strong>{' '}
                passionate about building intuitive, human-centered digital
                experiences. With a background in{' '}
                <strong className='text-foreground font-semibold'>
                  visual craft
                </strong>{' '}
                and{' '}
                <strong className='text-foreground font-semibold'>
                  interaction design
                </strong>
                , I bring a unique blend of design thinking and technical
                execution to every project.
              </p>
              <p>
                My journey into design began when I realized how often good user
                experience was missing from powerful tools. That led me to
                embrace{' '}
                <strong className='text-foreground font-semibold'>
                  user-centered design
                </strong>{' '}
                as both a mindset and a craft, one that balances clarity,
                creativity, and functionality.
              </p>
              <p>
                Currently leading design at small product teams shipping
                software for{' '}
                <strong className='text-foreground font-semibold'>
                  creative professionals
                </strong>
                , I&rsquo;m always looking for opportunities to{' '}
                <strong className='text-foreground font-semibold'>
                  shape thoughtful interfaces and build scalable design systems
                </strong>
                .
              </p>
            </div>
          </div>
        </FadeIn>
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
