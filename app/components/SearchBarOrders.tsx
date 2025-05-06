"use client";

import { useState, useEffect } from 'react';
import { Tables } from '@/database.types';
import { IoSearch } from 'react-icons/io5';

interface SearchBarOrderProps {
    orders: Tables<"order">[];
    onSearchResults: (results: Tables<"order">[]) => void;
}

export default function SearchBarOrder({ orders, onSearchResults }: SearchBarOrderProps) {
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const filtered = orders.filter(order => 
            (order.delivery_address?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (order.pseudo_delivery_man?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (order.name_client?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (order.status?.toLowerCase() || '').includes(searchTerm.toLowerCase())
        );
        onSearchResults(filtered);
    }, [searchTerm, orders, onSearchResults]);

    return (
        <div className="relative">
            <input
                type="text"
                placeholder="Rechercher une commande..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <IoSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
    );
}
