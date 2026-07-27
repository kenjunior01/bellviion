"use client"

import type React from "react"

import { useState, useRef } from "react"
import { X, Loader2, ImageIcon } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface ImageUploadProps {
  currentImage?: string
  onImageChange: (url: string) => void
  className?: string
}

export function ImageUpload({ currentImage, onImageChange, className = "" }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState("")
  const [preview, setPreview] = useState(currentImage || "")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError("")
    setIsUploading(true)

    // Show preview immediately
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Falha no upload")
      }

      setPreview(data.url)
      onImageChange(data.url)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao fazer upload")
      setPreview(currentImage || "")
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveImage = async () => {
    if (preview && preview.includes("blob.vercel-storage.com")) {
      try {
        await fetch("/api/upload", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: preview }),
        })
      } catch (err) {
        console.error("Error deleting image:", err)
      }
    }
    setPreview("")
    onImageChange("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-gray-300 mb-2">Imagem do Produto</label>

      <div className="relative">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleFileSelect}
          className="hidden"
          disabled={isUploading}
        />

        <AnimatePresence mode="wait">
          {preview ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative aspect-square w-full max-w-[200px] rounded-lg overflow-hidden border border-gray-700"
            >
              <img src={preview || "/placeholder.svg"} alt="Preview" className="w-full h-full object-cover" />
              {isUploading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-gold animate-spin" />
                </div>
              )}
              {!isUploading && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 p-1.5 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              )}
            </motion.div>
          ) : (
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="w-full max-w-[200px] aspect-square border-2 border-dashed border-gray-700 rounded-lg flex flex-col items-center justify-center gap-2 hover:border-gold hover:bg-gray-800/50 transition-all disabled:opacity-50"
            >
              {isUploading ? (
                <Loader2 className="w-8 h-8 text-gold animate-spin" />
              ) : (
                <>
                  <ImageIcon className="w-8 h-8 text-gray-500" />
                  <span className="text-sm text-gray-400">Clique para upload</span>
                  <span className="text-xs text-gray-500">Max 5MB</span>
                </>
              )}
            </motion.button>
          )}
        </AnimatePresence>

        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
      </div>

      {/* Alternative: URL input */}
      <div className="mt-3">
        <label className="block text-xs text-gray-500 mb-1">Ou insira URL da imagem:</label>
        <input
          type="text"
          value={preview}
          onChange={(e) => {
            setPreview(e.target.value)
            onImageChange(e.target.value)
          }}
          placeholder="https://exemplo.com/imagem.jpg"
          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-gold"
        />
      </div>
    </div>
  )
}
