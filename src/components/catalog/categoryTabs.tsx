"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"

interface CategoryTabsProps {
  categories: string[]
  currentCategory: string
}

export function CategoryTabs({ categories, currentCategory }: CategoryTabsProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const updateCategory = (category: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (category === "Semua") {
      params.delete("category")
    } else {
      params.set("category", category)
    }
    router.push(`?${params.toString()}`)
  }

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => {
        const isActive = currentCategory === category
        return (
          <Button
            key={category}
            variant={isActive ? "default" : "outline"}
            onClick={() => updateCategory(category)}
            className={`rounded-full px-6 transition-all duration-300 ${
              isActive 
                ? "bg-gray-900 text-white hover:bg-gray-800 shadow-lg shadow-gray-900/20 border-transparent" 
                : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
            }`}
          >
            {category}
          </Button>
        )
      })}
    </div>
  )
}
