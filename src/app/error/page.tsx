'use client'

import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function ErrorPage() {
  const searchParams = useSearchParams()
  const message = searchParams.get('message') || 'Sorry, something went wrong'

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 text-center">
      <h1 className="text-4xl font-bold text-red-600 mb-4">Error</h1>
      <p className="text-lg text-gray-700 mb-8">{message}</p>
      <Button asChild>
        <Link href="/login">Back to Login</Link>
      </Button>
    </div>
  )
}