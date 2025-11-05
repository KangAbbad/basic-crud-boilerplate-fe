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

type Props = {
  open: boolean
  title: string
  description: string
  cancelText?: string
  confirmText?: string
  onConfirm: () => void
  onOpenChange: (open: boolean) => void
}

function DeleteDialogContent({ className, ...props }: React.ComponentPropsWithoutRef<typeof AlertDialogContent>) {
  return (
    <AlertDialogContent
      className={cn('w-[calc(100%-32px)] max-w-sm p-3 rounded-lg', className)}
      {...props}
      style={{ animation: 'none' }}
    />
  )
}

function DeleteDialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <AlertDialogHeader className={cn('text-left', className)} {...props} />
}

function DeleteDialogFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex flex-col gap-1', className)} {...props} />
}

function DeleteDialogAction({ className, ...props }: React.ComponentPropsWithoutRef<typeof AlertDialogAction>) {
  return (
    <AlertDialogAction className={cn(buttonVariants({ variant: 'destructive' }), 'w-full', className)} {...props} />
  )
}

function DeleteDialogCancel({ className, ...props }: React.ComponentPropsWithoutRef<typeof AlertDialogCancel>) {
  return <AlertDialogCancel className={cn('w-full mt-0', className)} {...props} />
}

export function DeleteAlertDialog({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  cancelText = 'Batal',
  confirmText = 'Hapus',
}: Props) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <DeleteDialogContent>
        <DeleteDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </DeleteDialogHeader>
        <DeleteDialogFooter>
          <DeleteDialogAction onClick={onConfirm}>{confirmText}</DeleteDialogAction>
          <DeleteDialogCancel>{cancelText}</DeleteDialogCancel>
        </DeleteDialogFooter>
      </DeleteDialogContent>
    </AlertDialog>
  )
}
