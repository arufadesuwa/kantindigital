"use client"

import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { clearSupabaseCookies, debugCookies } from "@/utils/cookieDebug"
import { createClient } from "@/utils/supabase/client"
import { MessageSquare, Minus, Package, Plus, ShoppingBag, Clock, CreditCard } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"

interface MenuItem {
  menuid: number
  menuname: string
  price: number
  stok: number
}

interface OrderFormProps {
  menuItem: MenuItem
}

export function OrderForm({ menuItem }: OrderFormProps) {
  const [quantity, setQuantity] = useState(1)
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Show confirmation dialog instead of directly processing the order
    setShowConfirmDialog(true)
  }

  const handleConfirmOrder = async () => {
    setShowConfirmDialog(false)
    setIsLoading(true)

    try {
      // Debug cookies before making request
      debugCookies()
      
      const supabase = createClient()
      
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError) {
        console.error("User auth error:", userError)
        
        // If it's a cookie-related auth error, try to clear and redirect
        if (userError.message.includes('session') || userError.message.includes('token')) {
          console.log("Clearing cookies due to auth error")
          clearSupabaseCookies()
          alert("Sesi Anda telah berakhir. Silakan login kembali.")
          router.push("/login")
          return
        }
        
        alert("Terjadi kesalahan saat mengambil data user")
        return
      }
      
      if (!user) {
        console.log("No user found, redirecting to login")
        clearSupabaseCookies()
        alert("Anda harus login terlebih dahulu")
        router.push("/login")
        return
      }

      if (quantity < 1 || quantity > menuItem.stok) {
        alert(`Jumlah harus antara 1 dan ${menuItem.stok}`)
        return
      }

      const totalAmount = menuItem.price * quantity

      // First, create the order
      const orderData = {
        message: message || null,
        user_id: user.id,
        status_id: 1,
        total_amount: totalAmount
      }

      console.log("Attempting to create order with data:", orderData)

      const { data: orderResult, error: orderError } = await supabase
        .from('orders')
        .insert(orderData)
        .select()
        .single()

      if (orderError) {
        console.error("Order creation error:", orderError)
        
        if (orderError.code === '23503') {
          alert("Data referensi tidak valid. Pastikan menu dan status tersedia.")
        } else if (orderError.code === '23505') {
          alert("Pesanan duplikat terdeteksi.")
        } else {
          alert(`Terjadi kesalahan: ${orderError.message}`)
        }
        return
      }

      // Then, create the order item
      const orderItemData = {
        order_id: orderResult.orderid,
        menu_id: menuItem.menuid,
        quantity: quantity,
        price: menuItem.price,
        subtotal: totalAmount
      }

      console.log("Attempting to create order item with data:", orderItemData)

      const { data: orderItemResult, error: orderItemError } = await supabase
        .from('order_items')
        .insert(orderItemData)
        .select()

      if (orderItemError) {
        console.error("Order item creation error:", orderItemError)
        
        // If order item creation fails, we should delete the order
        await supabase.from('orders').delete().eq('orderid', orderResult.orderid)
        
        alert(`Terjadi kesalahan saat membuat item pesanan: ${orderItemError.message}`)
        return
      }

      console.log("Order created successfully:", orderResult)
      console.log("Order item created successfully:", orderItemResult)
      alert("Pesanan berhasil dibuat!")
      
      setQuantity(1)
      setMessage("")
            
    } catch (error) {
      console.error("Unexpected error creating order:", error)
      alert("Terjadi kesalahan yang tidak terduga saat membuat pesanan")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelOrder = () => {
    setShowConfirmDialog(false)
  }

  const handleQuantityChange = (newQuantity: number) => {
    const clampedValue = Math.max(1, Math.min(newQuantity, menuItem.stok))
    setQuantity(clampedValue)
  }

  const totalPrice = menuItem.price * quantity

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const isOutOfStock = menuItem.stok === 0

  return (
    <>
      <Card className="border-0 shadow-none bg-transparent">
        <CardHeader className="px-0 pb-6">
          <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            Order Details
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0 space-y-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-4">
            <Label htmlFor="quantity" className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
              Quantity
            </Label>
            
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-1">
                  <button
                    type="button"
                    className="h-10 w-10 rounded-lg bg-white shadow-sm hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1 || isLoading}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                
                  <div className="w-12 text-center">
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      max={menuItem.stok}
                      value={quantity}
                      onChange={(e) => {
                        const value = e.target.value;
                        const parsed = parseInt(value, 10);
                        if (!isNaN(parsed)) {
                          handleQuantityChange(parsed);
                        } else if (value === "") {
                          setQuantity(1);
                        }
                      }}
                      className="text-center text-xl font-bold border-0 focus:ring-0 focus:outline-none bg-transparent p-0 h-auto"
                      disabled={isLoading}
                    />
                  </div>
                  
                  <button
                    type="button"
                    className="h-10 w-10 rounded-lg bg-white shadow-sm hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= menuItem.stok || isLoading}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-right">
                  <div className="text-xs text-gray-500 font-medium mb-1">Total Price</div>
                  <div className="text-xl font-bold text-primary">
                    {formatPrice(totalPrice)}
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                  <div className={`w-2 h-2 rounded-full ${menuItem.stok > 5 ? 'bg-green-500' : menuItem.stok > 0 ? 'bg-yellow-500' : 'bg-red-500'}`} />
                  {menuItem.stok > 0 ? `${menuItem.stok} portions available` : 'Out of stock'}
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="message" className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
              Special Instructions <span className="text-gray-400 font-normal normal-case text-xs">(Optional)</span>
            </Label>
            <Textarea
              id="message"
              placeholder="e.g. Extra spicy, no onions, separate sauce..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              disabled={isLoading}
              maxLength={500}
              className="resize-none border-gray-200 focus:border-primary focus:ring-primary/20 rounded-xl bg-gray-50 border-0"
            />
            <p className="text-xs text-gray-400 text-right">
              {message.length}/500
            </p>
          </div>
          
          <Button
            type="submit"
            className={`w-full h-14 text-base font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 ${
              isOutOfStock 
                ? "bg-gray-100 text-gray-400 hover:bg-gray-100 cursor-not-allowed shadow-none" 
                : "bg-gray-900 text-white hover:bg-primary"
            }`}
            disabled={isLoading || isOutOfStock || quantity < 1}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </div>
            ) : isOutOfStock ? (
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Out of Stock
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                Order Now
              </div>
            )}
          </Button>

          {!isOutOfStock && (
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm text-gray-400">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div className="text-xs text-gray-500">
                  <span className="block font-bold text-gray-900">Payment</span>
                  Pay at cashier
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm text-gray-400">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="text-xs text-gray-500">
                  <span className="block font-bold text-gray-900">Est. Time</span>
                  15-20 mins
                </div>
              </div>
            </div>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent className="max-w-md rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-xl">
              Confirm Order
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-4 pt-4">
              <div className="bg-gray-50 p-4 rounded-xl space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Item</span>
                  <span className="font-bold text-gray-900">{menuItem.menuname}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Quantity</span>
                  <span className="font-bold text-gray-900">{quantity}x</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Price per item</span>
                  <span className="font-bold text-gray-900">{formatPrice(menuItem.price)}</span>
                </div>
                {message && (
                  <div className="pt-2 border-t border-gray-200">
                    <span className="text-xs text-gray-500 block mb-1">Note:</span>
                    <p className="text-sm text-gray-900 italic">"{message}"</p>
                  </div>
                )}
                <div className="pt-3 border-t border-gray-200 flex justify-between items-center">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="text-xl font-bold text-primary">{formatPrice(totalPrice)}</span>
                </div>
              </div>
              <p className="text-center text-sm text-gray-500">
                Are you sure you want to place this order?
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3">
            <Button 
              variant="outline"
              onClick={handleCancelOrder}
              className="flex-1 rounded-xl h-12"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleConfirmOrder}
              className="flex-1 bg-primary hover:bg-primary/90 text-white rounded-xl h-12 font-bold"
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Confirm Order"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}