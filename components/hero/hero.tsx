'use client'
import type { ReactNode } from 'react'

import dynamic from 'next/dynamic'
import { HeroCtas } from './hero-ctas'
import { FadeIn, ScaleUnblur } from '@/components/ui/motion-primitives'
import RotatingText from '../ui/rotating-text'

// three.js loads after first paint, in its own chunk
const Keycaps = dynamic(() => import('./keycaps').then(m => m.Keycaps), {
  ssr: false,
  loading: () => <div className='aspect-square w-full' />,
})

export function Hero(): ReactNode {
  return (
    // at least one screen tall so the first view shows only the hero
    <section className='relative min-h-svh w-full'>
      <div className='mx-auto w-full max-w-300 px-6 pt-28 pb-24 sm:px-10 sm:pt-56 sm:pb-32 md:pt-44'>
        <div className='grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-8'>
          <FadeIn className='flex flex-col gap-4'>
            <p className='text-foreground leading-tight tracking-tight md:text-[20px]'>
              Hey
              <span aria-hidden='true' className='mx-0.5'>
                👋
              </span>{' '}
              I&rsquo;m Sepehr
            </p>

            <h1 className='text-foreground text-[2rem] leading-[1.05] font-bold tracking-tight md:text-[2.5rem] lg:text-[3rem] xl:text-[3.4rem]'>
              <span className='mb-2 block text-[2.2rem] whitespace-nowrap md:text-[2.7rem] lg:text-[3.2rem] xl:text-[3.6rem]'>
                Frontend Engineer &{' '}
              </span>
              <RotatingText
                texts={[
                  'Problem Solver',
                  'UX-Minded Builder',
                  'Pixel Perfectionist',
                  'Lifelong Learner',
                  'Dark-Mode Purist',
                ]}
                mainClassName='bg-foreground rounded-xl md:rounded-2xl text-background overflow-hidden p-2 md:px-3'
                staggerFrom='first'
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '-120%' }}
                staggerDuration={0.025}
                splitLevelClassName='overflow-hidden pb-0.5 sm:pb-1 md:pb-1'
                transition={{ type: 'spring', damping: 30, stiffness: 400 }}
                rotationInterval={2500}
                splitBy='characters'
                animatePresenceMode='wait'
                animatePresenceInitial={false}
                auto
                loop
              />
            </h1>

            <p className='text-foreground/65 max-w-[31ch] text-[18px] leading-[1.4] tracking-tight md:text-[22px]'>
              I craft interfaces that balance clarity, performance, and polish,
              without overcomplicating the product.
            </p>

            <HeroCtas />
          </FadeIn>

          <ScaleUnblur className='flex justify-center md:justify-end'>
            <div className='w-full md:max-w-140'>
              <Keycaps />
            </div>
          </ScaleUnblur>
        </div>
      </div>
    </section>
  )
}
