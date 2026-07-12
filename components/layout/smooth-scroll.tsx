'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode
} from 'react'
import Lenis from 'lenis'
import { features } from '@/lib/config'

const LENIS_OPTIONS = {
  duration: 1.6,
  easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  orientation: 'vertical' as const,
  gestureOrientation: 'vertical' as const,
  smoothWheel: true,
  wheelMultiplier: 1,
  touchMultiplier: 2
}

const LenisContext = createContext<Lenis | null>(null)

export function useLenis(): Lenis | null {
  return useContext(LenisContext)
}

export function SmoothScroll({ children }: { children: ReactNode }): ReactNode {
  const [lenis, setLenis] = useState<Lenis | null>(null)

  useEffect(() => {
    if (!features.smoothScroll) return

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    if (prefersReducedMotion) return

    const lenisInstance = new Lenis(LENIS_OPTIONS)

    // Schedule state update via microtask so it is not synchronous inside the effect body
    // (avoids "set-state-in-effect" lint rule while still exposing the instance promptly).
    queueMicrotask(() => {
      setLenis(lenisInstance)
    })

    function raf(time: number): void {
      lenisInstance.raf(time)
      requestAnimationFrame(raf)
    }

    const rafId = requestAnimationFrame(raf)

    function handleAnchorClick(e: MouseEvent): void {
      const target = e.target as HTMLElement
      const anchor = target.closest('a[href^="#"]')
      if (!anchor) return

      const href = anchor.getAttribute('href')
      if (!href || href === '#') return

      const element = document.querySelector(href)
      if (!element) return

      e.preventDefault()
      lenisInstance.scrollTo(element as HTMLElement, { offset: -100 })
    }

    document.addEventListener('click', handleAnchorClick)

    return () => {
      document.removeEventListener('click', handleAnchorClick)
      cancelAnimationFrame(rafId)
      lenisInstance.destroy()
      setLenis(null)
    }
  }, [])

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
}
