import localFont from 'next/font/local'

// Only the weights the site uses. The OG image reads j-regular/j-bold directly.
export const Jokker = localFont({
  src: [
    { path: '../assets/j-regular.ttf', weight: '400' },
    { path: '../assets/j-medium.ttf', weight: '500' },
    { path: '../assets/j-semibold.ttf', weight: '600' },
    { path: '../assets/j-bold.ttf', weight: '700' },
  ],
  variable: '--font-jokker',
  display: 'swap',
})
