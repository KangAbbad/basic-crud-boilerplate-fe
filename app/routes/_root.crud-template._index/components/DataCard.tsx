import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import { SquarePenIcon, Trash2Icon } from 'lucide-react'
import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router'

import { dataActions } from '../stores/crud-template.store'
import type { DataDTO } from '../types/crud-template.types'

import { ConfirmationAlertDialog } from '~/components/CustomAlertDialog/ConfirmationAlertDialog'
import { DeleteAlertDialog } from '~/components/CustomAlertDialog/DeleteAlertDialog'
import { OrganizationScopeBadge } from '~/components/OutletScopeBadge'
import { Button } from '~/components/ui/button'
import { Card } from '~/components/ui/card'
import { cn } from '~/lib/utils/cn'
import { formatCurrency } from '~/lib/utils/currencyFormatter'

type Props = {
  data: DataDTO
}

export function DataCard({ data }: Props) {
  const navigate = useNavigate()
  const isDraft: boolean = data.status === 'draft'
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false)
  const [showCompleteConfirm, setShowCompleteConfirm] = useState<boolean>(false)

  const navigateToDataForm = useCallback(
    (slug: string) => {
      navigate(`/crud-template/form?slug=${slug}`)
    },
    [navigate]
  )

  const deleteData = useCallback((slug: string) => {
    dataActions.deleteData(slug)
  }, [])

  const submitDataDeletion = () => {
    deleteData(data.slug)
    setShowDeleteConfirm(false)
  }

  const statusColor = {
    draft: 'bg-gray-100 text-gray-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  }

  const statusLabel = {
    draft: 'Draft',
    completed: 'Completed',
    cancelled: 'Cancelled',
  }

  return (
    <>
      <Card className="rounded-none border-t-0 border-r-0 border-l-0 border-gray-200 py-4 shadow-none">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-wrap min-w-0">
              <span
                className={cn(
                  'font-bold text-xs uppercase px-2 py-1 rounded-full whitespace-nowrap',
                  statusColor[data.status]
                )}
              >
                {statusLabel[data.status]}
              </span>
              <OrganizationScopeBadge organizationId={data.organizationId} />
            </div>
            {isDraft && (
              <div className="flex gap-2 shrink-0">
                <Button
                  type="button"
                  size="icon"
                  onClick={() => {
                    navigateToDataForm(data.slug)
                  }}
                  className="bg-warning hover:bg-[#FFC300] text-white h-auto w-auto p-1 shrink-0"
                >
                  <SquarePenIcon className="w-4! h-4!" />
                </Button>
                <Button
                  type="button"
                  size="icon"
                  onClick={() => {
                    setShowDeleteConfirm(true)
                  }}
                  className="bg-destructive hover:bg-[#D83A56] text-white h-auto w-auto p-1 shrink-0"
                >
                  <Trash2Icon className="w-4! h-4!" />
                </Button>
              </div>
            )}
          </div>

          <div>
            <p className="text-sm text-gray-500">Name</p>
            <h3 className="font-semibold text-base truncate">{data.name}</h3>
          </div>

          <div>
            <p className="text-sm text-gray-500">Phone</p>
            <h3 className="font-semibold text-base truncate">{data.phone}</h3>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-sm text-gray-500">Quantity</p>
              <h3 className="font-semibold text-base truncate">{data.quantity}</h3>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Weight</p>
              <h3 className="font-semibold text-base truncate">{data.weight}</h3>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-sm text-gray-500">Date</p>
              <h3 className="font-semibold text-base truncate">
                {format(data.date, 'EEEE, dd MMM yyyy', { locale: id })}
              </h3>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Price</p>
              <h3 className="font-semibold text-base truncate">{formatCurrency(data.price)}</h3>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-500">Notes</p>
            <h3 className="font-semibold text-base truncate">{data.notes}</h3>
          </div>
        </div>
      </Card>

      <DeleteAlertDialog
        open={showDeleteConfirm}
        title="Delete Data?"
        description={`Data "${data.name}" will be permanently deleted.\nThis action cannot be undone.`}
        onOpenChange={setShowDeleteConfirm}
        onConfirm={submitDataDeletion}
      />

      <ConfirmationAlertDialog
        open={showCompleteConfirm}
        title="Mark as Completed?"
        description={`Data "${data.name}" mark as completed.`}
        variant="default"
        confirmText="Yes, Mark as Completed"
        cancelText="Cancel"
        onOpenChange={setShowCompleteConfirm}
        onConfirm={() => {
          dataActions.markAsCompleted(data.slug)
          setShowCompleteConfirm(false)
        }}
      />
    </>
  )
}
