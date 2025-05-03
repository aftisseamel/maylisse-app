

import data_articles from "../data_articles";

export default async function Page() {
    const data = await data_articles();
    return (
        <div>
            <h1> voici les articles : </h1>
            
            {JSON.stringify(data)}

        </div>
    );
}
