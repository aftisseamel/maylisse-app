'use client';

import { useState, useEffect, useCallback } from 'react';
import { Tables } from '@/database.types';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import SearchBarOrders from "../../../components/SearchBarOrders";
import { data_orders } from '@/datas/data_orders';
import NavigationBar from '@/components/NavigationBar';
import { createClient } from '@/utils/supabase/client';
import { jsPDF } from 'jspdf';
import { deleteOrder } from './action';

type OrderStatus = 'initiated' | 'preparation' | 'prepared' | 'delivering' | 'delivered' | 'finished' | 'canceled';

export default function Page() {
    const router = useRouter();

    const [orders, setOrders] = useState<Tables<"order">[]>([]);
    const [filteredOrders, setFilteredOrders] = useState<Tables<"order">[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [deliveryMen, setDeliveryMen] = useState<{ pseudo_delivery_man: string }[]>([]);
    const [clients, setClients] = useState<{ name: string }[]>([]);
    const [orderArticles, setOrderArticles] = useState<{ [key: number]: (Tables<"order_article"> & { article: Tables<"article"> | null })[] }>({});
    const [statusCounts, setStatusCounts] = useState<{ [key: string]: number }>({});
    const [error, setError] = useState<string | null>(null);

    const [editOrderId, setEditOrderId] = useState<number | null>(null);
    const [editedOrderData, setEditedOrderData] = useState<Partial<Tables<"order">>>({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const supabase = createClient();
                
                const data = await data_orders();
                setOrders(data);
                setFilteredOrders(data);

                const counts = data.reduce((acc, order) => {
                    acc[order.status] = (acc[order.status] || 0) + 1;
                    return acc;
                }, {} as { [key: string]: number });
                setStatusCounts(counts);

                const { data: deliveryMenData, error: deliveryMenError } = await supabase
                    .from('delivery_man')
                    .select('pseudo_delivery_man');
                
                if (deliveryMenError) {
                    console.error('Error fetching delivery men:', deliveryMenError);
                } else {
                    setDeliveryMen(deliveryMenData || []);
                }

                const { data: clientsData, error: clientsError } = await supabase
                    .from('client')
                    .select('name');
                
                if (clientsError) {
                    console.error('Error fetching clients:', clientsError);
                } else {
                    setClients(clientsData || []);
                }

                const preparationAndAfter = ['preparation', 'prepared', 'delivering', 'delivered', 'finished'];
                const ordersToFetch = data.filter(order => preparationAndAfter.includes(order.status));
                
                if (ordersToFetch.length > 0) {
                    const { data: articlesData, error } = await supabase
                        .from('order_article')
                        .select('*, article(*)')
                        .in('id_order', ordersToFetch.map(order => order.id));

                    if (error) {
                        console.error('Error fetching order articles:', error);
                    } else {
                        const articlesByOrder = articlesData.reduce((acc, item) => {
                            if (!acc[item.id_order]) {
                                acc[item.id_order] = [];
                            }
                            acc[item.id_order].push(item);
                            return acc;
                        }, {} as { [key: number]: (Tables<"order_article"> & { article: Tables<"article"> | null })[] });
                        
                        setOrderArticles(articlesByOrder);
                    }
                }
            } catch (err) {
                console.error('Error:', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
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

    const handleStatusChange = async (orderId: number, newStatus: OrderStatus) => {
        try {
            const supabase = createClient();
            const { error } = await supabase
                .from('order')
                .update({ status: newStatus })
                .eq('id', orderId);

            if (error) throw error;

            const updatedOrders = orders.map(order =>
                order.id === orderId ? { ...order, status: newStatus } : order
            );
            setOrders(updatedOrders);
            setFilteredOrders(updatedOrders);

            const newCounts = { ...statusCounts };
            const oldStatus = orders.find(o => o.id === orderId)?.status;
            if (oldStatus) {
                newCounts[oldStatus] = (newCounts[oldStatus] || 1) - 1;
            }
            newCounts[newStatus] = (newCounts[newStatus] || 0) + 1;
            setStatusCounts(newCounts);

        } catch (error) {
            console.error('Error updating order status:', error);
            alert('Une erreur est survenue lors de la mise à jour du statut');
        }
    };

    const statusOptions: { value: OrderStatus; label: string }[] = [
        { value: 'initiated', label: 'Initialisée' },
        { value: 'preparation', label: 'En préparation' },
        { value: 'prepared', label: 'Préparée' },
        { value: 'delivering', label: 'En livraison' },
        { value: 'delivered', label: 'Livrée' },
        { value: 'finished', label: 'Terminée' },
        { value: 'canceled', label: 'Annulée' }
    ];

    const handleDeleteOrder = async (orderId: number) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette commande ?')) {
            return;
        }

        const supabase = createClient();
        try {
            const { error: deleteArticlesError } = await supabase
                .from('order_article')
                .delete()
                .eq('id_order', orderId);

            if (deleteArticlesError) {
                console.error('Error deleting order articles:', deleteArticlesError);
                alert('Erreur lors de la suppression des articles de la commande');
                return;
            }

            const { error: deleteOrderError } = await supabase
                .from('order')
                .delete()
                .eq('id', orderId);

            if (deleteOrderError) {
                console.error('Error deleting order:', deleteOrderError);
                alert('Erreur lors de la suppression de la commande');
            } else {
                setOrders(orders.filter(order => order.id !== orderId));
                setFilteredOrders(filteredOrders.filter(order => order.id !== orderId));
            }
        } catch (err) {
            console.error('Error:', err);
            alert('Une erreur est survenue lors de la suppression');
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

    const generateInvoice = (order: Tables<"order">) => {
        const doc = new jsPDF();
        const articles = orderArticles[order.id] || [];
        
        doc.setFontSize(20);
        doc.text('Facture', 105, 20, { align: 'center' });
        
        doc.setFontSize(12);
        doc.text(`Commande #${order.id}`, 20, 40);
        doc.text(`Date: ${new Date(order.created_at || '').toLocaleDateString()}`, 20, 50);
        
        doc.text('Client:', 20, 70);
        doc.text(order.name_client, 20, 80);
        doc.text('Adresse de livraison:', 20, 90);
        doc.text(order.delivery_address, 20, 100);
        
        doc.setFontSize(12);
        doc.text('Articles', 20, 120);
        
        doc.setFontSize(10);
        doc.text('Article', 20, 130);
        doc.text('Quantité', 100, 130);
        doc.text('Prix unitaire', 130, 130);
        doc.text('Total', 170, 130);
        
        let y = 140;
        let total = 0;
        
        articles.forEach((item) => {
            if (item.article) {
                const articleTotal = item.quantity * item.price;
                total += articleTotal;
                
                doc.text(item.article.name, 20, y);
                doc.text(item.quantity.toString(), 100, y);
                doc.text(`${item.price}€`, 130, y);
                doc.text(`${articleTotal}€`, 170, y);
                y += 10;
            }
        });
        
        doc.setFontSize(12);
        doc.text(`Total: ${total}€`, 170, y + 10, { align: 'right' });
        
        doc.text(`Statut: ${order.status}`, 20, y + 30);
        
        const fileName = `${order.name_client}_${order.id}.pdf`;
        doc.save(fileName);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cette commande ? Cette action est irréversible.')) {
            return;
        }

        const result = await deleteOrder(id);
        if (result.error) {
            setError(result.error);
            return;
        }

        setOrders(prev => prev.filter(order => order.id !== id));
        setFilteredOrders(prev => prev.filter(order => order.id !== id));
    };

    if (isLoading) return <div>Chargement...</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            <NavigationBar />
            <div className="p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
                        <h1 className="text-3xl font-bold text-gray-800">Commandes</h1>
                        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                            <div className="w-full md:w-80">
                                <SearchBarOrders orders={orders} onSearchResults={handleSearchResults} />
                            </div>
                            <select
                                value={statusFilter}
                                onChange={handleStatusFilterChange}
                                className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                            >
                                <option value="all">Tous les statuts ({orders.length})</option>
                                {statusOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label} ({statusCounts[option.value] || 0})
                                    </option>
                                ))}
                            </select>
                            <Link
                                href="/create_order"
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md"
                                >
                                <span className="text-xl">+</span>
                                <span>Créer une commande</span>
                            </Link>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredOrders.map((order) => (
                            <div key={order.id} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="font-bold text-lg text-gray-800">Commande #{order.id}</h3>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => generateInvoice(order)}
                                            className="text-gray-500 hover:text-blue-600 transition-colors"
                                            title="Télécharger la facture"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                        <select
                                            value={order.status}
                                            onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                                            className={`px-3 py-1 text-sm font-medium rounded-full ${
                                                order.status === 'initiated' ? 'bg-yellow-100 text-yellow-800' :
                                                order.status === 'preparation' ? 'bg-blue-100 text-blue-800' :
                                                order.status === 'prepared' ? 'bg-purple-100 text-purple-800' :
                                                order.status === 'delivering' ? 'bg-orange-100 text-orange-800' :
                                                order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                                order.status === 'finished' ? 'bg-gray-100 text-gray-800' :
                                                'bg-red-100 text-red-800'
                                            }`}
                                        >
                                            {statusOptions.map(option => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                        {order.status === 'initiated' && (
                                            <>
                                                <button
                                                    onClick={() => handleEditOrder(order)}
                                                    className="text-gray-500 hover:text-gray-700 transition-colors"
                                                    title="Modifier"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteOrder(order.id)}
                                                    className="text-gray-500 hover:text-red-600 transition-colors"
                                                    title="Supprimer"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {editOrderId === order.id ? (
                                    <div className="space-y-3 mt-4">
                                        <input
                                            value={editedOrderData.delivery_address || ''}
                                            onChange={e => handleInputChange('delivery_address', e.target.value)}
                                            className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                            placeholder="Adresse"
                                        />
                                        <select
                                            value={editedOrderData.pseudo_delivery_man || ''}
                                            onChange={e => handleInputChange('pseudo_delivery_man', e.target.value)}
                                            className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-white"
                                        >
                                            <option value="">Sélectionner un livreur</option>
                                            {deliveryMen.map((dm) => (
                                                <option key={dm.pseudo_delivery_man} value={dm.pseudo_delivery_man}>
                                                    {dm.pseudo_delivery_man}
                                                </option>
                                            ))}
                                        </select>
                                        <select
                                            value={editedOrderData.name_client || ''}
                                            onChange={e => handleInputChange('name_client', e.target.value)}
                                            className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-white"
                                        >
                                            <option value="">Sélectionner un client</option>
                                            {clients.map((client) => (
                                                <option key={client.name} value={client.name}>
                                                    {client.name}
                                                </option>
                                            ))}
                                        </select>
                                        <textarea
                                            value={editedOrderData.description_order || ''}
                                            onChange={e => handleInputChange('description_order', e.target.value)}
                                            className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all min-h-[100px]"
                                            placeholder="Description"
                                        />
                                        <div className="flex gap-3 mt-4">
                                            <button
                                                onClick={() => handleSaveOrder(order.id)}
                                                className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all duration-200 shadow-sm hover:shadow-md"
                                            >
                                                Enregistrer
                                            </button>
                                            <button
                                                onClick={() => setEditOrderId(null)}
                                                className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-all duration-200 shadow-sm hover:shadow-md"
                                            >
                                                Annuler
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="space-y-3">
                                            <p className="text-gray-600">{order.delivery_address}</p>
                                            <div className="text-sm space-y-1">
                                                <p className="flex items-center gap-2">
                                                    <span className="font-semibold text-gray-700">Client:</span>
                                                    <span className="text-gray-600">{order.name_client}</span>
                                                </p>
                                                {order.pseudo_delivery_man && (
                                                    <p className="flex items-center gap-2">
                                                        <span className="font-semibold text-gray-700">Livreur:</span>
                                                        <span className="text-gray-600">{order.pseudo_delivery_man}</span>
                                                    </p>
                                                )}
                                                {order.comment_order_deliveryman && (
                                                    <p className="flex items-center gap-2">
                                                        <span className="font-semibold text-gray-700">Commentaire livreur:</span>
                                                        <span className="text-gray-600">{order.comment_order_deliveryman}</span>
                                                    </p>
                                                )}
                                            </div>
                                            {order.description_order && (
                                                <p className="text-sm text-gray-600 mt-2">{order.description_order}</p>
                                            )}
                                        </div>
                                        {order.status === 'initiated' && (
                                            <div className="mt-6">
                                                <button
                                                    onClick={() => handleOrderInitiatedClick(order.id)}
                                                    className="w-full gap-2 bg-indigo-50 text-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-100 transition-all duration-200"
                                                    >
                                                    Ajouter des articles
                                                </button>
                                            </div>
                                        )}
                                        {order.status === 'preparation' && (
                                            <div className="mt-6">
                                                <button
                                                    onClick={() => handleOrderPreparationClick(order.id)}
                                                    className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all duration-200 shadow-sm hover:shadow-md"
                                                >
                                                    Continuer la préparation
                                                </button>
                                            </div>
                                        )}
                                        {order.status === 'prepared' && (
                                            <div className="mt-6">
                                                <button
                                                    onClick={() => handleOrderPreparedClick(order.id)}
                                                    className="w-full gap-2 bg-indigo-50 text-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-100 transition-all duration-200"
                                                >
                                                    Détails de la commande
                                                </button>
                                            </div>
                                        )}
                                        {['preparation', 'prepared', 'delivering', 'delivered', 'finished'].includes(order.status) && orderArticles[order.id] && (
                                            <div className="mt-4 pt-4 border-t border-gray-200">
                                                <h4 className="font-semibold text-gray-700 mb-2">Articles de la commande :</h4>
                                                <div className="space-y-2">
                                                    {orderArticles[order.id].map((orderArticle) => (
                                                        <div key={`${orderArticle.id_order}-${orderArticle.id_article}`} className="bg-gray-50 p-2 rounded">
                                                            <p className="text-sm">
                                                                <span className="font-medium">{orderArticle.article?.name}</span>
                                                                <span className="text-gray-600"> - {orderArticle.quantity} lots</span>
                                                                <span className="text-gray-600"> - {orderArticle.price}€/lot</span>
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        ))}
                    </div>

                    {filteredOrders.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-lg">Aucune commande trouvée</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
