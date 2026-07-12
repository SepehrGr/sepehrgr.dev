'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLenis } from '@/components/layout/smooth-scroll'

export default function Logo() {
  const pathname = usePathname()
  const lenis = useLenis()

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === '/') {
      e.preventDefault()
      if (lenis) {
        lenis.scrollTo(0)
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }
  }

  return (
    <Link
      href='/'
      onClick={handleClick}
      className='focus-ring z-50 flex items-center gap-2 rounded-2xl p-1 transition-colors duration-300 md:top-10 md:left-10'
      aria-label='Sepehr Gorgini - Home'
    >
      <div className='text-foreground w-11 md:w-12.5'>
        <svg
          viewBox='0 0 440 440'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M10 355.882V270C10 258.954 18.9543 250 30 250H60C71.0457 250 80 258.954 80 270V304.118C80 315.163 88.9543 324.118 100 324.118L205 324.118C216.046 324.118 225 315.163 225 304.118V270C225 258.954 233.954 250 245 250L360 250H410C421.046 250 430 258.954 430 270V324.118V355.882V410C430 421.046 421.046 430 410 430H360H80H30C18.9543 430 10 421.046 10 410V355.882Z'
            stroke='currentColor'
            strokeWidth='20'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            d='M430 84.1176V170C430 181.046 421.046 190 410 190H380C368.954 190 360 181.046 360 170V135.882C360 124.837 351.046 115.882 340 115.882L235 115.882C223.954 115.882 215 124.837 215 135.882V170C215 181.046 206.046 190 195 190L80 190H30C18.9543 190 10 181.046 10 170V115.882V84.1176V30C10 18.9543 18.9543 10 30 10H80H360H410C421.046 10 430 18.9543 430 30V84.1176Z'
            stroke='currentColor'
            strokeWidth='20'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
      </div>
      <p
        className={'hidden flex-col text-lg/5 md:visible md:flex md:text-xl/6'}
      >
        <span className='block whitespace-nowrap'>Sepehr</span>
        <span className='block whitespace-nowrap'>Gorgini</span>
      </p>
    </Link>
  )
}
