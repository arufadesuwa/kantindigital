"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { useCart } from "@/utils/cartContext"
import { Filter, Plus, ShoppingCart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

interface FoodItem {
  menuid: number
  menuname: string
  stok: number
  price: number
  category_id: number
  image_url: string
  category: {
    categoryid: number
    categoryname: string
  } | null
}

interface ProductGridProps {
  items: FoodItem[]
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price)
}

export function ProductGrid({ items }: ProductGridProps) {
  const { addToCart, cartItems } = useCart()
  const [addingToCart, setAddingToCart] = useState<number | null>(null)

  const handleAddToCart = async (e: React.MouseEvent, item: FoodItem) => {
    e.preventDefault() // Prevent navigation to detail page
    e.stopPropagation()
    
    setAddingToCart(item.menuid)
    
    // Check if item is in stock
    if (item.stok === 0) {
      alert("Item is out of stock")
      setAddingToCart(null)
      return
    }
    
    // Check if already in cart and if adding more would exceed stock
    const existingItem = cartItems.find(cartItem => cartItem.menuid === item.menuid)
    if (existingItem && existingItem.quantity >= item.stok) {
      alert(`Maximum stock (${item.stok}) already in cart`)
      setAddingToCart(null)
      return
    }
    
    await addToCart({
      ...item,
      quantity: 1
    })
    
    setAddingToCart(null)
  }

  const getItemQuantityInCart = (menuid: number) => {
    const item = cartItems.find(cartItem => cartItem.menuid === menuid)
    return item ? item.quantity : 0
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-black mb-4">
          <Filter className="w-12 h-12 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-black mb-2">Tidak ada menu yang ditemukan</h3>
        <p className="text-black1">Coba ubah filter atau kata kunci pencarian Anda</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {items.map((item) => (
        <Card key={item.menuid} className="group border-0 shadow-sm hover:shadow-xl transition-all duration-300 bg-white rounded-2xl overflow-hidden flex flex-col h-full relative">
          <Link href={`/catalog/${item.menuid}`} className="block relative overflow-hidden aspect-[4/3]">
            <Image
              src={item.image_url || "/placeholder.svg"}
              alt={item.menuname}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {item.stok === 0 && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] flex items-center justify-center z-10">
                <span className="bg-red-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg transform -rotate-12">
                  Out of Stock
                </span>
              </div>
            )}
            
            {item.category && (
              <Badge className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-gray-900 hover:bg-white border-0 shadow-sm font-medium">
                {item.category.categoryname}
              </Badge>
            )}
          </Link>

          <CardContent className="p-5 flex flex-col flex-grow">
            <div className="flex justify-between items-start mb-2">
              <Link href={`/catalog/${item.menuid}`} className="group-hover:text-primary transition-colors">
                <h3 className="font-bold text-lg text-gray-900 line-clamp-1">{item.menuname}</h3>
              </Link>
            </div>
            
            <div className="flex items-center justify-between mt-auto pt-4">
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Price</span>
                <span className="text-lg font-bold text-primary">
                  {formatPrice(item.price)}
                </span>
              </div>
              
              <Button
                size="icon"
                className={`rounded-full w-10 h-10 shadow-md transition-all duration-300 ${
                  item.stok === 0 
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed hover:bg-gray-100" 
                    : "bg-gray-900 text-white hover:bg-primary hover:scale-110 active:scale-95"
                }`}
                onClick={(e) => handleAddToCart(e, item)}
                disabled={item.stok === 0 || addingToCart === item.menuid}
              >
                {addingToCart === item.menuid ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Plus className="w-5 h-5" />
                )}
              </Button>
            </div>
            
            <div className="mt-3 flex items-center gap-2 text-xs text-gray-500 font-medium">
               <div className={`w-2 h-2 rounded-full ${item.stok > 5 ? 'bg-green-500' : item.stok > 0 ? 'bg-yellow-500' : 'bg-red-500'}`} />
               {item.stok > 0 ? `${item.stok} portions left` : 'Sold out'}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}