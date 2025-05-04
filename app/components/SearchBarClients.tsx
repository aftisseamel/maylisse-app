"use client";

import { Tables } from "@/database.types";
import React, { ChangeEvent, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";

const SearchBar = ({ clients }: { clients: Tables<"client">[] }) => {
  const [activeSearch, setActiveSearch] = useState<Tables<"client">[]>([]);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.trim().toLowerCase();
    if (query === "") {
      setActiveSearch([]);
      return;
    }
    setActiveSearch(
        clients
        .filter((client) => client.name.toLowerCase().includes(query))
        .slice(0, 8)
    );
  };

  return (
    <div className="w-full max-w-xl mx-auto relative">
      {/* Barre de recherche */}
      <div className="relative">
        <input
          type="search"
          placeholder="Rechercher un article..."
          className="w-full px-5 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          onChange={handleSearch}
        />
        <button
          type="button"
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-indigo-600 text-white rounded-full p-2 hover:bg-indigo-700 transition-all"
        >
          <AiOutlineSearch size={20} />
        </button>
      </div>

      {/* Résultats */}
      {activeSearch.length > 0 && (
        <div className="absolute top-16 w-full bg-white rounded-2xl shadow-lg p-4 mt-2 flex flex-col gap-4 z-10">
          {activeSearch.map((client, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all"
            >
              
              {/* Infos */}
              <div className="flex flex-col">
                <span className="font-semibold text-gray-800">{client.name}</span>
                <span className="text-sm text-gray-500">
                    NOM : {client.name}   ID : {client.id} 
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
