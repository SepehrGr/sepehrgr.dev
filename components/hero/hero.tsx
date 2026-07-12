'use client'
import type { ReactNode } from 'react'

import { HeroCtas } from './hero-ctas'
import { FadeIn, ScaleUnblur } from '@/components/ui/motion-primitives'
import { PortraitMorph } from './portrait-morph'
import RotatingText from '../ui/rotating-text'

const PORTRAIT_SRC = '/josh.webp'
const PORTRAIT_HOVER_SRC = '/josh_wave.webp'

export function Hero(): ReactNode {
  return (
    <section className='relative w-full'>
      <div className='mx-auto w-full max-w-300 px-6 pt-44 pb-24 sm:px-10 sm:pt-56 sm:pb-32'>
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
                  'Detail-Oriented',
                  'Pixel Perfectionist',
                  'Lifelong Learner',
                ]}
                mainClassName='bg-foreground rounded-xl md:rounded-2xl text-background overflow-hidden p-2 md:px-3 backdrop-blur-lg'
                staggerFrom='last'
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
              I craft interfaces that balance clarity, performance, and polish —
              without overcomplicating the product.{' '}
            </p>

            <HeroCtas />
          </FadeIn>

          <ScaleUnblur className='flex justify-stretch md:justify-end'>
            <div className='border-foreground/8 bg-background relative aspect-square w-full overflow-hidden rounded-4xl border p-1.5 shadow-sm md:max-w-105'>
              <div className='relative h-full w-full overflow-hidden rounded-[1.6rem]'>
                <PortraitMorph
                  srcA={PORTRAIT_SRC}
                  srcB={PORTRAIT_HOVER_SRC}
                  alt='Josh portrait'
                />
              </div>
            </div>
          </ScaleUnblur>
        </div>
      </div>
    </section>
  )
}
