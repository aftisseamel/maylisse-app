"use client";

import { Tables } from "@/database.types";
import { useState, useCallback } from "react";
import { IoSearch } from "react-icons/io5";

interface SearchBarClientsProps {
  clients: Tables<"client">[];
  onSearchResults: (results: Tables<"client">[]) => void;
}

const SearchBarClients = ({ clients, onSearchResults }: SearchBarClientsProps) => {
  const [query, setQuery] = useState('');

  const handleSearch = useCallback((searchQuery: string) => {
    if (searchQuery.trim() === '') {
      onSearchResults(clients);
      return;
    }

    const filtered = clients.filter(client =>
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (client.email?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (client.phone?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (client.address_client?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    );

    onSearchResults(filtered);
  }, [clients, onSearchResults]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    handleSearch(newQuery);
  };

  return (
    <div className="w-full">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Rechercher un client..."
          className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <IoSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>
    </div>
  );
};

export default SearchBarClients;
