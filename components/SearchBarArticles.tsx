"use client";

import { Tables } from "@/database.types";
import React, { ChangeEvent } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { IoSearch } from "react-icons/io5";

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
          className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          onChange={handleSearch}
        />
        <IoSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>
    </div>
  );
};

export default SearchBar;
