'use server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()
  
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect(`/error?message=${encodeURIComponent(error.message)}`)
  }

  // Get user role to determine redirect
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    const { data: userData } = await supabase
      .from('users')
      .select('role_id')
      .eq('userid', user.id)
      .single()
    
    const isAdmin = userData?.role_id === 2
    
    revalidatePath('/', 'layout')
    redirect(isAdmin ? '/dashboard/order' : '/catalog')
  }
  
  revalidatePath('/', 'layout')
  redirect('/catalog')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()
  
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    redirect(`/error?message=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/', 'layout')
  redirect('/login?message=Silakan cek email anda untuk konfirmasi akun') // Redirect to login with message
}

export async function logout() {
  const supabase = await createClient()
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error('Error signing out:', error.message)
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/login')
}

export async function signInWithGoogle() {
  const supabase = await createClient();
  // Use the correct production URL
  const origin = process.env.NODE_ENV === 'production' 
    ? 'https://kantindigital-eight.vercel.app'
    : process.env.NEXT_PUBLIC_SITE_URL!;
    
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.error('Error signing in with Google:', error);
    return redirect(`/error?message=${encodeURIComponent(error.message)}`);
  }

  if (data.url) {
    return redirect(data.url);
  }

  return redirect('/login?message=Could not authenticate with Google');
}