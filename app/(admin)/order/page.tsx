'use client';

import { useState, useEffect, useCallback } from 'react';
import { Tables } from '@/database.types';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import SearchBarOrders from "../../components/SearchBarOrders";

export default function Page() {
    const [orders, setOrders] = useState<Tables<"order">[]>([]);
    const [filteredOrders, setFilteredOrders] = useState<Tables<"order">[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Charger les commandes au démarrage
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const supabase = createClient();
                const { data, error } = await supabase
                    .from('order')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) throw error;
                setOrders(data || []);
                setFilteredOrders(data || []);
            } catch (err) {
                console.error('Error:', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchOrders();
    }, []);

    // Mettre à jour les commandes filtrées quand on recherche
    const handleSearchResults = useCallback((results: Tables<"order">[]) => {
        setFilteredOrders(results);
    }, []);

    if (isLoading) {
        return <div>Chargement...</div>;
    }

    return (
        <div className="p-4">
            <div className="max-w-6xl mx-auto">
                {/* En-tête avec titre et recherche */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                    <h1 className="text-2xl font-bold">Commandes</h1>
                    <div className="w-full md:w-80">
                        <SearchBarOrders orders={orders} onSearchResults={handleSearchResults} />
                    </div>
                </div>

                {/* Liste des commandes */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredOrders.map((order) => (
                        <div key={order.id} className="bg-white p-4 rounded-lg shadow">
                            <div className="flex justify-between items-start">
                                <h3 className="font-bold">Commande #{order.id}</h3>
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full 
                                    ${order.status === 'initiated' ? 'bg-yellow-100 text-yellow-800' :
                                    order.status === 'preparation' ? 'bg-blue-100 text-blue-800' :
                                    order.status === 'prepared' ? 'bg-purple-100 text-purple-800' :
                                    order.status === 'delivering' ? 'bg-orange-100 text-orange-800' :
                                    order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                    order.status === 'finished' ? 'bg-gray-100 text-gray-800' :
                                    'bg-red-100 text-red-800'}`}>
                                    {order.status}
                                </span>
                            </div>
                            <p className="text-gray-600 mt-2">{order.delivery_address}</p>
                            <div className="mt-2 text-sm">
                                <p><span className="font-semibold">Livreur:</span> {order.pseudo_delivery_man}</p>
                                <p><span className="font-semibold">Client:</span> {order.name_client}</p>
                            </div>
                            {order.description_order && (
                                <p className="text-sm text-gray-600 mt-2">{order.description_order}</p>
                            )}
                            <p className="text-xs text-gray-500 mt-2">
                                {order.created_at ? new Date(order.created_at).toLocaleDateString() : ''}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Message si aucune commande */}
                {filteredOrders.length === 0 && (
                    <p className="text-center py-4">Aucune commande trouvée</p>
                )}

                {/* Bouton de création */}
                <div className="text-center mt-6">
                    <Link
                        href="/create_order"
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        Créer une commande
                    </Link>
                </div>
            </div>
        </div>
    );
}

