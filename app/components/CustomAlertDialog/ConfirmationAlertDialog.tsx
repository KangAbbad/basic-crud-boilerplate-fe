import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '~/components/ui/alert-dialog'
import { buttonVariants } from '~/components/ui/button'
import { cn } from '~/lib/utils/cn'

type ButtonVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'info' | 'link'

type Props = {
  open: boolean
  title: string
  description: string
  variant?: ButtonVariant
  cancelText?: string
  confirmText?: string
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

function ConfirmationDialogContent({ className, ...props }: React.ComponentPropsWithoutRef<typeof AlertDialogContent>) {
  return (
    <AlertDialogContent
      className={cn('w-[calc(100%-32px)] max-w-sm p-3 rounded-lg', className)}
      {...props}
      style={{ animation: 'none' }}
    />
  )
}

function ConfirmationDialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <AlertDialogHeader className={cn('text-left', className)} {...props} />
}

function ConfirmationDialogFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex flex-col gap-1', className)} {...props} />
}

function ConfirmationDialogAction({
  className,
  variant = 'default',
  ...props
}: React.ComponentPropsWithoutRef<typeof AlertDialogAction> & { variant?: ButtonVariant }) {
  return <AlertDialogAction className={cn(buttonVariants({ variant }), 'w-full', className)} {...props} />
}

function ConfirmationDialogCancel({ className, ...props }: React.ComponentPropsWithoutRef<typeof AlertDialogCancel>) {
  return <AlertDialogCancel className={cn('w-full mt-0', className)} {...props} />
}

export function ConfirmationAlertDialog({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  variant = 'default',
  cancelText = 'Cancel',
  confirmText = 'Confirm',
}: Props) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <ConfirmationDialogContent>
        <ConfirmationDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </ConfirmationDialogHeader>
        <ConfirmationDialogFooter>
          <ConfirmationDialogAction variant={variant} onClick={onConfirm}>
            {confirmText}
          </ConfirmationDialogAction>
          <ConfirmationDialogCancel>{cancelText}</ConfirmationDialogCancel>
        </ConfirmationDialogFooter>
      </ConfirmationDialogContent>
    </AlertDialog>
  )
}
