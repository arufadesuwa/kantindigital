"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "@/components/ui/sheet"
import { useCart } from "@/utils/cartContext"
import { createClient } from "@/utils/supabase/client"
import { Minus, Plus, ShoppingBag, Trash2, ArrowRight, ShoppingCart } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

export function CartDrawer() {
  const [isOpen, setIsOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const router = useRouter()
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    getTotalItems, 
    getTotalPrice 
  } = useCart()

  const supabase = createClient()

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty")
      return
    }

    setIsProcessing(true)
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        alert("Please login to place an order")
        return
      }

      // Create the order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          status_id: 1,
          total_amount: getTotalPrice(),
          orderedat: new Date().toISOString(),
          message: null
        })
        .select()
        .single()

      if (orderError) throw orderError

      // Create order items
      const orderItems = cartItems.map(item => ({
        order_id: order.orderid,
        menu_id: item.menuid,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.price * item.quantity
      }))

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)

      if (itemsError) throw itemsError

      // Clear the cart
      await clearCart()
      
      // Redirect to order detail page
      setIsOpen(false)
      router.push(`/order/${order.orderid}`)
      
    } catch (error) {
      console.error("Checkout error:", error)
      alert("Failed to place order. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative rounded-full w-10 h-10 border-gray-200 hover:bg-gray-100 hover:text-primary transition-colors">
          <ShoppingBag className="h-5 w-5" />
          {getTotalItems() > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 bg-primary text-white text-[10px] font-bold flex items-center justify-center rounded-full shadow-sm ring-2 ring-white">
              {getTotalItems()}
            </span>
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0 gap-0 border-l shadow-2xl">
        <SheetHeader className="px-6 py-4 border-b bg-white/50 backdrop-blur-sm sticky top-0 z-10">
          <SheetTitle className="flex items-center gap-2 text-xl font-bold text-gray-900">
            <ShoppingBag className="h-5 w-5 text-primary" />
            My Cart
            <Badge variant="secondary" className="ml-auto bg-gray-100 text-gray-600 hover:bg-gray-200">
              {getTotalItems()} items
            </Badge>
          </SheetTitle>
        </SheetHeader>
        
        <div className="flex-1 overflow-hidden flex flex-col bg-gray-50/50">
          {cartItems.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <ShoppingCart className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Your cart is empty</h3>
              <p className="text-gray-500 max-w-[200px] mb-8">
                Looks like you haven't added anything to your cart yet.
              </p>
              <Button onClick={() => setIsOpen(false)} className="rounded-full px-8">
                Start Shopping
              </Button>
            </div>
          ) : (
            <ScrollArea className="flex-1 px-6">
              <div className="py-6 space-y-6">
                {cartItems.map((item) => (
                  <div key={item.menuid} className="group flex gap-4 bg-white p-3 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                    <div className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
                      <Image
                        src={item.image_url || '/placeholder-food.jpg'}
                        alt={item.menuname}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-between min-w-0 py-1">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h3 className="font-bold text-gray-900 truncate text-sm leading-tight">{item.menuname}</h3>
                          <button 
                            onClick={() => removeFromCart(item.menuid)}
                            className="text-gray-400 hover:text-red-500 transition-colors p-1 -mr-1 -mt-1"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="text-primary font-bold text-sm mt-1">{formatPrice(item.price)}</p>
                      </div>
                      
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center bg-gray-100 rounded-full p-1">
                          <button
                            className="w-6 h-6 flex items-center justify-center rounded-full bg-white text-gray-600 shadow-sm hover:text-primary disabled:opacity-50 disabled:hover:text-gray-600 transition-colors"
                            onClick={() => updateQuantity(item.menuid, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          
                          <span className="w-8 text-center font-bold text-sm text-gray-900">{item.quantity}</span>
                          
                          <button
                            className="w-6 h-6 flex items-center justify-center rounded-full bg-white text-gray-600 shadow-sm hover:text-primary disabled:opacity-50 disabled:hover:text-gray-600 transition-colors"
                            onClick={() => updateQuantity(item.menuid, item.quantity + 1)}
                            disabled={item.quantity >= item.stok}
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <p className="font-bold text-gray-900 text-sm">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="bg-white border-t p-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10">
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Subtotal</span>
                <span>{formatPrice(getTotalPrice())}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Tax (10%)</span>
                <span>{formatPrice(getTotalPrice() * 0.1)}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-end">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <div className="text-right">
                  <span className="text-2xl font-bold text-primary block leading-none">
                    {formatPrice(getTotalPrice() * 1.1)}
                  </span>
                  <span className="text-xs text-gray-400 font-medium">Including tax</span>
                </div>
              </div>
            </div>
            
            <div className="grid gap-3">
              <Button 
                onClick={handleCheckout}
                disabled={isProcessing}
                className="w-full bg-gray-900 hover:bg-primary text-white h-12 rounded-xl font-bold text-base shadow-lg shadow-gray-200 hover:shadow-primary/25 transition-all duration-300 group"
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2 w-full">
                    Checkout
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </Button>
              
              <Button 
                variant="ghost" 
                onClick={() => clearCart()}
                className="w-full text-gray-500 hover:text-red-500 hover:bg-red-50 h-10 rounded-xl text-sm font-medium transition-colors"
              >
                Clear Cart
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
