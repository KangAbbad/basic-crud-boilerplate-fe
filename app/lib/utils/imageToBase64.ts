export async function imageToBase64(file: File): Promise<string> {
  return await new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
      } else {
        reject(new Error('Failed to convert image'))
      }
    }

    reader.onerror = () => {
      reject(reader.error)
    }
    reader.readAsDataURL(file)
  })
}

export function validateImageFile(file: File): {
  valid: boolean
  error?: string
} {
  const MAX_SIZE = 500 * 1024
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'Only JPEG, PNG, and WebP images are allowed',
    }
  }

  if (file.size > MAX_SIZE) {
    return {
      valid: false,
      error: `Image must be less than ${MAX_SIZE / 1024}KB`,
    }
  }

  return { valid: true }
}

export async function compressImage(file: File, maxWidth = 800, quality = 0.8): Promise<Blob> {
  return await new Promise((resolve, reject) => {
    const img = new Image()
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    if (!ctx) {
      reject(new Error('Canvas context not available'))
      return
    }

    img.onload = () => {
      const ratio = img.width / img.height
      canvas.width = maxWidth
      canvas.height = maxWidth / ratio

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob)
          else reject(new Error('Failed to compress image'))
        },
        'image/jpeg',
        quality
      )
    }

    img.onerror = () => {
      reject(new Error('Failed to load image'))
    }
    img.src = URL.createObjectURL(file)
  })
}
