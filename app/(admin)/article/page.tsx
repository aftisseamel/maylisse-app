import SearchBar from "../../components/SearchBarArticles";
import data_articles from "../../data_articles";
import Link from "next/link";

export default async function Page() {
  const articles = await data_articles();

  if (!articles) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-pulse text-gray-500 text-lg">Chargement des articles...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-4xl mx-auto bg-white p-10 rounded-3xl shadow-2xl">
        <h1 className="text-4xl font-extrabold mb-8 text-center text-gray-800">
          📚 Recherche d'articles
        </h1>
        <SearchBar articles={articles} />
      </div>

      <div className="flex justify-center mt-10">
        <Link 
          href="/create_article"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold py-4 px-8 rounded-full shadow-md transition-all duration-300"
        >
           Créer un article
        </Link>
      </div>
    </div>
  );
}
