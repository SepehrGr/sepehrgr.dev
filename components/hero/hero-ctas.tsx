import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import type { ReactNode } from 'react'

import { ResumeButton } from '@/components/contact/resume-button'

export function HeroCtas(): ReactNode {
  return (
    <div className='mt-2 flex flex-wrap items-center gap-3'>
      <ResumeButton solid />
      <Link
        href='/about'
        className='border-foreground/5 focus-ring group bg-background text-foreground hover:bg-foreground/4 inline-flex cursor-pointer items-center gap-2 rounded-xl border px-5 py-3 text-sm font-medium shadow-2xl transition-colors'
      >
        Get to Know Me
        <ArrowRight
          className='h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5'
          aria-hidden='true'
        />
      </Link>
    </div>
  )
}
