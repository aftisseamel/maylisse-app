import SearchBarArticles from "../../components/SearchBarArticles";
import data_articles from "../../data_articles";

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
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center">📚 Recherche d'articles</h1>
        <SearchBarArticles articles={articles} />
      </div>
    </div>
  );
}
