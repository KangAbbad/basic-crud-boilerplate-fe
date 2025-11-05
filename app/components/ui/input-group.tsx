import type { HTMLAttributes, InputHTMLAttributes } from 'react'

import { cn } from '~/lib/utils/cn'

type InputGroupProps = HTMLAttributes<HTMLDivElement>

function InputGroup({ className, children, ...props }: InputGroupProps) {
  return (
    <div
      className={cn(
        'flex items-center h-10 min-w-0 rounded-md border border-input bg-transparent shadow-xs transition-[color,box-shadow] outline-none focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive overflow-hidden',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

type InputGroupInputProps = InputHTMLAttributes<HTMLInputElement>

function InputGroupInput({ className, ...props }: InputGroupInputProps) {
  return (
    <input
      className={cn(
        'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 flex-1 min-w-0 bg-transparent px-3 py-2 text-base shadow-none outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:ring-0',
        className
      )}
      data-slot="input-group-control"
      {...props}
    />
  )
}

type InputGroupAddonProps = HTMLAttributes<HTMLDivElement> & {
  align?: 'inline-start' | 'inline-end' | 'block-start' | 'block-end'
}

function InputGroupAddon({ className, align = 'inline-start', children, ...props }: InputGroupAddonProps) {
  const alignClass = {
    'inline-start': '',
    'inline-end': 'order-last ml-auto',
    'block-start': '',
    'block-end': '',
  }[align]

  return (
    <div className={cn('flex items-center px-3 py-2 text-sm', alignClass, className)} {...props}>
      {children}
    </div>
  )
}

type InputGroupTextProps = HTMLAttributes<HTMLDivElement>

function InputGroupText({ className, ...props }: InputGroupTextProps) {
  return <div className={cn('text-muted-foreground pointer-events-none', className)} {...props} />
}

export { InputGroup, InputGroupInput, InputGroupAddon, InputGroupText }
