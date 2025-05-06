"use client";

import { useState, useEffect } from 'react';
import { Tables } from '@/database.types';
import React, { ChangeEvent } from "react";
import { AiOutlineSearch } from "react-icons/ai";

interface SearchBarDeliveryManProps {
  deliveryMen: Tables<"delivery_man">[];
  onSearchResults?: (results: Tables<"delivery_man">[]) => void;
}

const SearchBar = ({ 
  deliveryMen, 
  onSearchResults 
}: SearchBarDeliveryManProps) => {
  const [query, setQuery] = useState('');
  const [activeSearch, setActiveSearch] = useState<Tables<"delivery_man">[]>([]);

  useEffect(() => {
    if (query.trim() === '') {
      setActiveSearch([]);
      if (onSearchResults) onSearchResults(deliveryMen);
      return;
    }

    const filtered = deliveryMen.filter(deliveryMan =>
      deliveryMan.pseudo_delivery_man.toLowerCase().includes(query) ||
      deliveryMan.first_name.toLowerCase().includes(query) ||
      deliveryMan.last_name.toLowerCase().includes(query) ||
      deliveryMan.email.toLowerCase().includes(query)
    );

    setActiveSearch(filtered);
    if (onSearchResults) onSearchResults(filtered);
  }, [query, deliveryMen, onSearchResults]);

  return (
    <div className="w-full max-w-xl mx-auto relative">
      {/* Barre de recherche */}
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher un livreur..."
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="button"
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-indigo-600 text-white rounded-full p-2 hover:bg-indigo-700 transition-all"
        >
          <AiOutlineSearch size={20} />
        </button>
      </div>

      {/* Résultats */}
      {!onSearchResults && activeSearch.length > 0 && (
        <div className="absolute top-16 w-full bg-white rounded-2xl shadow-lg p-4 mt-2 flex flex-col gap-4 z-10">
          {activeSearch.map((deliveryMan, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all"
            >
              {/* Infos */}
              <div className="flex flex-col">
                <span className="font-semibold text-gray-800">{deliveryMan.pseudo_delivery_man}</span>
                <span className="text-sm text-gray-500">
                  {deliveryMan.first_name} {deliveryMan.last_name}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  deliveryMan.status === 'available'
                    ? 'bg-green-100 text-green-600'
                    : 'bg-red-100 text-red-600'
                }`}>
                  {deliveryMan.status === 'available' ? 'Disponible' : 'Indisponible'}
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