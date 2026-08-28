/**
 * imageCompression.ts
 * Client-side image compression before upload
 * Target: < 150KB per photo while keeping text readable
 */

export interface CompressOptions {
  maxSizeKB?: number      // default 150
  maxWidthPx?: number     // default 1920
  quality?: number        // 0-1, default 0.82
}

export async function compressImage(
  file: File,
  options: CompressOptions = {}
): Promise<File> {
  const {
    maxSizeKB = 150,
    maxWidthPx = 1920,
    quality = 0.82,
  } = options

  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(url)
      const canvas = document.createElement('canvas')
      let { width, height } = img

      // Scale down if too wide
      if (width > maxWidthPx) {
        height = Math.round((height * maxWidthPx) / width)
        width = maxWidthPx
      }

      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')!

      // White background for chalkboard contrast
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, width, height)
      ctx.drawImage(img, 0, 0, width, height)

      // Try different quality levels until under maxSizeKB
      const tryCompress = (q: number): void => {
        canvas.toBlob(
          (blob) => {
            if (!blob) { reject(new Error('فشل ضغط الصورة')); return }
            const sizeKB = blob.size / 1024
            if (sizeKB <= maxSizeKB || q <= 0.3) {
              const compressed = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              })
              resolve(compressed)
            } else {
              tryCompress(q - 0.08)
            }
          },
          'image/jpeg',
          q
        )
      }

      tryCompress(quality)
    }

    img.onerror = () => reject(new Error('فشل تحميل الصورة'))
    img.src = url
  })
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}
