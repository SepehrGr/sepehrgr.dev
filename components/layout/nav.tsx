'use client'

import { Moon, Sun } from 'lucide-react'
import { motion } from 'motion/react'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLenis } from '@/components/layout/smooth-scroll'
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from 'react'

type NavItem = {
  label: string
  href: string
}

export const NAV_ITEMS: readonly NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Projects', href: '/projects' },
  { label: 'About', href: '/about' },
]

export function useIsMounted(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )
}

/**
 * `reveal` animates the new theme in a circle from the button (a view
 * transition). Mobile turns it off: Safari and Firefox drop backdrop-filter
 * from the transition snapshot, so the blurred menu and top bar flash clear.
 */
export function ThemeToggle({ reveal = true }: { reveal?: boolean }): ReactNode {
  const mounted = useIsMounted()
  const { setTheme, resolvedTheme } = useTheme()
  const isDark = mounted && resolvedTheme === 'dark'

  const toggleTheme = (event: React.MouseEvent<HTMLButtonElement>): void => {
    const next = isDark ? 'light' : 'dark'

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const supportsViewTransitions =
      typeof document !== 'undefined' &&
      typeof document.startViewTransition === 'function'

    if (!reveal || !supportsViewTransitions || prefersReducedMotion) {
      setTheme(next)
      return
    }

    const rect = event.currentTarget.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const radius = Math.hypot(
      Math.max(cx, window.innerWidth - cx),
      Math.max(cy, window.innerHeight - cy)
    )

    const root = document.documentElement
    root.style.setProperty('--theme-cx', `${cx}px`)
    root.style.setProperty('--theme-cy', `${cy}px`)
    root.style.setProperty('--theme-r', `${radius}px`)
    root.dataset.themeAnim = '1'

    const transition = document.startViewTransition(() => {
      setTheme(next)
    })

    transition.finished.finally(() => {
      delete root.dataset.themeAnim
    })
  }

  return (
    <button
      type='button'
      onClick={toggleTheme}
      aria-label={
        mounted
          ? isDark
            ? 'Switch to light theme'
            : 'Switch to dark theme'
          : 'Toggle theme'
      }
      aria-pressed={mounted ? isDark : undefined}
      className='focus-ring ring-foreground/8 bg-background/40 dark:bg-background/30 relative inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full ring-1 transition-colors md:h-8 md:w-8'
    >
      <span aria-hidden='true' className='relative h-6 w-6 md:h-4 md:w-4'>
        <Sun
          className={`text-foreground absolute inset-0 h-6 w-6 transition-all duration-300 md:h-4 md:w-4 ${
            mounted && isDark
              ? 'scale-100 rotate-0 opacity-100'
              : 'scale-0 -rotate-90 opacity-0'
          }`}
        />
        <Moon
          className={`text-foreground absolute inset-0 h-6 w-6 transition-all duration-300 md:h-4 md:w-4 ${
            mounted && !isDark
              ? 'scale-100 rotate-0 opacity-100'
              : 'scale-0 rotate-90 opacity-0'
          }`}
        />
      </span>
    </button>
  )
}

export function Nav(): ReactNode {
  const pathname = usePathname()
  const lenis = useLenis()
  const listRef = useRef<HTMLUListElement>(null)
  const itemRefs = useRef<Array<HTMLLIElement | null>>([])
  const [pillRect, setPillRect] = useState<{
    x: number
    width: number
  } | null>(null)
  const [hasMeasured, setHasMeasured] = useState(false)

  const activeIndex = NAV_ITEMS.findIndex(item =>
    item.href === '/'
      ? pathname === '/'
      : pathname === item.href || pathname.startsWith(`${item.href}/`)
  )

  useLayoutEffect(() => {
    const list = listRef.current
    const activeEl = activeIndex >= 0 ? itemRefs.current[activeIndex] : null
    if (!list || !activeEl) return
    const listRect = list.getBoundingClientRect()
    const itemRect = activeEl.getBoundingClientRect()
    setPillRect({
      x: itemRect.left - listRect.left,
      width: itemRect.width,
    })
  }, [activeIndex, pathname])

  useEffect(() => {
    if (!pillRect) return
    const id = requestAnimationFrame(() => setHasMeasured(true))
    return () => cancelAnimationFrame(id)
  }, [pillRect])

  return (
    <nav aria-label='Primary' className='hidden md:block'>
      <div className='border-foreground/8 bg-background/30 flex items-center gap-1 rounded-full border p-1.5 shadow-sm backdrop-blur'>
        <ul ref={listRef} className='relative flex items-center gap-1'>
          {/* keep mounted across route changes so the spring can run */}
          {pillRect && activeIndex >= 0 && (
            <motion.span
              aria-hidden='true'
              initial={false}
              animate={{ x: pillRect.x, width: pillRect.width }}
              transition={
                hasMeasured
                  ? { type: 'spring', stiffness: 380, damping: 32 }
                  : { duration: 0 }
              }
              style={{ left: 0, top: 0, bottom: 0 }}
              className='ring-foreground/8 bg-background/50 dark:bg-background/35 absolute rounded-full ring-1'
            />
          )}
          {NAV_ITEMS.map((item, index) => {
            const isActive = index === activeIndex
            return (
              <li
                key={item.href}
                ref={el => {
                  itemRefs.current[index] = el
                }}
                className='relative'
              >
                <Link
                  href={item.href}
                  aria-current={isActive ? 'page' : undefined}
                  onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                    if (isActive) {
                      e.preventDefault()
                      if (lenis) {
                        lenis.scrollTo(0)
                      } else {
                        window.scrollTo({ top: 0, behavior: 'smooth' })
                      }
                    }
                  }}
                  className='focus-ring relative inline-flex cursor-pointer items-center justify-center rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-300'
                >
                  <span
                    className={
                      isActive
                        ? 'text-foreground relative z-10'
                        : 'text-foreground/70 hover:text-foreground relative z-10'
                    }
                  >
                    {item.label}
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
        <ThemeToggle />
      </div>
    </nav>
  )
}
