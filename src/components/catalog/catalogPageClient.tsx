"use client"

import { CartDrawer } from "@/components/catalog/cartDrawer"
import { CategoryTabs } from "@/components/catalog/categoryTabs"
import { ProductGrid } from "@/components/catalog/productGrid"
import { SearchAndFilters } from "@/components/catalog/searchFilters"
import LogoutButton from "@/components/landingPage/LogoutButton"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CartProvider } from '@/utils/cartContext'
import { History } from "lucide-react"
import Link from "next/link"

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
  }
}

interface CatalogPageClientProps {
  filteredItems: FoodItem[]
  categories: string[]
  currentCategory: string
  currentSearch: string
  currentSort: string
}

export function CatalogPageClient({
  filteredItems,
  categories,
  currentCategory,
  currentSearch,
  currentSort
}: CatalogPageClientProps) {
  return (
    <CartProvider>
      <div className="min-h-screen bg-gray-50 font-sans selection:bg-primary/20">
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 transition-all duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  K
                </div>
                <div className="flex flex-col">
                  <h1 className="text-xl font-bold text-gray-900 leading-none">Kantin<span className="text-primary">Digital</span></h1>
                  <span className="text-xs text-gray-500 font-medium mt-0.5">Catalog</span>
                </div>
                <Badge variant="secondary" className="hidden md:inline-flex ml-4 bg-gray-100 text-gray-600 hover:bg-gray-200 border-0">
                  {filteredItems.length} Items
                </Badge>
              </div>
              
              <div className="flex items-center gap-3">
                <Link href="/orders">
                  <Button variant="ghost" size="sm" className="hidden sm:flex text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full px-4">
                    <History className="w-4 h-4 mr-2" />
                    History
                  </Button>
                </Link>
                <Link href="/orders" className="sm:hidden">
                  <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full">
                    <History className="w-5 h-5" />
                  </Button>
                </Link>
                
                <div className="h-6 w-px bg-gray-200 mx-1"></div>
                
                <CartDrawer />
                
                <div className="ml-2">
                  <LogoutButton />
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="relative rounded-3xl overflow-hidden bg-gray-900 text-white mb-12 shadow-2xl">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>
            <div className="relative z-10 p-8 md:p-12 lg:p-16 max-w-3xl">
              <Badge className="mb-4 bg-primary text-white border-0 px-3 py-1 text-sm">Premium Quality</Badge>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight tracking-tight">
                Discover the Taste of <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Excellence</span>
              </h2>
              <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-xl leading-relaxed">
                Explore our curated menu of delicious meals, refreshing drinks, and delightful snacks. Freshly prepared for you every day.
              </p>
            </div>
          </div>

          {/* Filters & Content */}
          <div className="space-y-8">
            <div className="sticky top-24 z-30 bg-gray-50/95 backdrop-blur-sm py-4 -mx-4 px-4 sm:mx-0 sm:px-0 transition-all">
              <div className="flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center">
                <CategoryTabs categories={categories} currentCategory={currentCategory} />
                <div className="w-full lg:w-auto min-w-[300px]">
                  <SearchAndFilters currentSearch={currentSearch} currentSort={currentSort} />
                </div>
              </div>
            </div>
            
            <ProductGrid items={filteredItems} />
          </div>
        </main>
      </div>
    </CartProvider>
  )
}