import SearchBarOrder from "../../components/SearchBarOrders";
import data_orders from "../../data_orders";

export default async function Order() {
    const data = await data_orders();

    console.log(data)

    return (
        <div> 

            <h1> Commandes : </h1>
            <p> Voici les commandes </p>
            <SearchBarOrder orders={data} />

         </div>
           
    );
}

