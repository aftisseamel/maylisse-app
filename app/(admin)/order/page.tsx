'use client';

import { useState, useEffect, useCallback } from 'react';
import { Tables } from '@/database.types';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import SearchBarOrders from "../../components/SearchBarOrders";
import { data_orders } from '@/app/datas/data_orders';
import NavigationBar from '@/app/components/NavigationBar';
import { createClient } from '@/utils/supabase/client';

export default function Page() {
    const router = useRouter();
    const [orders, setOrders] = useState<Tables<"order">[]>([]);
    const [filteredOrders, setFilteredOrders] = useState<Tables<"order">[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<string>('all');

    const [editOrderId, setEditOrderId] = useState<number | null>(null);
    const [editedOrderData, setEditedOrderData] = useState<Partial<Tables<"order">>>({});

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

    const handleSearchResults = useCallback((results: Tables<"order">[]) => {
        const filtered = results.filter(order => 
            statusFilter === 'all' || order.status === statusFilter
        );
        setFilteredOrders(filtered);
    }, [statusFilter]);

    const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value;
        setStatusFilter(newStatus);
        const filtered = orders.filter(order => 
            newStatus === 'all' || order.status === newStatus
        );
        setFilteredOrders(filtered);
    };

    const handleOrderInitiatedClick = async (orderId: number) => {
        const status = 'preparation';
        const supabase = createClient();

        const { error } = await supabase.from('order').update({ status }).eq('id', orderId);
        if (error) {
            console.error('Error updating order status:', error);
        }
        router.push(`/orderID/${orderId}`);
    }

    const handleOrderPreparationClick = (orderId: number) => {
        router.push(`/orderID/${orderId}`);
    }

    const handleOrderPreparedClick = (orderId: number) => {
        router.push(`/orderID/${orderId}`);
    }

    const statusLabels: { [key: string]: string } = {
        initiated: 'Initialisée',
        preparation: 'En préparation',
        prepared: 'Préparée',
        delivering: 'En livraison',
        delivered: 'Livrée',
        finished: 'Terminée',
        canceled: 'Annulée'
    };

    const handleDeleteOrder = async (orderId: number) => {
        const supabase = createClient();
        const { error } = await supabase.from('order').delete().eq('id', orderId);
        if (error) {
            console.error('Error deleting order:', error);
        } else {
            setOrders(orders.filter(order => order.id !== orderId));
            setFilteredOrders(filteredOrders.filter(order => order.id !== orderId));
        }
    };

    const handleEditOrder = (order: Tables<"order">) => {
        setEditOrderId(order.id);
        setEditedOrderData({
            delivery_address: order.delivery_address,
            pseudo_delivery_man: order.pseudo_delivery_man,
            name_client: order.name_client,
            description_order: order.description_order,
        });
    };

    const handleInputChange = (field: keyof Tables<"order">, value: string) => {
        setEditedOrderData(prev => ({ ...prev, [field]: value }));
    };

    const handleSaveOrder = async (orderId: number) => {
        const supabase = createClient();
        const { error } = await supabase
            .from("order")
            .update(editedOrderData)
            .eq("id", orderId);

        if (error) {
            console.error("Erreur lors de la mise à jour :", error);
        } else {
            const updatedOrders = orders.map(order =>
                order.id === orderId ? { ...order, ...editedOrderData } : order
            );
            setOrders(updatedOrders);
            setFilteredOrders(updatedOrders);
            setEditOrderId(null);
        }
    };

    if (isLoading) return <div>Chargement...</div>;

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
                                className="px-4 py-2 border border-gray-300 rounded-lg"
                            >
                                <option value="all">Tous les statuts</option>
                                {Object.entries(statusLabels).map(([key, label]) => (
                                    <option key={key} value={key}>{label}</option>
                                ))}
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
                                        ${order.status === 'initiated' ? 'bg-yellow-100 text-yellow-800' :
                                        order.status === 'preparation' ? 'bg-blue-100 text-blue-800' :
                                        order.status === 'prepared' ? 'bg-purple-100 text-purple-800' :
                                        order.status === 'delivering' ? 'bg-orange-100 text-orange-800' :
                                        order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                        order.status === 'finished' ? 'bg-gray-100 text-gray-800' :
                                        order.status === 'canceled' ? 'bg-red-100 text-red-800' :
                                        'bg-gray-100 text-gray-800'}`}>
                                        {statusLabels[order.status] ?? order.status}
                                    </span>
                                </div>

                                {editOrderId === order.id ? (
                                    <div className="space-y-2 mt-2">
                                        <input
                                            value={editedOrderData.delivery_address || ''}
                                            onChange={e => handleInputChange('delivery_address', e.target.value)}
                                            className="w-full border px-2 py-1 rounded"
                                            placeholder="Adresse"
                                        />
                                        <input
                                            value={editedOrderData.pseudo_delivery_man || ''}
                                            onChange={e => handleInputChange('pseudo_delivery_man', e.target.value)}
                                            className="w-full border px-2 py-1 rounded"
                                            placeholder="Livreur"
                                        />
                                        <input
                                            value={editedOrderData.name_client || ''}
                                            onChange={e => handleInputChange('name_client', e.target.value)}
                                            className="w-full border px-2 py-1 rounded"
                                            placeholder="Client"
                                        />
                                        <textarea
                                            value={editedOrderData.description_order || ''}
                                            onChange={e => handleInputChange('description_order', e.target.value)}
                                            className="w-full border px-2 py-1 rounded"
                                            placeholder="Description"
                                        />
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleSaveOrder(order.id)}
                                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                                            >
                                                Enregistrer
                                            </button>
                                            <button
                                                onClick={() => setEditOrderId(null)}
                                                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                                            >
                                                Annuler
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <p className="text-gray-600 mt-2">{order.delivery_address}</p>
                                        <div className="mt-2 text-sm">
                                            <p><span className="font-semibold">Livreur:</span> {order.pseudo_delivery_man}</p>
                                            <p><span className="font-semibold">Client:</span> {order.name_client}</p>
                                        </div>
                                        {order.description_order && (
                                            <p className="text-sm text-gray-600 mt-2">{order.description_order}</p>
                                        )}
                                        {order.status === 'initiated' && (
                                            <div className="mt-4">
                                                <button
                                                    onClick={() => handleOrderInitiatedClick(order.id)}
                                                    className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                                                >
                                                    Ajouter des articles
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteOrder(order.id)}
                                                    className="w-full bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 mt-2"
                                                >
                                                    Supprimer
                                                </button>
                                                <button
                                                    onClick={() => handleEditOrder(order)}
                                                    className="w-full bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 mt-2"
                                                >
                                                    Modifier
                                                </button>
                                            </div>
                                        )}
                                        {order.status === 'preparation' && (
                                            <div className="mt-4">
                                                <button
                                                    onClick={() => handleOrderPreparationClick(order.id)}
                                                    className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                                                >
                                                    Continuer la préparation
                                                </button>
                                            </div>
                                        )}
                                        {order.status === 'prepared' && (
                                            <div className="mt-4">
                                                <button
                                                    onClick={() => handleOrderPreparedClick(order.id)}
                                                    className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                                                >
                                                    Détails de la commande
                                                </button>
                                            </div>
                                        )}
                                    </>
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
