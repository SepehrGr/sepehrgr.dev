'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'motion/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLenis } from '@/components/layout/smooth-scroll'
import { NAV_ITEMS, ThemeToggle } from './nav'
import { StaggerContainer, StaggerItem } from '@/lib/motion'

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const lenis = useLenis()

  // Ensure we only portal on client
  useEffect(() => {
    setMounted(true)
  }, [])

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Keyboard escape + body scroll lock
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    const isActive =
      href === '/'
        ? pathname === '/'
        : pathname === href || pathname.startsWith(`${href}/`)

    if (isActive) {
      e.preventDefault()
      if (lenis) {
        lenis.scrollTo(0)
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }

    // Close the menu after interaction
    setIsOpen(false)
  }

  return (
    <>
      {/* Mobile menu trigger button - consistent with site buttons */}
      <button
        type='button'
        onClick={() => setIsOpen(!isOpen)}
        className='focus-ring bg-background/30 dark:bg-background/30 text-foreground ring-foreground/10 hover:bg-foreground/5 relative inline-flex items-center justify-center rounded-full px-3 py-2 ring-1 transition-colors md:hidden'
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isOpen}
        aria-controls='mobile-menu'
      >
        {isOpen ? <span>Close</span> : <span>Menu</span>}
      </button>

      {/* Portal the menu to body so z-index and stacking works independently of the header */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <div className='fixed inset-0 z-60 md:hidden' id='mobile-menu'>
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  className='absolute inset-0 bg-black/30 backdrop-blur-xl dark:bg-black/50'
                  onClick={() => setIsOpen(false)}
                  aria-hidden='true'
                />

                {/* Menu panel */}
                <motion.div
                  initial={{ opacity: 0, y: -12, scale: 0.985 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.985 }}
                  transition={{
                    type: 'spring',
                    stiffness: 340,
                    damping: 34,
                    mass: 0.75,
                  }}
                  className='border-foreground/10 bg-background absolute inset-x-3 top-20 flex h-1/2 flex-col rounded-3xl border px-8 py-6 shadow-2xl'
                >
                  {/* Navigation links */}
                  <nav className='mt-3 flex-1' aria-label='Mobile navigation'>
                    <StaggerContainer className='flex flex-col gap-1'>
                      {NAV_ITEMS.map(item => {
                        const isActive =
                          item.href === '/'
                            ? pathname === '/'
                            : pathname === item.href ||
                              pathname.startsWith(`${item.href}/`)

                        return (
                          <StaggerItem key={item.href}>
                            <Link
                              href={item.href}
                              onClick={e => handleLinkClick(e, item.href)}
                              aria-current={isActive ? 'page' : undefined}
                              className={`group flex items-center rounded-2xl pt-4 pb-2 text-3xl font-medium tracking-[-0.015em] transition-colors ${
                                isActive
                                  ? 'text-foreground'
                                  : 'text-foreground/60 hover:text-foreground'
                              }`}
                            >
                              <span className='relative flex items-center gap-3'>
                                {isActive && (
                                  <span
                                    aria-hidden='true'
                                    className='bg-foreground h-1.5 w-1.5 rounded-full'
                                  />
                                )}
                                {item.label}
                              </span>
                            </Link>
                            <div className='bg-foreground/80 h-px w-full rounded-full'></div>
                          </StaggerItem>
                        )
                      })}
                    </StaggerContainer>
                  </nav>

                  {/* Theme toggle - reuses the exact component from the desktop navbar */}
                  <div className='mt-auto flex pt-6 pb-2'>
                    <ThemeToggle />
                    <p className='text'></p>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  )
}
