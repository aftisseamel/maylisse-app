import { createClient } from "@/utils/supabase/server";


async function Commande() {

    const supabase = await createClient();
    //const {data} = await supabase.from('deliveryman').select('*').limit(1).single();

    const { data, count, error } = 
    await supabase.from('article').select('quantity')
    .gt('quantity', 555);
    const total = data?.reduce((acc, item) => acc + item.quantity, 0);
    console.log('Somme des quantités > 555 :', total);

    if (error) {
    console.error("Erreur Supabase:", error)
    } else {
    console.log("Data reçue:", data)
    }

    return (
        <div>
            <h1>Commande</h1>
            <p>Voici les commandes</p>
            <p>{JSON.stringify(data)}</p>
        </div>
    )
}

export default Commande;