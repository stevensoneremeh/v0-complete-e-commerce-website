"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/components/cart-provider"
import { useToast } from "@/hooks/use-toast"
import { ShoppingCart, Minus, Plus, Trash2, ShoppingBag } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { DualCurrencyDisplay } from "@/components/dual-currency-display"

export function CartSidebar() {
  const { items, updateQuantity, removeItem, total, itemCount, clearCart } = useCart()
  const { toast } = useToast()

  const handleRemoveItem = (item: any) => {
    removeItem(item.id)
    toast({
      title: "Item removed",
      description: `${item.name} has been removed from your cart.`,
      variant: "destructive",
    })
  }

  const handleClearCart = () => {
    if (items.length === 0) return

    clearCart()
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart.",
      variant: "destructive",
    })
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingCart className="h-4 w-4" />
          {itemCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
              {itemCount > 99 ? "99+" : itemCount}
            </Badge>
          )}
          <span className="sr-only">Shopping cart</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader className="flex-shrink-0">
          <SheetTitle className="flex items-center justify-between">
            <span>Shopping Cart ({itemCount})</span>
            {items.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearCart}
                className="text-destructive hover:text-destructive text-xs"
              >
                Clear All
              </Button>
            )}
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 space-y-4">
            <div className="p-4 rounded-full bg-muted">
              <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            </div>
            <div className="text-center space-y-2">
              <p className="font-medium">Your cart is empty</p>
              <p className="text-sm text-muted-foreground">Add some items to get started</p>
            </div>
            <Button asChild className="mt-4">
              <Link href="/products">Start Shopping</Link>
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-4 py-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <Link href={`/products/${item.id}`} className="flex-shrink-0">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        width={60}
                        height={60}
                        className="rounded-md object-cover cursor-pointer hover:opacity-80 transition-opacity"
                      />
                    </Link>
                    <div className="flex-1 min-w-0 space-y-2">
                      <Link href={`/products/${item.id}`}>
                        <h4 className="font-medium text-sm line-clamp-2 hover:text-primary cursor-pointer transition-colors">
                          {item.name}
                        </h4>
                      </Link>
                      <div className="flex items-center justify-between">
                        <DualCurrencyDisplay usdAmount={item.price} size="sm" variant="primary" compact={true} />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleRemoveItem(item)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7 bg-transparent"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7 bg-transparent"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={item.maxQuantity ? item.quantity >= item.maxQuantity : false}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="text-right">
                          <DualCurrencyDisplay
                            usdAmount={item.price * item.quantity}
                            size="sm"
                            variant="primary"
                            compact={true}
                            className="font-semibold"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="flex-shrink-0 border-t pt-4 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Subtotal ({itemCount} items)</span>
                  <DualCurrencyDisplay
                    usdAmount={total}
                    size="md"
                    variant="primary"
                    compact={false}
                    className="font-bold"
                  />
                </div>
                <p className="text-xs text-muted-foreground">Shipping and taxes calculated at checkout</p>
              </div>

              <Separator />

              <div className="space-y-2">
                <Button className="w-full" size="lg" asChild>
                  <Link href="/checkout">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Checkout
                  </Link>
                </Button>
                <Button className="w-full bg-transparent" variant="outline" asChild>
                  <Link href="/cart">View Full Cart</Link>
                </Button>
              </div>

              <p className="text-xs text-muted-foreground text-center">Free shipping on orders over $100</p>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
