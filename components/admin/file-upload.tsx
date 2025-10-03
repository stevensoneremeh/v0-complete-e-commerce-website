"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, X, FileImage, FileVideo, File, Loader2 } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"

interface FileUploadProps {
  onFilesUploaded: (urls: string[]) => void
  acceptedTypes?: string
  maxFiles?: number
  maxSizeInMB?: number
  uploadType: "images" | "videos" | "documents"
  folder?: string
  className?: string
  showPreview?: boolean
}

export function FileUpload({
  onFilesUploaded,
  acceptedTypes = "image/*",
  maxFiles = 10,
  maxSizeInMB = 10,
  uploadType = "images",
  folder = "general",
  className = "",
  showPreview = true,
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [dragActive, setDragActive] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ url: string; name: string }>>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = (file: File): boolean => {
    // Check file size
    if (file.size > maxSizeInMB * 1024 * 1024) {
      toast.error(`File ${file.name} is too large. Maximum size is ${maxSizeInMB}MB`)
      return false
    }

    // Check file type
    if (uploadType === "images" && !file.type.startsWith("image/")) {
      toast.error(`${file.name} is not a valid image file`)
      return false
    }

    if (uploadType === "videos" && !file.type.startsWith("video/")) {
      toast.error(`${file.name} is not a valid video file`)
      return false
    }

    return true
  }

  const uploadFiles = async (files: FileList): Promise<string[]> => {
    const validFiles = Array.from(files).filter(validateFile)

    if (validFiles.length === 0) return []

    if (validFiles.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} files allowed`)
      return []
    }

    setUploading(true)
    setUploadProgress(0)

    const uploadedUrls: string[] = []
    const newUploadedFiles: Array<{ url: string; name: string }> = []

    try {
      // Use batch upload for multiple files
      if (validFiles.length > 1) {
        const formData = new FormData()
        validFiles.forEach((file) => formData.append("files", file))
        formData.append("folder", folder)

        const response = await fetch("/api/upload/batch", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || "Upload failed")
        }

        const data = await response.json()
        data.files.forEach((file: any) => {
          uploadedUrls.push(file.url)
          newUploadedFiles.push({ url: file.url, name: file.filename })
        })
        setUploadProgress(100)
      } else {
        // Single file upload
        for (let i = 0; i < validFiles.length; i++) {
          const file = validFiles[i]
          const formData = new FormData()
          formData.append("file", file)
          formData.append("folder", folder)

          setUploadProgress((i / validFiles.length) * 100)

          const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          })

          if (!response.ok) {
            const error = await response.json()
            throw new Error(error.error || "Upload failed")
          }

          const data = await response.json()
          uploadedUrls.push(data.url)
          newUploadedFiles.push({ url: data.url, name: data.filename })
          setUploadProgress(((i + 1) / validFiles.length) * 100)
        }
      }

      setUploadedFiles((prev) => [...prev, ...newUploadedFiles])
      toast.success(`${validFiles.length} file(s) uploaded successfully`)
      return uploadedUrls
    } catch (error: any) {
      console.error("Upload error:", error)
      toast.error(error.message || "Failed to upload files")
      return []
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    const uploadedUrls = await uploadFiles(files)
    if (uploadedUrls.length > 0) {
      onFilesUploaded(uploadedUrls)
    }
  }

  const handleRemoveFile = async (url: string) => {
    try {
      const response = await fetch(`/api/upload/delete?url=${encodeURIComponent(url)}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setUploadedFiles((prev) => prev.filter((f) => f.url !== url))
        toast.success("File removed successfully")
      }
    } catch (error) {
      console.error("Error removing file:", error)
      toast.error("Failed to remove file")
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files)
    }
  }

  const getIcon = () => {
    switch (uploadType) {
      case "images":
        return <FileImage className="h-8 w-8" />
      case "videos":
        return <FileVideo className="h-8 w-8" />
      default:
        return <File className="h-8 w-8" />
    }
  }

  return (
    <div className={className}>
      <Card
        className={`border-2 border-dashed transition-colors ${
          dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <CardContent className="p-6">
          <div className="text-center">
            <div className="flex justify-center mb-4 text-muted-foreground">
              {uploading ? <Loader2 className="h-8 w-8 animate-spin" /> : getIcon()}
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold">
                Upload {uploadType.charAt(0).toUpperCase() + uploadType.slice(1)}
              </h3>
              <p className="text-sm text-muted-foreground">Drag and drop your files here, or click to browse</p>
              <p className="text-xs text-muted-foreground">
                Maximum {maxFiles} files, {maxSizeInMB}MB each
              </p>
            </div>

            <div className="mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="w-full"
              >
                {uploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Select Files
                  </>
                )}
              </Button>
            </div>

            {uploading && (
              <div className="mt-4 space-y-2">
                <Progress value={uploadProgress} className="w-full" />
                <p className="text-sm text-muted-foreground">Uploading... {Math.round(uploadProgress)}%</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {showPreview && uploadedFiles.length > 0 && (
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          {uploadedFiles.map((file, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden border bg-muted">
                {uploadType === "images" ? (
                  <Image
                    src={file.url || "/placeholder.svg"}
                    alt={file.name}
                    width={200}
                    height={200}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">{getIcon()}</div>
                )}
              </div>
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6"
                onClick={() => handleRemoveFile(file.url)}
              >
                <X className="h-3 w-3" />
              </Button>
              <p className="text-xs text-muted-foreground mt-1 truncate">{file.name}</p>
            </div>
          ))}
        </div>
      )}

      <Input
        ref={fileInputRef}
        type="file"
        multiple
        accept={acceptedTypes}
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
      />
    </div>
  )
}
