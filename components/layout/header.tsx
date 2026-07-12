'use client'

import { useEffect, useState } from 'react'
import type Lenis from 'lenis'
import Logo from '../ui/logo'
import { Nav } from './nav'
import { useLenis } from './smooth-scroll'
import MobileNav from './mobile-nav'

export function Header() {
  const lenis = useLenis()
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const updateScrolled = (y: number) => {
      setIsScrolled(y > 100)
    }

    // Set initial value immediately
    const initialY = lenis ? lenis.scroll : window.scrollY
    updateScrolled(initialY)

    if (lenis) {
      const onLenisScroll = (instance: Lenis) => {
        updateScrolled(instance.scroll)
      }
      lenis.on('scroll', onLenisScroll)
      return () => {
        lenis.off('scroll', onLenisScroll)
      }
    } else {
      const onWindowScroll = () => updateScrolled(window.scrollY)
      window.addEventListener('scroll', onWindowScroll, { passive: true })
      return () => window.removeEventListener('scroll', onWindowScroll)
    }
  }, [lenis])

  return (
    <div
      className={`fixed top-0 left-1/2 z-70 flex w-full -translate-x-1/2 items-center justify-between rounded-none px-5 py-3 transition duration-500 md:top-5 md:max-w-300 md:rounded-2xl md:px-9 md:py-2 ${
        isScrolled ? 'bg-white/10 backdrop-blur-2xl dark:bg-white/5' : ''
      }`}
    >
      <Logo />
      <div className='hidden md:block'>
        <Nav />
      </div>
      <MobileNav />
    </div>
  )
}
