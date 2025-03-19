import { cn } from '@/utils'

export const Content = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <main className={cn('grow-0 shrink-0 z-40 h-full', className)}>
      {children}
    </main>
  )
}
