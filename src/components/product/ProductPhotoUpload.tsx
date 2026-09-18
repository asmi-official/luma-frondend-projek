import { useEffect, useRef, useState } from 'react'
import type { Control } from 'react-hook-form'
import { Controller } from 'react-hook-form'
import UploadCircleIcon from '../../icon/UploadCircleIcon'
import type { ProductFormValues } from '../../pages/product/types'

const MAX_SIZE_BYTES = 2 * 1024 * 1024
const ACCEPTED_TYPES = ['image/png', 'image/jpeg']

type ProductPhotoUploadProps = {
  control: Control<ProductFormValues>
}

export default function ProductPhotoUpload({ control }: ProductPhotoUploadProps) {
  return (
    <Controller
      control={control}
      name="image"
      render={({ field }) => (
        <PhotoDropzone value={field.value} onChange={field.onChange} />
      )}
    />
  )
}

function PhotoDropzone({
  value,
  onChange,
}: {
  value: File | null
  onChange: (file: File | null) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragActive, setIsDragActive] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!value) {
      setPreviewUrl(null)
      return
    }
    const url = URL.createObjectURL(value)
    setPreviewUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [value])

  const applyFile = (file: File | undefined | null) => {
    if (!file) return
    if (!ACCEPTED_TYPES.includes(file.type) || file.size > MAX_SIZE_BYTES) return
    onChange(file)
  }

  const openFilePicker = () => inputRef.current?.click()

  const fileInput = (
    <input
      ref={inputRef}
      type="file"
      accept="image/png,image/jpeg"
      className="hidden"
      onChange={(e) => applyFile(e.target.files?.[0])}
    />
  )

  if (value && previewUrl) {
    return (
      <div className="flex w-full flex-col gap-2">
        <div className="h-[143px] w-full overflow-hidden rounded-[10px]">
          <img src={previewUrl} alt="Preview produk" className="size-full object-cover" />
        </div>

        <div className="flex w-full items-start gap-2">
          <button
            type="button"
            onClick={() => onChange(null)}
            className="flex h-9 flex-1 items-center justify-center gap-1 rounded-lg border border-[#ef4444] bg-[#fef2f2] px-4 py-2"
          >
            <span className="text-sm font-semibold text-[#ef4444]">Hapus Foto</span>
          </button>
          <button
            type="button"
            onClick={openFilePicker}
            className="flex h-9 flex-1 items-center justify-center gap-1 rounded-lg bg-[#4e5bd6] px-4 py-2"
          >
            <span className="text-sm font-semibold text-[#fdfeff]">Ubah Foto</span>
          </button>
        </div>

        {fileInput}
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={openFilePicker}
      onDragOver={(e) => {
        e.preventDefault()
        setIsDragActive(true)
      }}
      onDragLeave={() => setIsDragActive(false)}
      onDrop={(e) => {
        e.preventDefault()
        setIsDragActive(false)
        applyFile(e.dataTransfer.files?.[0])
      }}
      className={`flex w-full flex-col items-center justify-center gap-2 rounded-[10px] border-[1.5px] border-dashed px-4 py-7 transition-colors ${
        isDragActive ? 'border-[#4e5bd6] bg-[#edeffb]' : 'border-[#dadde1] bg-[#edeffb]'
      }`}
    >
      {fileInput}

      <span className="flex size-10 items-center justify-center rounded-full bg-white">
        <UploadCircleIcon size={18} className="text-[#4e5bd6]" />
      </span>

      <p className="text-center text-[13px] font-medium text-[#20242d]">
        Klik untuk unggah atau seret foto ke sini
      </p>
      <p className="text-center text-xs text-[#8f99a7]">PNG atau JPG, maksimal 2MB</p>
    </button>
  )
}
