"use client";

import { Tables } from "@/database.types";
import React, { ChangeEvent, useState, useEffect } from "react";
import { AiOutlineSearch } from "react-icons/ai";

interface SearchBarClientsProps {
  clients: Tables<"client">[];
  onSearchResults: (results: Tables<"client">[]) => void;
}

const SearchBarClients = ({ clients, onSearchResults }: SearchBarClientsProps) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (query.trim() === '') {
      onSearchResults(clients);
      return;
    }

    const filtered = clients.filter(client =>
      client.name.toLowerCase().includes(query.toLowerCase()) ||
      (client.email?.toLowerCase() || '').includes(query.toLowerCase()) ||
      (client.phone?.toLowerCase() || '').includes(query.toLowerCase()) ||
      (client.address_client?.toLowerCase() || '').includes(query.toLowerCase())
    );

    onSearchResults(filtered);
  }, [query, clients, onSearchResults]);

  return (
    <div className="w-full max-w-xl mx-auto relative">
      {/* Barre de recherche */}
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher un client..."
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="button"
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-indigo-600 text-white rounded-full p-2 hover:bg-indigo-700 transition-all"
        >
          <AiOutlineSearch size={20} />
        </button>
      </div>
    </div>
  );
};

export default SearchBarClients;
