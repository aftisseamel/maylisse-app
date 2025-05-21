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
  const emailData = data.email
  console.log(" PREMIER TRUC data : ", data)
  const { data: signInData, error } = await supabase.auth.signInWithPassword(data);

  console.log('error', error)

  if (error || !signInData.session.user) {
    console.error('Login error:', error)
    redirect('/error')
  }

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

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email)
    
    if (error) {
      console.error('Error sending reset password email:', error)
      return { error: 'Une erreur est survenue lors de l\'envoi de l\'email de réinitialisation' }
    }

    return { success: true }
  } catch (error) {
    console.error('Unexpected error:', error)
    return { error: 'Une erreur inattendue est survenue' }
  }
}

export async function updatePassword(formData: FormData) {
  const supabase = await createClient()
  const password = formData.get('password') as string
  const email = formData.get('email') as string

  const { error } = await supabase.auth.updateUser({
    password: password
  })

  if (error) {
    console.error('Error updating password:', error)
    return { error: 'Une erreur est survenue lors de la mise à jour du mot de passe' }
  }

  return { success: true }
}