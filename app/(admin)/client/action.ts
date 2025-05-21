'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function deleteClient(name: string) {
  const supabase = await createClient()
  
  try {
    const { error } = await supabase
      .from('client')
      .delete()
      .eq('name', name)

    if (error) {
      console.error('Error deleting client:', error)
      return { error: 'Une erreur est survenue lors de la suppression du client' }
    }

    revalidatePath('/client')
    return { success: true }
  } catch (error) {
    console.error('Unexpected error:', error)
    return { error: 'Une erreur inattendue est survenue' }
  }
} 