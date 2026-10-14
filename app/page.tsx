import { ContactCard } from '@/components/contact/contact-card'
import { Hero } from '@/components/hero/hero'
import { ProjectIndex } from '@/components/projects/projects'
import { createMetadata, siteConfig } from '@/lib/metadata'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = createMetadata({
  description: `${siteConfig.name}. ${siteConfig.description}`,
  path: '/',
})

export default function HomePage(): ReactNode {
  return (
    <main id='main-content' className='flex flex-1 flex-col gap-20 sm:gap-28'>
      {/* <PageBackdrop /> */}
      <Hero />
      <ProjectIndex />
      <ContactCard />
      <div className='h-12 sm:h-16' />
    </main>
  )
}
