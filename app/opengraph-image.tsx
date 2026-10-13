import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'

import { siteConfig } from '@/lib/metadata'

export const alt = siteConfig.title
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const INK = '#0a0a0a'
const PAPER = '#f9f8f6'

export default async function OpenGraphImage(): Promise<ImageResponse> {
  const [regular, bold] = await Promise.all([
    readFile(join(process.cwd(), 'assets/j-regular.ttf')),
    readFile(join(process.cwd(), 'assets/j-bold.ttf'))
  ])

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 80,
          color: INK,
          fontFamily: 'j',
          backgroundColor: PAPER,
          // echoes the hero flow shader's lavender bloom
          backgroundImage:
            'radial-gradient(ellipse 120% 80% at 50% -10%, rgba(123,104,255,0.55) 0%, rgba(160,148,255,0.25) 45%, rgba(249,248,246,0) 75%)'
        }}
      >
        <svg width='88' height='88' viewBox='0 0 440 440' fill='none'>
          <path
            d='M10 355.882V270C10 258.954 18.9543 250 30 250H60C71.0457 250 80 258.954 80 270V304.118C80 315.163 88.9543 324.118 100 324.118L205 324.118C216.046 324.118 225 315.163 225 304.118V270C225 258.954 233.954 250 245 250L360 250H410C421.046 250 430 258.954 430 270V324.118V355.882V410C430 421.046 421.046 430 410 430H360H80H30C18.9543 430 10 421.046 10 410V355.882Z'
            stroke={INK}
            strokeWidth='20'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            d='M430 84.1176V170C430 181.046 421.046 190 410 190H380C368.954 190 360 181.046 360 170V135.882C360 124.837 351.046 115.882 340 115.882L235 115.882C223.954 115.882 215 124.837 215 135.882V170C215 181.046 206.046 190 195 190L80 190H30C18.9543 190 10 181.046 10 170V115.882V84.1176V30C10 18.9543 18.9543 10 30 10H80H360H410C421.046 10 430 18.9543 430 30V84.1176Z'
            stroke={INK}
            strokeWidth='20'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div
            style={{
              fontSize: 104,
              fontWeight: 700,
              letterSpacing: '-0.03em',
              lineHeight: 1
            }}
          >
            {siteConfig.name}
          </div>
          <div
            style={{
              fontSize: 48,
              letterSpacing: '-0.02em',
              color: 'rgba(10,10,10,0.65)'
            }}
          >
            Frontend Engineer
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 30,
            letterSpacing: '-0.01em',
            color: 'rgba(10,10,10,0.65)'
          }}
        >
          <span>React · Next.js · TypeScript</span>
          <span>sepehrgr.dev</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'j', data: regular, weight: 400, style: 'normal' },
        { name: 'j', data: bold, weight: 700, style: 'normal' }
      ]
    }
  )
}
