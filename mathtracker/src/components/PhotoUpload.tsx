'use client'

import { useState, useEffect, useRef } from 'react'
import { compressImage, formatFileSize } from '@/lib/imageCompression'

interface PhotoUploadProps {
  label: string
  icon?: string
  onUpload: (file: File, preview: string) => void
  accept?: string
  maxSizeKB?: number
  className?: string
}

export default function PhotoUpload({
  label,
  icon = '📷',
  onUpload,
  accept = 'image/*',
  maxSizeKB = 150,
  className = '',
}: PhotoUploadProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const [compressing, setCompressing] = useState(false)
  const [originalSize, setOriginalSize] = useState<string>('')
  const [compressedSize, setCompressedSize] = useState<string>('')
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const processFile = async (file: File) => {
    if (!file.type.startsWith('image/')) return
    setCompressing(true)
    setOriginalSize(formatFileSize(file.size))

    try {
      const compressed = await compressImage(file, { maxSizeKB })
      setCompressedSize(formatFileSize(compressed.size))
      const reader = new FileReader()
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string
        setPreview(dataUrl)
        onUpload(compressed, dataUrl)
      }
      reader.readAsDataURL(compressed)
    } finally {
      setCompressing(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processFile(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) processFile(file)
  }

  const clearPhoto = () => {
    setPreview(null)
    setOriginalSize('')
    setCompressedSize('')
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className={`upload-zone ${dragging ? 'upload-zone-dragging' : ''} ${preview ? 'upload-zone-has-preview' : ''} ${className}`}
      onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => !preview && inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        style={{ display: 'none' }}
        capture="environment"
      />

      {compressing ? (
        <div className="upload-compressing">
          <div className="spinner spinner-lg" />
          <p>جاري ضغط الصورة...</p>
          <p className="text-muted text-sm">الحجم الأصلي: {originalSize}</p>
        </div>
      ) : preview ? (
        <div className="upload-preview">
          <img src={preview} alt="معاينة" className="upload-preview-img" />
          <div className="upload-preview-info">
            <span className="badge badge-success">✓ {compressedSize}</span>
            <span className="text-muted text-sm">من {originalSize}</span>
          </div>
          <div className="upload-preview-actions">
            <button
              className="btn btn-sm btn-ghost"
              onClick={(e) => { e.stopPropagation(); inputRef.current?.click() }}
            >📷 تغيير</button>
            <button
              className="btn btn-sm btn-danger-ghost"
              onClick={(e) => { e.stopPropagation(); clearPhoto() }}
            >✕ حذف</button>
          </div>
        </div>
      ) : (
        <div className="upload-placeholder">
          <span className="upload-icon">{icon}</span>
          <p className="upload-label">{label}</p>
          <p className="upload-hint">اضغط للتصوير أو اسحب صورة</p>
          <p className="upload-limit text-muted text-xs">الحجم المسموح: أقل من {maxSizeKB}KB</p>
        </div>
      )}
    </div>
  )
}
