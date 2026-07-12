import type { ReactNode } from 'react'

const SKILLS = [
  'Frontend Development',
  'React & TypeScript',
  'Next.js',
  'Testing',
  'UI/UX Design',
  'Prototyping & Motion',
  'Interaction Design',
  'Accessibility',
]

export function Skills(): ReactNode {
  return (
    <div className='flex flex-col gap-3'>
      <h3 className='text-foreground text-[15px] font-semibold tracking-tight'>
        What I do
      </h3>
      <div className='border-foreground/5 bg-foreground/2 dark:bg-foreground/5 rounded-4xl border p-2 sm:p-4'>
        <div className='flex flex-wrap gap-3'>
          {SKILLS.map(skill => (
            <span
              key={skill}
              className='border-foreground/8 bg-background text-foreground/85 rounded-full border px-4 py-2 text-[14px] tracking-tight sm:text-[15px]'
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
