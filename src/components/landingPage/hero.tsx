import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

import LogoutButton from './LogoutButton';
import HeroClient from './hero-client';

export default async function LandingPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()

  return (
    <HeroClient />
  )
}