import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'

export default async function Page() {

  return (

  <div className="flex  items-center gap-6 mt-10">
  <Link
    href="./create_article"
    className="bg-blue-500 hover:bg-blue-600 text-white p-10 rounded-lg shadow-md transition-all duration-300"
  >
    Créer un article
  </Link>

  <Link
    href="/create_client"
    className="bg-blue-500 hover:bg-blue-600 text-white p-10 rounded-lg shadow-md transition-all duration-300"
  >
    Créer un client
  </Link>

  <Link
    href="/create_delivery_man"
    className="bg-blue-500 hover:bg-blue-600 text-white p-10 rounded-lg shadow-md transition-all duration-300"
  >
    Créer un livreur 
  </Link>

  <Link
    href="/create_order"
    className="bg-blue-500 hover:bg-blue-600 text-white p-10 rounded-lg shadow-md transition-all duration-300"
  >
    Créer commande
  </Link>

</div>
  )
}
