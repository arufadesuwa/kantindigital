"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SearchAndFiltersProps {
  currentSearch: string
  currentSort: string
}

export function SearchAndFilters({ currentSearch, currentSort }: SearchAndFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const updateSearchParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`?${params.toString()}`)
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full">
      <div className="relative flex-1 group">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 group-hover:text-primary transition-colors" />
        <Input
          placeholder="Search menu..."
          defaultValue={currentSearch}
          onChange={(e) => updateSearchParams("search", e.target.value)}
          className="pl-10 bg-white border-gray-200 text-gray-900 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all hover:border-gray-300"
        />
      </div>
      <Select value={currentSort} onValueChange={(value) => updateSearchParams("sort", value)}>
        <SelectTrigger className="w-full sm:w-48 bg-white border-gray-200 rounded-xl text-gray-700 hover:border-gray-300 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent className="rounded-xl border-gray-100 shadow-xl">
          <SelectItem value="name">Name (A-Z)</SelectItem>
          <SelectItem value="price-low">Price: Low to High</SelectItem>
          <SelectItem value="price-high">Price: High to Low</SelectItem>
          <SelectItem value="stock">Highest Stock</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
