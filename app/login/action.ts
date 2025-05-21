'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()
  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }
  const emailData = data.email
  console.log(" PREMIER TRUC data : ", data)
  const { data: signInData, error } = await supabase.auth.signInWithPassword(data);

  console.log('error', error)

  if (error || !signInData.session.user) {
    console.error('Login error:', error)
    redirect('/error')
  }

  // check the profile of the user : admin or delivery_man
  if (signInData !== null) {
    const userId = signInData.session?.user?.id;

    const {data :profile} = await supabase.from('profiles').select('role_profile').eq('id', userId).single();
    const {data : deliveryMan} = await supabase.from('delivery_man').select('*').eq('email', emailData).single();
    console.log('deliveryMan : ', deliveryMan)

    if (profile && profile.role_profile === 'admin') {
      revalidatePath('/', 'layout')
      redirect('/admin')
    }
    if (profile && profile.role_profile === 'delivery_man' && deliveryMan) {
      revalidatePath('/', 'layout')
      redirect(`/delivery_manID/${deliveryMan.id}`);
    }
  }
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const {data : signUpData, error } = await supabase.auth.signUp(data)

  console.log('error', error)

  if (error || !signUpData.user) {
    redirect('/error')
  }

  if (signUpData !== null) {
    const userId = signUpData?.user?.id

    const {data :profile} = await supabase.from('profiles').select('role_profile').eq('id', userId).single();
    console.log('profile', profile)
    if (profile && profile.role_profile === 'admin') {
      revalidatePath('/', 'layout')
      redirect('/admin')
    }
    if (profile && profile.role_profile === 'delivery_man') {
      revalidatePath('/', 'layout')
      redirect('/livreurs')
    }
  }
}

export async function resetPassword(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=/reset-password`,
  })

  if (error) {
    console.error('Error sending reset password email:', error)
    return { error: 'Une erreur est survenue lors de l\'envoi de l\'email de réinitialisation' }
  }

  return { success: true }
}