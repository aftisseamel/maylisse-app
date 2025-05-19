"use client";

import { useState, useCallback } from 'react';
import { Tables } from '@/database.types';
import { IoSearch } from 'react-icons/io5';

interface SearchBarDeliveryManProps {
  deliveryMen: Tables<"delivery_man">[];
  onSearchResults: (results: Tables<"delivery_man">[]) => void;
}

const SearchBarDeliveryMan = ({ deliveryMen, onSearchResults }: SearchBarDeliveryManProps) => {
  const [query, setQuery] = useState('');

  const handleSearch = useCallback((searchQuery: string) => {
    if (searchQuery.trim() === '') {
      onSearchResults(deliveryMen);
      return;
    }

    const filtered = deliveryMen.filter(deliveryMan =>
      deliveryMan.pseudo_delivery_man.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deliveryMan.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deliveryMan.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deliveryMan.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    onSearchResults(filtered);
  }, [deliveryMen, onSearchResults]);

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
          placeholder="Rechercher un livreur..."
          className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <IoSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>
    </div>
  );
};

export default SearchBarDeliveryMan; 