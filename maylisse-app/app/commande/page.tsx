import { createClient } from "@/utils/supabase/server";


async function Commande() {

    const supabase = await createClient();

    const {data, error} = await supabase.from('article').select('*').eq('name', 'moule_bleu')
    
    if (error) {
    console.error("Erreur Supabase:", error)
    } else {
    console.log("Data reçue: ", data)
    }

    return (
        <div>
            <h1>Articles</h1>
            <p>Voici les articles</p>
            <p>{JSON.stringify(data)}</p>
        </div>
    )
}

export default Commande;