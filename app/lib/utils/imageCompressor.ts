export type CompressedPhoto = {
  base64: string
  size: number
}

type CompressionOptions = {
  maxWidth?: number
  maxHeight?: number
  quality?: number
}

const DEFAULT_OPTIONS: Required<CompressionOptions> = {
  maxWidth: 600,
  maxHeight: 800,
  quality: 0.6,
}

function getBase64Size(base64String: string): number {
  return Math.ceil((base64String.length * 3) / 4)
}

function resizeImageInCanvas(img: HTMLImageElement, maxWidth: number, maxHeight: number, quality: number): string {
  const canvas = document.createElement('canvas')
  let width = img.width
  let height = img.height

  const widthRatio = maxWidth / width
  const heightRatio = maxHeight / height
  const scalingFactor = Math.min(widthRatio, heightRatio, 1)

  width = width * scalingFactor
  height = height * scalingFactor

  canvas.width = width
  canvas.height = height

  const ctx = canvas.getContext('2d')
  if (!ctx) {
    throw new Error('Failed to get canvas context')
  }

  ctx.drawImage(img, 0, 0, width, height)
  return canvas.toDataURL('image/jpeg', quality)
}

export async function compressPhoto(file: File, options?: CompressionOptions): Promise<CompressedPhoto> {
  const mergedOptions = { ...DEFAULT_OPTIONS, ...options }

  return await new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      const img = new Image()

      img.onload = () => {
        try {
          const base64 = resizeImageInCanvas(
            img,
            mergedOptions.maxWidth,
            mergedOptions.maxHeight,
            mergedOptions.quality
          )
          const size = getBase64Size(base64)

          resolve({ base64, size })
        } catch (error) {
          reject(error)
        }
      }

      img.onerror = () => {
        reject(new Error('Failed to load image'))
      }

      img.src = e.target?.result as string
    }

    reader.onerror = () => {
      reject(new Error('Failed to read file'))
    }

    reader.readAsDataURL(file)
  })
}

export async function compressMultiplePhotos(files: File[], options?: CompressionOptions): Promise<CompressedPhoto[]> {
  return await Promise.all(files.map((file) => compressPhoto(file, options)))
}

export function isValidPhotoFile(file: File): boolean {
  const validTypes = ['image/jpeg', 'image/png', 'image/webp']
  const maxSize = 5 * 1024 * 1024 // 5MB

  return validTypes.includes(file.type) && file.size <= maxSize
}

export function validatePhotoFiles(files: FileList | null): {
  valid: File[]
  errors: string[]
} {
  const valid: File[] = []
  const errors: string[] = []

  if (!files) {
    return { valid, errors }
  }

  Array.from(files).forEach((file) => {
    if (!isValidPhotoFile(file)) {
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        errors.push(`${file.name} format tidak didukung. Gunakan JPG, PNG, atau WebP.`)
      } else {
        errors.push(`${file.name} terlalu besar. Maksimal 5MB.`)
      }
    } else {
      valid.push(file)
    }
  })

  return { valid, errors }
}
