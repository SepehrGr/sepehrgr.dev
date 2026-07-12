'use client'

import { Github } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { ContactCardCtas } from './contact-card-ctas'
import { FadeIn } from '@/components/ui/motion-primitives'
import Silk from '../shaders/silk'

const EASE = [0.22, 1, 0.36, 1] as const

const CARD_FADE_MASK =
  'radial-gradient(ellipse 90% 110% at 50% 50%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.92) 40%, rgba(0,0,0,0.7) 70%, rgba(0,0,0,0.4) 90%, rgba(0,0,0,0.15) 100%)'

export function ContactCard(): ReactNode {
  return (
    <section className='mx-auto my-12 w-full max-w-300 px-6 sm:my-20 sm:px-10'>
      <FadeIn>
        <div className='group border-foreground/8 bg-background relative w-full overflow-hidden rounded-4xl border p-1.5 shadow-sm transition-all duration-300 hover:shadow-md'>
          <div className='relative w-full overflow-hidden rounded-[1.6rem]'>
            <div
              aria-hidden='true'
              className='pointer-events-none absolute inset-0 opacity-50 dark:opacity-50'
              style={{
                WebkitMaskImage: CARD_FADE_MASK,
                maskImage: CARD_FADE_MASK,
              }}
            >
              <Silk speed={8} noiseIntensity={1} />
            </div>

            <div className='relative grid gap-8 p-6 sm:gap-10 sm:p-7 md:grid-cols-[1.2fr_1fr] md:items-stretch md:gap-6 md:p-6'>
              <div className='flex flex-col gap-5'>
                <h2 className='text-foreground text-[2.25rem] leading-[1.05] font-semibold tracking-tight sm:text-[2.75rem] lg:text-[3.25rem]'>
                  Let&rsquo;s connect
                </h2>
                <p className='text-foreground/65 mb-6 max-w-[32ch] text-[18px] leading-[1.4] tracking-tight sm:text-[22px]'>
                  Always looking forward to talk about roles, projects, or ideas
                  where strong frontend craft can make a difference.{' '}
                </p>
                <p className='text-foreground/65 mb-6 text-[18px] leading-[1.4] tracking-tight sm:text-[22px]'>
                  Reach out to me at{' '}
                  <a
                    href='mailto:contact@sepehrgr.dev'
                    className='text-foreground/85 group/email relative inline-block font-medium'
                  >
                    contact@sepehrgr.dev
                    <motion.span
                      aria-hidden='true'
                      className='bg-foreground/0 group-hover/email:bg-foreground/55 absolute right-0 bottom-0 left-0 h-[1.5px] origin-left transition-colors duration-300'
                      initial={{ scaleX: 0, opacity: 0 }}
                      whileInView={{ scaleX: 1, opacity: 1 }}
                      viewport={{ once: true, amount: 0.8 }}
                      transition={{
                        delay: 0.25,
                        duration: 0.7,
                        ease: EASE,
                      }}
                    />
                  </a>
                </p>
                <ContactCardCtas />
              </div>

              <div className='border-foreground/8 bg-background/35 dark:bg-background/50 flex flex-col items-center justify-center gap-6 rounded-[1.6rem] border p-6 backdrop-blur-xs sm:p-8'>
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 1.6, ease: EASE }}
                  className='flex flex-col items-center gap-4'
                >
                  <div className='text-foreground/75 flex items-center gap-2 text-[14px] tracking-tight'>
                    <span className='relative inline-flex h-2.5 w-2.5 items-center justify-center'>
                      <motion.span
                        className='absolute inline-flex h-full w-full -translate-y-px rounded-full bg-green-500/50 dark:bg-green-600/70'
                        animate={{
                          scale: [1, 1.65, 1],
                          opacity: [0.75, 0.1, 0.75],
                        }}
                        transition={{
                          duration: 2.2,
                          repeat: Infinity,
                          ease: EASE,
                        }}
                      />
                      <span className='relative inline-flex h-2.5 w-2.5 -translate-y-px rounded-full bg-green-500/70 dark:bg-green-300/70' />
                    </span>
                    <span>Open to select opportunities</span>
                  </div>

                  <div className='flex items-center gap-3'>
                    <SocialIcon
                      href='https://github.com/sepehrgr7'
                      label='Github'
                      lucideIcon={Github}
                      index={0}
                    />
                    <SocialIcon
                      href='https://www.linkedin.com'
                      label='LinkedIn'
                      imageSrc='/linkedin.svg'
                      index={1}
                    />
                    <SocialIcon
                      href='https://x.com'
                      label='X'
                      imageSrc='/x.svg'
                      index={2}
                    />
                  </div>
                </motion.div>
                <div className='flex flex-col items-center gap-1 text-center'>
                  <p className='text-foreground/75 text-[13px] tracking-tight'>
                    2026 &copy; Sepehr Gorgini
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </FadeIn>
    </section>
  )
}

function SocialIcon({
  href,
  label,
  lucideIcon: LucideIcon,
  imageSrc,
  index = 0,
}: {
  href: string
  label: string
  lucideIcon?: React.ComponentType<{
    className?: string
    strokeWidth?: number
  }>
  imageSrc?: string
  index?: number
}): ReactNode {
  const isExternal = href.startsWith('http')
  const externalProps = isExternal
    ? { target: '_blank', rel: 'noopener noreferrer' }
    : {}

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.12 + index * 0.08, duration: 0.55, ease: EASE }}
    >
      <Link
        href={href}
        aria-label={label}
        className='border-foreground/8 hover:border-foreground/15 focus-ring bg-background text-foreground inline-flex h-11 w-11 items-center justify-center rounded-xl border transition-colors'
        {...externalProps}
      >
        <motion.span
          whileHover={{ scale: 1.08, y: -1 }}
          transition={{ type: 'spring', stiffness: 380, damping: 18 }}
          className='inline-flex h-full w-full items-center justify-center'
        >
          {LucideIcon ? (
            <LucideIcon
              className='h-5 w-5'
              strokeWidth={2.5}
              aria-hidden='true'
            />
          ) : imageSrc ? (
            <Image
              src={imageSrc}
              alt=''
              width={16}
              height={16}
              aria-hidden='true'
              className='max-h-5 max-w-5 object-contain dark:invert'
            />
          ) : null}
        </motion.span>
      </Link>
    </motion.div>
  )
}
