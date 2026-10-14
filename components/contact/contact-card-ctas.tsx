'use client'

import { LayoutGroup, motion } from 'motion/react'
import type { ReactNode } from 'react'

import { ContactButton } from './contact-button'

const EASE = [0.22, 1, 0.36, 1] as const

export function ContactCardCtas(): ReactNode {
  return (
    <LayoutGroup>
      <motion.div
        layout
        transition={{ layout: { duration: 0.55, ease: EASE } }}
        className='mt-2 flex flex-wrap items-center gap-3'
      >
        <ContactButton />
      </motion.div>
    </LayoutGroup>
  )
}
