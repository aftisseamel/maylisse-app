import { createClient } from "@/utils/supabase/server";


async function Commande() {

    const supabase = await createClient();
    //const {data} = await supabase.from('deliveryman').select('*').limit(1).single();

    const { data, error } = await supabase.from('deliveryman').select('*').limit(2);

    if (error) {
    console.error("Erreur Supabase:", error)
    } else {
    console.log("Data reçue:", data)
    }

    return (
        <div>
            <h1>Commande</h1>
            <p>Voici la commande</p>
            <p>{JSON.stringify(data)}</p>
        </div>
    )
}

export default Commande;