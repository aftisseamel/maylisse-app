
import SearchBar from "../components/SearchBar";
import data_articles from "../data_articles";

export default async function Page() {

    const articles = await data_articles();
    if (!articles) {
        return <div>Loading...</div>;
    }
    return (
        
        <SearchBar articles= {articles} />
    )
}

