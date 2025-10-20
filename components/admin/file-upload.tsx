"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, X, Loader2, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface FileUploadProps {
  onUpload: (url: string) => void
  onDelete?: (url: string) => void
  multiple?: boolean
  maxFiles?: number
  className?: string
}

export function FileUpload({ onUpload, onDelete, multiple = false, maxFiles = 5, className }: FileUploadProps) {
  const [files, setFiles] = useState<Array<{ url: string; name: string; uploading: boolean }>>([])
  const [isDragging, setIsDragging] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFiles = Array.from(e.dataTransfer.files)
    handleFiles(droppedFiles)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    handleFiles(selectedFiles)
  }

  const handleFiles = async (selectedFiles: File[]) => {
    if (!multiple && selectedFiles.length > 1) {
      toast.error("Only one file allowed")
      return
    }

    if (files.length + selectedFiles.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} files allowed`)
      return
    }

    for (const file of selectedFiles) {
      await uploadFile(file)
    }
  }

  const uploadFile = async (file: File) => {
    const tempId = Math.random().toString(36)
    setFiles((prev) => [...prev, { url: tempId, name: file.name, uploading: true }])

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      const data = await response.json()

      setFiles((prev) => prev.map((f) => (f.url === tempId ? { url: data.url, name: file.name, uploading: false } : f)))

      onUpload(data.url)
      toast.success("File uploaded successfully")
    } catch (error) {
      setFiles((prev) => prev.filter((f) => f.url !== tempId))
      toast.error("Failed to upload file")
    }
  }

  const handleDelete = async (url: string) => {
    try {
      await fetch("/api/upload/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      })

      setFiles((prev) => prev.filter((f) => f.url !== url))
      onDelete?.(url)
      toast.success("File deleted successfully")
    } catch (error) {
      toast.error("Failed to delete file")
    }
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative rounded-lg border-2 border-dashed p-8 text-center transition-colors",
          isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-muted-foreground/50",
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="flex flex-col items-center gap-2">
          <Upload className="h-8 w-8 text-muted-foreground" />
          <div>
            <p className="font-medium">Drag and drop your images here</p>
            <p className="text-sm text-muted-foreground">or click to browse</p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="mt-2"
          >
            Select Files
          </Button>
        </div>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Uploaded Files ({files.length})</p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {files.map((file) => (
              <div key={file.url} className="relative group">
                {file.uploading ? (
                  <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <>
                    <img
                      src={file.url || "/placeholder.svg"}
                      alt={file.name}
                      className="aspect-square object-cover rounded-lg border"
                    />
                    <CheckCircle className="absolute top-1 right-1 h-5 w-5 text-green-500 bg-white rounded-full" />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-1 left-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleDelete(file.url)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
