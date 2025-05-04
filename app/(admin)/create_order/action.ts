'use server'
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";


export async function createOrder(formData: FormData){

    const supabase = await createClient()
    const existentStatus = ['initiated', 'preparation', 'prepared', 'delivering', 'delivered', 'finished']
    const data = {

        delivery_address: formData.get('delivery_address') as string,
        pseudo: formData.get('pseudo') as string,
        name_client: formData.get('name_client') as string,
        status: formData.get('status') as 'initiated' | 'preparation' | 'prepared' | 'delivering' | 'delivered' | 'finished'
    }

    console.log("data", data)

    const {error} = await supabase.from("order").insert([data])
    console.log('error', error)
    if (error) {
        console.log("error", error)
        redirect('/error')
    }
    else {
        redirect('/order')

       

    }
}