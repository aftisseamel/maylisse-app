
import data_articles from "@/data_articles";

async function Commande() {

    const articles = await data_articles();
    return (
        <div> 
            <h1> Articles : </h1>
            <ul>
                {articles.map((name, index) => (
                <li key={index}>{name}</li>
                ))}
            </ul>
         </div>
           
    );
}

export default Commande;