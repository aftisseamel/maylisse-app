'use client';

import { useState, useEffect, useCallback } from 'react';
import { Tables } from '@/database.types';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import SearchBarOrders from "../../components/SearchBarOrders";
import { data_orders } from '@/app/data_orders';
import NavigationBar from '@/app/components/NavigationBar';
import { createClient } from '@/utils/supabase/client';
export default function Page() {
    const router = useRouter();
    const [orders, setOrders] = useState<Tables<"order">[]>([]);
    const [filteredOrders, setFilteredOrders] = useState<Tables<"order">[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<string>('all');

    // Charger les commandes au démarrage
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await data_orders();
                setOrders(data);
                setFilteredOrders(data);
            } catch (err) {
                console.error('Error:', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchOrders();
    }, []);

    // Mettre à jour les commandes filtrées quand on recherche ou change le filtre
    const handleSearchResults = useCallback((results: Tables<"order">[]) => {
        const filtered = results.filter(order => 
            statusFilter === 'all' || order.status === statusFilter
        );
        setFilteredOrders(filtered);
    }, [statusFilter]);

    // Mettre à jour le filtre de statut
    const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value;
        setStatusFilter(newStatus);
        const filtered = orders.filter(order => 
            newStatus === 'all' || order.status === newStatus
        );
        setFilteredOrders(filtered);
    };

    if (isLoading) {
        return <div>Chargement...</div>;
    }

    const handleOrderInitiatedClick = async (orderId: number) => 
    {
        const status = 'preparation';
        const supabase = createClient();

        const {error} = await supabase.from('order').update({status: status}).eq('id',orderId);
        if (error) {
            console.error('Error updating order status:', error);
        }
        router.push(`/orderID/${orderId}`);
    }

    const handleOrderPreparationClick = async (orderId: number) => 
    {
        router.push(`/orderID/${orderId}`);
    }
    const handleOrderPreparedClick = async (orderId: number) => 
    {
        router.push(`/orderID/${orderId}`);
    }

    return (
        <div>
            <NavigationBar />
            <div className="p-4">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                        <h1 className="text-2xl font-bold">Commandes</h1>
                        <div className="flex items-center gap-4">
                            <div className="w-full md:w-80">
                                <SearchBarOrders orders={orders} onSearchResults={handleSearchResults} />
                            </div>
                            <select
                                value={statusFilter}
                                onChange={handleStatusFilterChange}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="all">Tous les statuts</option>
                                <option value="initiated">Initiated</option>
                                <option value="preparation">En préparation</option>
                                <option value="prepared">Préparées</option>
                                <option value="delivering">En livraison</option>
                                <option value="delivered">Livrées</option>
                                <option value="finished">Terminées</option>
                            </select>
                            <Link
                                href="/create_order"
                                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                            >
                                Créer une commande
                            </Link>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredOrders.map((order) => (
                            <div key={order.id} className="bg-white p-4 rounded-lg shadow">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-bold">Commande #{order.id}</h3>
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full 
                                        ${
                                        order.status === 'initiated' ? 'bg-yellow-100 text-yellow-800' :
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
                                {order.status === 'initiated' && (
                                    <div className="mt-4">
                                        <button 
                                            onClick={() =>  handleOrderInitiatedClick(order.id)}
                                            className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                                        >
                                            Ajouter des articles
                                        </button>
                                    </div>
                                )}

                                {order.status === 'preparation' && (
                                    <div className="mt-4">
                                        <button 
                                            onClick={() =>  handleOrderPreparationClick(order.id)}
                                            className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                                        >
                                            Continuer la préparation
                                        </button>
                                    </div>
                                )
                                }
                                {order.status === 'prepared' && (
                                    <div className="mt-4">
                                        <button 
                                            onClick={() =>  handleOrderPreparedClick(order.id)}
                                            className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"

                                        >   
                                            details de la commande
                                        </button>
                                    </div>
                                )}
                                
                            </div>
                        ))}
                    </div>

                    {filteredOrders.length === 0 && (
                        <p className="text-center py-4">Aucune commande trouvée</p>
                    )}
                </div>
            </div>
        </div>
    );
}

