"use client";

import { Tables } from "@/database.types";
import React, { ChangeEvent } from "react";
import { AiOutlineSearch } from "react-icons/ai";

const SearchBar = ({ 
  articles, 
  onSearchResults 
}: { 
  articles: Tables<"article">[];
  onSearchResults: (results: Tables<"article">[]) => void;
}) => {
  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.trim().toLowerCase();
    if (query === "") {
      onSearchResults(articles);
      return;
    }
    const results = articles.filter((article) => 
      article.name.toLowerCase().includes(query)
    );
    onSearchResults(results);
  };

  return (
    <div className="w-full">
      <div className="relative">
        <input
          type="search"
          placeholder="Rechercher un article..."
          className="w-full px-4 py-2 rounded-lg border border-gray-300"
          onChange={handleSearch}
        />
        <button
          type="button"
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-indigo-600 text-white p-1 rounded"
        >
          <AiOutlineSearch size={20} />
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
