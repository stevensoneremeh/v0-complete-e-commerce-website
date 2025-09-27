
"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, X, FileImage, FileVideo, File } from "lucide-react"
import { toast } from "sonner"

interface FileUploadProps {
  onFilesUploaded: (urls: string[]) => void
  acceptedTypes?: string
  maxFiles?: number
  maxSizeInMB?: number
  uploadType: 'images' | 'videos' | 'documents'
  className?: string
}

export function FileUpload({
  onFilesUploaded,
  acceptedTypes = "image/*",
  maxFiles = 10,
  maxSizeInMB = 10,
  uploadType = 'images',
  className = ""
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = (file: File): boolean => {
    // Check file size
    if (file.size > maxSizeInMB * 1024 * 1024) {
      toast.error(`File ${file.name} is too large. Maximum size is ${maxSizeInMB}MB`)
      return false
    }

    // Check file type
    if (uploadType === 'images' && !file.type.startsWith('image/')) {
      toast.error(`${file.name} is not a valid image file`)
      return false
    }
    
    if (uploadType === 'videos' && !file.type.startsWith('video/')) {
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
    
    try {
      for (let i = 0; i < validFiles.length; i++) {
        const file = validFiles[i]
        
        // Simulate upload progress
        const progressIncrement = 100 / validFiles.length
        setUploadProgress((i / validFiles.length) * 100)
        
        // For production, implement proper file upload to storage bucket
        // This is a simulation - replace with actual upload logic
        const fileName = `${uploadType}-${Date.now()}-${i}-${file.name}`
        const uploadUrl = `/uploads/${uploadType}/${fileName}`
        
        // Simulate upload delay
        await new Promise(resolve => setTimeout(resolve, 500))
        
        uploadedUrls.push(uploadUrl)
        setUploadProgress((i + 1) * progressIncrement)
      }
      
      toast.success(`${validFiles.length} file(s) uploaded successfully`)
      return uploadedUrls
    } catch (error) {
      console.error("Upload error:", error)
      toast.error("Failed to upload files")
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
      case 'images':
        return <FileImage className="h-8 w-8" />
      case 'videos':
        return <FileVideo className="h-8 w-8" />
      default:
        return <File className="h-8 w-8" />
    }
  }

  return (
    <div className={className}>
      <Card 
        className={`border-2 border-dashed transition-colors ${
          dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <CardContent className="p-6">
          <div className="text-center">
            <div className="flex justify-center mb-4 text-muted-foreground">
              {getIcon()}
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">
                Upload {uploadType.charAt(0).toUpperCase() + uploadType.slice(1)}
              </h3>
              <p className="text-sm text-muted-foreground">
                Drag and drop your files here, or click to browse
              </p>
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
                <Upload className="h-4 w-4 mr-2" />
                {uploading ? "Uploading..." : "Select Files"}
              </Button>
            </div>

            {uploading && (
              <div className="mt-4 space-y-2">
                <Progress value={uploadProgress} className="w-full" />
                <p className="text-sm text-muted-foreground">
                  Uploading... {Math.round(uploadProgress)}%
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

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
