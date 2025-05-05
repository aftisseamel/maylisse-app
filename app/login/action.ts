'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'
import ErrorPage from '../error/page'

export async function login(formData: FormData) {
  const supabase = await createClient()
  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

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
