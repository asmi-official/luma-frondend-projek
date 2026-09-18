import Dialog from '@mui/material/Dialog'
import DynamicLucideIcon from '../../icon/DynamicLucideIcon'

type ConfirmDeleteModalProps = {
  open: boolean
  itemName: string
  isLoading?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmDeleteModal({
  open,
  itemName,
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmDeleteModalProps) {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth={false}
      slotProps={{ paper: { sx: { borderRadius: '16px', width: '420px', maxWidth: '420px' } } }}
    >
      <div className="flex w-full flex-col items-start gap-5 p-6">
        <span className="flex size-12 items-center justify-center rounded-full bg-[#fce9ea]">
          <DynamicLucideIcon name="trash-2" size={22} className="text-[#d1293d]" />
        </span>

        <div className="flex w-full flex-col items-start gap-2">
          <p className="text-base font-semibold leading-[1.4] text-[#20242d]">Hapus data ini?</p>
          <p className="text-xs leading-[1.4] text-[#797c81]">
            <span className="font-medium">{itemName} </span>
            akan dihapus permanen. Tindakan ini tidak bisa dibatalkan.
          </p>
        </div>

        <div className="flex w-full items-start gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="h-9 flex-1 rounded-lg border border-[#d1293d] text-sm font-semibold text-[#d1293d] hover:bg-[#fef2f2] disabled:opacity-70"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="h-9 flex-1 rounded-lg bg-[#d1293d] text-sm font-semibold text-[#fdfeff] hover:bg-[#b5222f] disabled:opacity-70"
          >
            {isLoading ? 'Menghapus...' : 'Ya, Hapus'}
          </button>
        </div>
      </div>
    </Dialog>
  )
}
