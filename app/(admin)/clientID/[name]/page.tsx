'use client';

import { useState, useEffect, use } from 'react';
import { Tables } from '@/database.types';
import data_orders from '@/datas/data_orders';
import data_clients from '@/datas/data_clients';
import { useRouter } from 'next/navigation';
import NavigationBar from '@/components/NavigationBar';
import { createClient } from '@supabase/supabase-js';
import { jsPDF } from 'jspdf';

import Link from 'next/link';

export default function ClientPage({ params }: { params: Promise<{ name: string }> }) {
    const resolvedParams = use(params);
    const router = useRouter();
    
    const [client, setClient] = useState<Tables<"client"> | null>(null);
    const [orders, setOrders] = useState<Tables<"order">[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [dateFilter, setDateFilter] = useState<string>('all');
    const [orderArticles, setOrderArticles] = useState<{ [key: number]: (Tables<"order_article"> & { article: Tables<"article"> | null })[] }>({});
   

    useEffect(() => {
        const fetchClientData = async () => {
            try {                
                const clients = await data_clients();
                console.log("clients : ", clients)
                
                const client = clients.find(c => c.name === decodeURIComponent(resolvedParams.name));
                setClient(client || null);

                const orders = await data_orders();
                const clientOrders = orders.filter(o => o.name_client === decodeURIComponent(resolvedParams.name));

                const sortedOrders = clientOrders.sort((a, b) => {
                    const statusOrder = {
                        'initiated': 1,
                        'preparation': 2,
                        'prepared': 3,
                        'delivering': 4,
                        'delivered': 5,
                        'finished': 6
                    };
                    return (statusOrder[a.status as keyof typeof statusOrder] || 0) - 
                           (statusOrder[b.status as keyof typeof statusOrder] || 0);
                });
                setOrders(sortedOrders);

                // Récupérer les articles pour les commandes en préparation ou plus
                const supabase = createClient(
                    process.env.NEXT_PUBLIC_SUPABASE_URL!,
                    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
                );
                const preparationAndAfter = ['preparation', 'prepared', 'delivering', 'delivered', 'finished'];
                const ordersToFetch = clientOrders.filter(order => preparationAndAfter.includes(order.status));
                
                if (ordersToFetch.length > 0) {
                    const { data: articlesData, error } = await supabase
                        .from('order_article')
                        .select('*, article(*)')
                        .in('id_order', ordersToFetch.map(order => order.id));

                    if (error) {
                        console.error('Error fetching order articles:', error);
                    } else {
                        // Organiser les articles par commande
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

            } catch (error) {
                console.error('Error:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchClientData();
    }, [resolvedParams.name]);

    const filteredOrders = orders.filter(order => {
        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
        const orderDate = order.created_at ? new Date(order.created_at) : new Date();
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const lastWeek = new Date(today);
        lastWeek.setDate(lastWeek.getDate() - 7);
        const lastMonth = new Date(today);
        lastMonth.setMonth(lastMonth.getMonth() - 1);

        let matchesDate = true;
        if (dateFilter === 'today') {
            matchesDate = orderDate.toDateString() === today.toDateString();
        } else if (dateFilter === 'yesterday') {
            matchesDate = orderDate.toDateString() === yesterday.toDateString();
        } else if (dateFilter === 'lastWeek') {
            matchesDate = orderDate >= lastWeek;
        } else if (dateFilter === 'lastMonth') {
            matchesDate = orderDate >= lastMonth;
        }

        return matchesStatus && matchesDate;
    });

    const generateInvoice = (order: Tables<"order">) => {
        const doc = new jsPDF();
        const articles = orderArticles[order.id] || [];
        
        doc.setFontSize(20);
        doc.text('Facture', 105, 20, { align: 'center' });
        
        doc.setFontSize(12);
        doc.text(`Commande #${order.id}`, 20, 40);
        doc.text(`Date: ${new Date(order.created_at || '').toLocaleDateString()}`, 20, 50);
        
        doc.text('Client:', 20, 70);
        doc.text(client?.name || '', 20, 80);
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
        
        const fileName = `${client?.name}_${order.id}.pdf`;
        doc.save(fileName);
    };

    if (isLoading) {
        return <div>Chargement...</div>;
    }

    if (!client) {
        return <div>Client non trouvé</div>;
    }


    return (
        <div>
           <NavigationBar />
        <div className="p-4"> 
        

            <div className="max-w-6xl mx-auto">
                <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-2xl font-bold mb-4">{client.name}</h1>
                            <div className="space-y-2">
                                <p><span className="font-semibold">Email:</span> {client.email}</p>
                                {client.phone && (
                                    <p><span className="font-semibold">Téléphone:</span> {client.phone}</p>
                                )}
                                {client.address_client && (
                                    <p><span className="font-semibold">Adresse:</span> {client.address_client}</p>
                                )}
                            </div>
                        </div>
                        <Link
                            href="/client"
                            className="text-indigo-600 hover:text-indigo-800"
                        >
                            Retour à la liste des clients
                        </Link>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">Commandes du client</h2>
                        <div className="flex gap-4">
                            <select
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="all">Toutes les dates</option>
                                <option value="today">Aujourd'hui</option>
                                <option value="yesterday">Hier</option>
                                <option value="lastWeek">7 derniers jours</option>
                                <option value="lastMonth">30 derniers jours</option>
                            </select>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
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
                        </div>
                    </div>
                    {filteredOrders.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredOrders.map((order) => (
                                <div key={order.id} className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200">
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-bold">Commande #{order.id}</h3>
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
                                    </div>
                                    <p className="text-gray-600 mt-2">{order.delivery_address}</p>
                                    <p className="text-sm mt-2">
                                        <span className="font-semibold">Livreur:</span> {order.pseudo_delivery_man}
                                    </p>
                                    {order.description_order && (
                                        <p className="text-sm text-gray-600 mt-2">{order.description_order}</p>
                                    )}
                                    <p className="text-xs text-gray-500 mt-2">
                                        {order.created_at ? new Date(order.created_at).toLocaleDateString() : ''}
                                    </p>

                                    {order.status === 'initiated' && (
                                        <div>
                                            <button className="bg-blue-500 text-white px-4 py-2 rounded-md"
                                            onClick={() => {
                                                console.log("Ajouter des articles à la commande")
                                                const orderId = order.id;
                                                router.push(`/orderID/${orderId}`)
                                            }}>
                                                <p> Ajouter des articles à la commande </p>
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
                                    
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center py-4">Aucune commande trouvée</p>
                    )}
                </div>
            </div>
        </div>
    </div>
    );
} 