import React from 'react'
import Login from '@/components/auth/login'

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

const page = async ({ searchParams }: Props) => {
  const { message } = await searchParams
  return (
    <Login message={typeof message === 'string' ? message : undefined} />
  )
}

export default page