import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'

export default async function Page() {

  return (

    <div> 
      <h1> WELCOME to the admin page</h1>
      
      <Link href={"/test"}
        className="bg-blue-500 text-white p-10 rounded" >

        créer un article 

      </Link>

    </div>
  )
}
