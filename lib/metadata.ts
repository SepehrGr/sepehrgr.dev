import type { Metadata } from 'next'

export const siteConfig = {
  name: 'Sepehr Gorgini',
  title: 'Sepehr Gorgini — Frontend Engineer',
  description:
    'Frontend developer specializing in React, Next.js, and TypeScript. Building modern, accessible web experiences.',
  url: 'https://sepehrgr.dev',
  authors: [
    {
      name: 'Sepehr Gorgini',
      url: 'https://sepehrgr.dev'
    }
  ],
  keywords: [
    'Sepehr Gorgini',
    'frontend developer',
    'web developer',
    'React',
    'Next.js',
    'Tailwind CSS',
    'TypeScript',
    'web development',
    'frontend engineer',
    'UI design',
    'portfolio'
  ]
} as const

export const baseMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  authors: [...siteConfig.authors],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },
  alternates: {
    canonical: '/'
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.name
  },
  // og:image, icons and apple-touch-icon come from app/opengraph-image.tsx,
  // app/icon.svg, app/favicon.ico and app/apple-icon.png (file conventions)
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description
  },
  manifest: '/site.webmanifest'
}

export function createMetadata({
  title,
  description,
  path = '/',
  noIndex = false
}: {
  title?: string
  description?: string
  path?: string
  noIndex?: boolean
}): Metadata {
  const url = `${siteConfig.url}${path}`

  return {
    // an explicit `title: undefined` would wipe the layout's default title
    ...(title && { title }),
    description,
    alternates: {
      canonical: path
    },
    openGraph: {
      title: title ?? siteConfig.title,
      description: description ?? siteConfig.description,
      url
    },
    twitter: {
      title: title ?? siteConfig.title,
      description: description ?? siteConfig.description
    },
    ...(noIndex && {
      robots: {
        index: false,
        follow: false
      }
    })
  }
}
