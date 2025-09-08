"use client"

import { type ChangeEvent, type FormEvent, useState } from "react"

// Types ---------------------------------------------------------------------
export type Feature = {
  id: string
  name: string
  value: string
}

export type ProductFormData = {
  title: string
  description: string
  price: number
  sku?: string
  inventory?: number
  features: Feature[]
  images: File[]
}

export type EnhancedProductFormProps = {
  initialData?: Partial<ProductFormData>
  onSubmit: (data: ProductFormData) => Promise<void> | void
  submitLabel?: string
  disabled?: boolean
}

// Component -----------------------------------------------------------------
export default function EnhancedProductForm({
  initialData,
  onSubmit,
  submitLabel = "Save product",
  disabled = false,
}: EnhancedProductFormProps) {
  const [formData, setFormData] = useState<ProductFormData>(() => ({
    title: initialData?.title ?? "",
    description: initialData?.description ?? "",
    price: initialData?.price ?? 0,
    sku: initialData?.sku ?? "",
    inventory: initialData?.inventory ?? 0,
    features:
      initialData?.features && initialData.features.length > 0
        ? (initialData.features as Feature[])
        : [{ id: String(Date.now()), name: "", value: "" }],
    images: initialData?.images ?? [],
  }))

  const [submitting, setSubmitting] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  // Helpers ----------------------------------------------------------------
  const addFeature = (): void => {
    setFormData((prev) => ({
      ...prev,
      features: [...prev.features, { id: `${Date.now()}-${Math.random()}`, name: "", value: "" }],
    }))
  }

  const removeFeature = (index: number): void => {
    setFormData((prev) => ({
      ...prev,
      // explicit types for parameters to avoid implicit `any`
      features: prev.features.filter((_: unknown, i: number) => i !== index),
    }))
  }

  const updateFeature = (index: number, field: keyof Feature, value: string): void => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.map((f, i) => (i === index ? { ...f, [field]: value } : f)),
    }))
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target

    if (name === "price") {
      // keep price as number in state
      const parsed = value === "" ? 0 : Number(value)
      setFormData((prev) => ({ ...prev, price: Number.isNaN(parsed) ? 0 : parsed }))
      return
    }

    if (name === "sku" || name === "title" || name === "description") {
      setFormData((prev) => ({ ...prev, [name]: value }))
    } else if (name === "inventory") {
      const parsed = value === "" ? 0 : Number(value)
      setFormData((prev) => ({ ...prev, inventory: Number.isNaN(parsed) ? 0 : parsed }))
    }
  }

  const handleImagesChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const files = e.target.files
    if (!files) return
    const arr = Array.from(files)
    setFormData((prev) => ({ ...prev, images: [...prev.images, ...arr] }))
  }

  const removeImage = (index: number): void => {
    setFormData((prev) => ({ ...prev, images: prev.images.filter((file: File, i: number) => i !== index) }))
  }

  // Submit -----------------------------------------------------------------
  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    setError(null)

    // Basic validation
    if (!formData.title || formData.title.trim().length === 0) {
      setError("Product title is required")
      return
    }

    if (typeof formData.price !== "number" || Number.isNaN(formData.price)) {
      setError("Valid product price is required")
      return
    }

    try {
      setSubmitting(true)
      await onSubmit({ ...formData })
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      setError(msg)
    } finally {
      setSubmitting(false)
    }
  }

  // Render -----------------------------------------------------------------
  return (
    <form onSubmit={handleSubmit} aria-disabled={disabled || submitting}>
      {error && (
        <div role="alert" style={{ color: "var(--danger, #c00)", marginBottom: 12 }}>
          {error}
        </div>
      )}

      <div style={{ marginBottom: 12 }}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          disabled={disabled || submitting}
          required
        />
      </div>

      <div style={{ marginBottom: 12 }}>
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          disabled={disabled || submitting}
          rows={4}
        />
      </div>

      <div style={{ marginBottom: 12 }}>
        <label htmlFor="price">Price</label>
        <input
          id="price"
          name="price"
          value={String(formData.price)}
          onChange={handleChange}
          inputMode="decimal"
          disabled={disabled || submitting}
        />
      </div>

      <div style={{ marginBottom: 12 }}>
        <label htmlFor="sku">SKU</label>
        <input
          id="sku"
          name="sku"
          value={formData.sku ?? ""}
          onChange={handleChange}
          disabled={disabled || submitting}
        />
      </div>

      <div style={{ marginBottom: 12 }}>
        <fieldset>
          <legend>Features</legend>
          {formData.features.map((f: Feature, i: number) => (
            <div key={f.id} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <input
                aria-label={`feature-name-${i}`}
                placeholder="Name"
                value={f.name}
                onChange={(e: ChangeEvent<HTMLInputElement>) => updateFeature(i, "name", e.target.value)}
                disabled={disabled || submitting}
              />
              <input
                aria-label={`feature-value-${i}`}
                placeholder="Value"
                value={f.value}
                onChange={(e: ChangeEvent<HTMLInputElement>) => updateFeature(i, "value", e.target.value)}
                disabled={disabled || submitting}
              />
              <button type="button" onClick={() => removeFeature(i)} disabled={disabled || submitting}>
                Remove
              </button>
            </div>
          ))}

          <button type="button" onClick={addFeature} disabled={disabled || submitting}>
            Add feature
          </button>
        </fieldset>
      </div>

      <div style={{ marginBottom: 12 }}>
        <label htmlFor="images">Images</label>
        <input
          id="images"
          type="file"
          accept="image/*"
          multiple
          onChange={handleImagesChange}
          disabled={disabled || submitting}
        />
        <div style={{ marginTop: 8 }}>
          {formData.images.map((img: File, i: number) => (
            <div key={`${img.name}-${i}`} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
              <span style={{ maxWidth: 240, overflow: "hidden", textOverflow: "ellipsis" }}>{img.name}</span>
              <button type="button" onClick={() => removeImage(i)} disabled={disabled || submitting}>
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <button type="submit" disabled={disabled || submitting}>
          {submitting ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  )
}
