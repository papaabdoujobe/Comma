'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { data: authData, error } = await supabase.auth.signUp(data)

  if (error) {
    return redirect('/signup?error=Could not sign up user: ' + error.message)
  }

  if (!authData.session) {
    // Supabase is configured to require email confirmation
    return redirect('/login?message=Check your email to confirm your account')
  }

  // Usually signups require email confirmation, but for now we'll redirect to a generic welcome page or dashboard
  revalidatePath('/', 'layout')
  redirect('/onboarding')
}
