'use client'

import type { ReactNode } from 'react'

import { ShaderFlow } from '../shaders/shader-flow'
import { useTheme } from 'next-themes'

export function PageBackdrop(): ReactNode {
  const theme = useTheme()
  const isDark = theme.theme === 'dark'

  return (
    <div
      aria-hidden='true'
      className='pointer-events-none absolute inset-x-0 top-0 -z-10 h-450 overflow-hidden'
    >
      <div className='absolute inset-0 opacity-80 blur-xs'>
        <ShaderFlow
          colorLowA={isDark ? [0.15, 0.1, 0.4] : [0.15, 0.1, 0.5]}
          colorHighA={isDark ? [0.4, 0.4, 0.4] : [0.6, 0.6, 0.6]}
          brightness={isDark ? 3 : 2}
          iterations={25}
          flowSpeed={[0, 0.15]}
        />
      </div>
    </div>
  )
}
