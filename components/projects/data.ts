// PLACEHOLDER projects. Every entry below is sample content and must be
// replaced with real work before this ships:
//   name, summary, role, year, stack — the facts shown on every row/window
//   liveUrl / repoUrl              — omit repoUrl for client work; the
//                                    row then says "Client work" by the year
//   shot                           — a full-page screenshot, 1024px wide;
//                                    height = its pixel height. The top is
//                                    the homepage preview, the whole page
//                                    pans inside the /projects window.
//   accent                         — tint used on hover and window glow
// The placeholder screenshots in public/projects/ are of this site itself.

export type Project = {
  id: string
  name: string
  summary: string
  role: string
  year: string
  stack: string[]
  liveUrl: string
  repoUrl?: string
  shot: { src: string; height: number; alt: string }
  accent: string
}

export const PROJECTS: Project[] = [
  {
    id: 'atlas',
    name: 'Atlas Studio',
    summary: 'Marketing site and headless CMS for a creative studio.',
    role: 'Frontend Engineer',
    year: '2025',
    stack: ['Next.js', 'TypeScript', 'Sanity'],
    liveUrl: 'https://example.com',
    repoUrl: 'https://github.com/sepehrgr',
    shot: {
      src: '/projects/placeholder-home-light.webp',
      height: 2775,
      alt: 'Atlas Studio homepage',
    },
    accent: '#b6a0f7',
  },
  {
    id: 'rhythm',
    name: 'Rhythm',
    summary: 'A weekly analytics digest that reads like a short story.',
    role: 'Frontend Engineer',
    year: '2024',
    stack: ['React', 'D3', 'Node.js'],
    liveUrl: 'https://example.com',
    shot: {
      src: '/projects/placeholder-projects-dark.webp',
      height: 2736,
      alt: 'Rhythm weekly digest',
    },
    accent: '#6ec7b5',
  },
  {
    id: 'groove',
    name: 'Groove',
    summary: 'Lesson booking for a music school, from teacher to time slot.',
    role: 'Frontend Engineer',
    year: '2023',
    stack: ['Next.js', 'Stripe', 'Tailwind'],
    liveUrl: 'https://example.com',
    repoUrl: 'https://github.com/sepehrgr',
    shot: {
      src: '/projects/placeholder-about-light.webp',
      height: 2419,
      alt: 'Groove booking flow',
    },
    accent: '#f2c36f',
  },
  {
    id: 'fieldnote',
    name: 'Fieldnote',
    summary: 'Offline-first capture tool for research interviews.',
    role: 'Frontend Engineer',
    year: '2024',
    stack: ['React', 'IndexedDB', 'PWA'],
    liveUrl: 'https://example.com',
    repoUrl: 'https://github.com/sepehrgr',
    shot: {
      src: '/projects/placeholder-home-dark.webp',
      height: 2775,
      alt: 'Fieldnote capture screen',
    },
    accent: '#77a8e8',
  },
]
