import { FileText } from 'lucide-react'
import type { ReactNode } from 'react'

// PLACEHOLDER: points at the local test CV, which isn't committed.
// Put the real PDF in public/ and update this path before merging.
export const RESUME_URL = '/TEST_Sepehr_Gorgini_Frontend_Engineer_CV.pdf'

const OUTLINE =
  'border-foreground/5 bg-background text-foreground hover:bg-foreground/4 border py-3 shadow-2xl'
const SOLID = 'bg-foreground text-background hover:bg-foreground/85 h-11'

export function ResumeButton({ solid = false }: { solid?: boolean }): ReactNode {
  return (
    <a
      href={RESUME_URL}
      target='_blank'
      rel='noopener noreferrer'
      className={`focus-ring inline-flex cursor-pointer items-center gap-2 rounded-xl px-5 text-sm font-medium transition-colors ${solid ? SOLID : OUTLINE}`}
    >
      <FileText className='h-4 w-4' aria-hidden='true' />
      Résumé
      <span className='sr-only'>(PDF, opens in new tab)</span>
    </a>
  )
}
