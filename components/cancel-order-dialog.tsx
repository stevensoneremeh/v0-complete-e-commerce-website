"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { AlertTriangle } from "lucide-react"

interface CancelOrderDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (reason: string) => void
  orderTotal: number
  isLoading?: boolean
}

const cancelReasons = [
  "Changed my mind",
  "Found a better price elsewhere",
  "Ordered by mistake",
  "No longer needed",
  "Delivery taking too long",
  "Payment issues",
  "Other",
]

export function CancelOrderDialog({ isOpen, onClose, onConfirm, orderTotal, isLoading }: CancelOrderDialogProps) {
  const [selectedReason, setSelectedReason] = useState("")
  const [customReason, setCustomReason] = useState("")

  const handleConfirm = () => {
    const reason = selectedReason === "Other" ? customReason : selectedReason
    if (reason.trim()) {
      onConfirm(reason.trim())
    }
  }

  const handleClose = () => {
    setSelectedReason("")
    setCustomReason("")
    onClose()
  }

  const isValid = selectedReason && (selectedReason !== "Other" || customReason.trim())

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            <span>Cancel Order</span>
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to cancel this order? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm">
              <strong>Order Total:</strong> ${orderTotal.toFixed(2)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Refund will be processed within 3-5 business days to your original payment method.
            </p>
          </div>

          <div className="space-y-3">
            <Label>Please tell us why you're canceling:</Label>
            <RadioGroup value={selectedReason} onValueChange={setSelectedReason}>
              {cancelReasons.map((reason) => (
                <div key={reason} className="flex items-center space-x-2">
                  <RadioGroupItem value={reason} id={reason} />
                  <Label htmlFor={reason} className="text-sm cursor-pointer">
                    {reason}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            {selectedReason === "Other" && (
              <div className="space-y-2">
                <Label htmlFor="customReason">Please specify:</Label>
                <Textarea
                  id="customReason"
                  placeholder="Tell us more about why you're canceling..."
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  rows={3}
                />
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={handleClose} disabled={isLoading} className="bg-transparent">
            Keep Order
          </Button>
          <Button variant="destructive" onClick={handleConfirm} disabled={!isValid || isLoading}>
            {isLoading ? "Canceling..." : "Cancel Order"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
