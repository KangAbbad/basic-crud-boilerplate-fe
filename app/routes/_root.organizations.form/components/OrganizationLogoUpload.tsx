import { useState } from 'react'

import { Button } from '~/components/ui/button'
import { imageToBase64, validateImageFile, compressImage } from '~/lib/utils/imageToBase64'

type Props = {
  logo: string | undefined
  onLogoChange: (base64: string) => void
  error?: string
}

export function OrganizationLogoUpload({ logo, onLogoChange, error }: Props) {
  const [fileSize, setFileSize] = useState<{ original: number; compressed: number } | null>(null)

  const uploadLogoFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const validation = validateImageFile(file)
    if (!validation.valid) {
      alert(validation.error)
      return
    }

    try {
      const originalSize = file.size

      // Compress image before converting to base64
      const compressedBlob = await compressImage(file, 600, 0.6)
      const compressedFile = new File([compressedBlob], file.name, { type: compressedBlob.type })

      const base64 = await imageToBase64(compressedFile)
      const compressedSize = compressedBlob.size

      onLogoChange(base64)
      setFileSize({ original: originalSize, compressed: compressedSize })
    } catch (err) {
      alert('Failed to upload image')
      console.error(err)
    }
  }

  const removeLogo = () => {
    onLogoChange('')
    setFileSize(null)
  }

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">Logo</label>

      <div className="flex flex-col items-start gap-3">
        {logo && (
          <img src={logo} alt="Organization logo" className="rounded border border-gray-200 w-40 h-40 object-cover" />
        )}

        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={uploadLogoFile}
          className="file:rounded file:border-0 block file:bg-blue-50 hover:file:bg-blue-100 text-sm text-gray-500 file:text-sm file:font-semibold file:text-blue-700 w-full cursor-pointer file:cursor-pointer file:py-2 file:px-4 file:mr-4"
        />

        {logo && (
          <Button
            type="button"
            variant="ghost"
            onClick={removeLogo}
            className="text-destructive text-sm hover:text-red-700"
          >
            Remove Image
          </Button>
        )}
      </div>

      {fileSize && import.meta.env.DEV && (
        <div className="rounded bg-gray-50 text-xs text-gray-600 p-2">
          <p>Original size: {formatBytes(fileSize.original)}</p>
          <p>After compression: {formatBytes(fileSize.compressed)}</p>
          <p className="text-primary font-semibold">
            Reduction: {Math.round((1 - fileSize.compressed / fileSize.original) * 100)}%
          </p>
        </div>
      )}

      {error && <p className="text-red-600 text-sm">{error}</p>}
      <p className="text-gray-500 text-xs">Maks 500KB. Format JPEG, PNG, atau WebP.</p>
    </div>
  )
}
