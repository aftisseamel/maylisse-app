'use client';

import { use, useEffect, useState } from 'react';
import { Tables } from '@/database.types';
import { createClient } from '@/utils/supabase/client';
import SearchBar from '@/components/SearchBarArticles';
import Input from '@/components/Input';
import { insertOrderArticle } from './action';
import NavigationBar from '@/components/NavigationBar';
import { jsPDF } from 'jspdf';

export default function OrderID( { params }: { params: Promise<{ id: string }> }) {

    const searchParams = use(params);
    const [order, setOrder] = useState<Tables<"order"> | null>(null);
    const [articles, setArticles] = useState<Tables<"article">[]>([]);
    const [filteredArticles, setFilteredArticles] = useState<Tables<"article">[]>([]);
    const [articleToSelect, setArticleToSelect] = useState<Tables<"article"> | null>(null);
    const [orderArticles, setOrderArticles] = useState<(Tables<"order_article"> & { article: Tables<"article"> | null })[]>([]);
    const [editingArticle, setEditingArticle] = useState<{ id_order: number; id_article: number; price: number; quantity: number } | null>(null);

    const [formData, setFormData] = useState({
        id_order: parseInt(searchParams.id),
        id_article: 0,
        price: 0,
        quantity: 0,
    });

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            const supabase = createClient();
            const { data : dataOrder, error : errorOrder } = await supabase
                .from('order')
                .select('*')
                .eq('id', parseInt(searchParams.id));
            if (errorOrder) {
                console.error('Error fetching order:', errorOrder);
            } else {
                setOrder(dataOrder[0]);
            }

            const { data : dataArticles, error : errorArticles } = await supabase
                .from('article')
                .select('*')
                
            if (errorArticles) {
                console.error('Error fetching articles:', errorArticles);
            } else {
                setArticles(dataArticles);
                setFilteredArticles(dataArticles);
            }

            const { data: orderArticlesData, error: orderArticlesError } = await supabase
                .from('order_article')
                .select('*, article(*)')
                .eq('id_order', parseInt(searchParams.id));

            if (orderArticlesError) {
                console.error('Error fetching order articles:', orderArticlesError);
            } else {
                setOrderArticles(orderArticlesData);
            }

            setIsLoading(false);
        }
        fetchOrder();
    }, [searchParams.id]);

    const handleSearchResults = (results: Tables<"article">[]) => {
        setFilteredArticles(results);
    }

    const handleSelectArticle = (article: Tables<"article">) => {
        if (articleToSelect?.id === article.id) {
            setArticleToSelect(null);
            setFormData({
                ...formData,
                id_article: 0,
                price: 0,
                quantity: 0
            });
        } else {
            setArticleToSelect(article);
            setFormData({
                ...formData,
                id_article: article.id
            });
        }
    }

    const handleSubmitAddArticle = async () => {
        if (!formData.price || !formData.quantity) {
            alert('Veuillez remplir tous les champs');
            return;
        }

        if (formData.price < 0 || formData.quantity < 0) {
            alert('Les valeurs ne peuvent pas être négatives');
            return;
        }

        const article = articles.find(a => a.id === formData.id_article);
        if (!article) {
            alert('Article non trouvé');
            return;
        }

        const quantityNeeded = formData.quantity * 2000;
        if (quantityNeeded > article.quantity) {
            alert(`Stock insuffisant. Stock disponible: ${article.quantity} unités`);
            return;
        }
        
        const formDataObj = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                formDataObj.append(key, String(value));
            }
        });

        const response = await insertOrderArticle(formDataObj);
        
        if (response.success) {
            const supabase = createClient();
            const { error: updateStockError } = await supabase
                .from('article')
                .update({ quantity: article.quantity - quantityNeeded })
                .eq('id', article.id);

            if (updateStockError) {
                console.error('Error updating article stock:', updateStockError);
                alert('Erreur lors de la mise à jour du stock');
                return;
            }

            const { data: updatedArticles, error: articlesError } = await supabase
                .from('article')
                .select('*');
            
            if (!articlesError) {
                setArticles(updatedArticles);
                setFilteredArticles(updatedArticles);
            }

            const { data: orderArticlesData, error: orderArticlesError } = await supabase
                .from('order_article')
                .select('*, article(*)')
                .eq('id_order', parseInt(searchParams.id));

            if (!orderArticlesError) {
                setOrderArticles(orderArticlesData);
            }
            
            setArticleToSelect(null);
            setFormData({
                ...formData,
                id_article: 0,
                price: 0,
                quantity: 0
            });
        } else {
            alert('l\'article existe peut etre deja dans la commande');
        }
    }

    const handleDeleteArticle = async (id_order: number, id_article: number) => {
        const orderArticle = orderArticles.find(oa => 
            oa.id_order === id_order && 
            oa.id_article === id_article
        );

        if (!orderArticle) {
            alert('Article de commande non trouvé');
            return;
        }

        const article = articles.find(a => a.id === id_article);
        if (!article) {
            alert('Article non trouvé');
            return;
        }

        const quantityToRestore = orderArticle.quantity * 2000;

        const supabase = createClient();
        const { error: orderArticlesError } = await supabase
            .from('order_article')
            .delete()
            .eq('id_order', id_order)
            .eq('id_article', id_article);

        if (orderArticlesError) {
            console.error('Error deleting article:', orderArticlesError);
            return;
        }

        const { error: updateStockError } = await supabase
            .from('article')
            .update({ quantity: article.quantity + quantityToRestore })
            .eq('id', article.id);

        if (updateStockError) {
            console.error('Error updating article stock:', updateStockError);
            alert('Erreur lors de la mise à jour du stock');
            return;
        }

        const { data: updatedArticles, error: articlesError } = await supabase
            .from('article')
            .select('*');
        
        if (!articlesError) {
            setArticles(updatedArticles);
            setFilteredArticles(updatedArticles);
        }

        const { data: orderArticlesData, error: orderArticlesError2 } = await supabase
            .from('order_article')
            .select('*, article(*)')
            .eq('id_order', parseInt(searchParams.id));

        if (!orderArticlesError2) {
            setOrderArticles(orderArticlesData);
        }   
    }

    const handleEditArticle = (orderArticle: Tables<"order_article">) => {
        setEditingArticle({
            id_order: orderArticle.id_order,
            id_article: orderArticle.id_article,
            price: orderArticle.price,
            quantity: orderArticle.quantity
        });
    };

    const handleUpdateArticle = async () => {
        if (!editingArticle) return;

        if (editingArticle.price < 0 || editingArticle.quantity < 0) {
            alert('Les valeurs ne peuvent pas être négatives');
            return;
        }

        const article = articles.find(a => a.id === editingArticle.id_article);
        if (!article) {
            alert('Article non trouvé');
            return;
        }

        const oldOrderArticle = orderArticles.find(oa => 
            oa.id_order === editingArticle.id_order && 
            oa.id_article === editingArticle.id_article
        );

        if (!oldOrderArticle) {
            alert('Article de commande non trouvé');
            return;
        }

        const oldQuantityNeeded = oldOrderArticle.quantity * 2000;
        const newQuantityNeeded = editingArticle.quantity * 2000;
        const quantityDifference = newQuantityNeeded - oldQuantityNeeded;

        if (quantityDifference > 0 && quantityDifference > article.quantity) {
            alert(`Stock insuffisant. Stock disponible: ${article.quantity} unités`);
            return;
        }

        const supabase = createClient();
        const { error } = await supabase
            .from('order_article')
            .update({
                price: editingArticle.price,
                quantity: editingArticle.quantity
            })
            .eq('id_order', editingArticle.id_order)
            .eq('id_article', editingArticle.id_article);

        if (error) {
            console.error('Error updating article:', error);
            return;
        }

        const { error: updateStockError } = await supabase
            .from('article')
            .update({ quantity: article.quantity - quantityDifference })
            .eq('id', article.id);

        if (updateStockError) {
            console.error('Error updating article stock:', updateStockError);
            alert('Erreur lors de la mise à jour du stock');
            return;
        }

        const { data: updatedArticles, error: articlesError } = await supabase
            .from('article')
            .select('*');
        
        if (!articlesError) {
            setArticles(updatedArticles);
            setFilteredArticles(updatedArticles);
        }

        const { data: orderArticlesData, error: orderArticlesError } = await supabase
            .from('order_article')
            .select('*, article(*)')
            .eq('id_order', parseInt(searchParams.id));

        if (!orderArticlesError) {
            setOrderArticles(orderArticlesData);
        }

        setEditingArticle(null);
    };

    const handleCancelEdit = () => {
        setEditingArticle(null);
    };

    const handleConfirmOrder = async () => {
        const supabase = createClient();
        const { error } = await supabase
            .from('order')
            .update({ status: 'prepared' })
            .eq('id', parseInt(searchParams.id));

        if (error) {
            console.error('Error updating order status:', error);
            alert('Une erreur est survenue lors de la confirmation de la commande');
        } else {
            setOrder(prev => prev ? { ...prev, status: 'prepared' } : null);
        }
    };

    const generateInvoice = () => {
        if (!order) return;
        
        const doc = new jsPDF();
        
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
        
        orderArticles.forEach((item) => {
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

    return (
        <div>
            <NavigationBar />

            <div className="p-6 max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">Détails de la commande #{order?.id}</h1>
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-600">Client</p>
                                <p className="font-medium">{order?.name_client}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Statut</p>
                                <p className="font-medium">{order?.status}</p>
                            </div>
                            <div className="col-span-2">
                                <p className="text-sm text-gray-600">Description</p>
                                <p className="font-medium">{order?.description_order}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Articles de la commande</h2>
                    <div className="bg-white rounded-lg shadow-md p-6">
                        {orderArticles.length === 0 ? (
                            <p className="text-gray-500">Aucun article dans la commande</p>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {orderArticles.map((orderArticle) => (
                                        <div key={`${orderArticle.id_order}-${orderArticle.id_article}`} className="bg-gray-50 rounded-lg p-4">
                                            <h3 className="font-semibold text-gray-800">{orderArticle.article?.name}</h3>
                                            {editingArticle && 
                                             editingArticle.id_order === orderArticle.id_order && 
                                             editingArticle.id_article === orderArticle.id_article ? (
                                                <div className="mt-4 space-y-4">
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <Input 
                                                            type="number" 
                                                            name="price" 
                                                            placeholder="Prix"
                                                            value={editingArticle.price.toString()}
                                                            onChange={(e) => setEditingArticle({
                                                                ...editingArticle,
                                                                price: parseFloat(e.target.value) || 0
                                                            })}
                                                        />
                                                        <Input 
                                                            type="number" 
                                                            name="quantity" 
                                                            placeholder="Nombre de lots"
                                                            value={editingArticle.quantity.toString()}
                                                            onChange={(e) => setEditingArticle({
                                                                ...editingArticle,
                                                                quantity: parseFloat(e.target.value) || 0
                                                            })}
                                                        />
                                                    </div>
                                                    <div className="text-sm space-y-1">
                                                        <p className="text-gray-600">Quantité totale: {editingArticle.quantity * 2000}</p>
                                                        <p className="text-gray-600">Prix total: {editingArticle.price * editingArticle.quantity * 2000}€</p>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button 
                                                            onClick={handleUpdateArticle}
                                                            className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
                                                        >
                                                            Confirmer
                                                        </button>
                                                        <button 
                                                            onClick={handleCancelEdit}
                                                            className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors"
                                                        >
                                                            Annuler
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="mt-2 space-y-1">
                                                        <p className="text-sm text-gray-600">Lots: {orderArticle.quantity}</p>
                                                        <p className="text-sm text-gray-600">Quantité totale: {orderArticle.quantity * 2000}</p>
                                                        <p className="text-sm text-gray-600">Prix unitaire: {orderArticle.price}€</p>
                                                        <p className="text-sm text-gray-600">Prix total: {orderArticle.price * orderArticle.quantity * 2000}€</p>
                                                    </div>
                                                    {order && order.status === 'preparation' && (
                                                        <div className="mt-4 flex gap-2">
                                                            <button 
                                                                onClick={() => handleEditArticle(orderArticle)}
                                                                className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                                                            >
                                                                Modifier
                                                            </button>
                                                            <button 
                                                                onClick={() => handleDeleteArticle(orderArticle.id_order, orderArticle.id_article)}
                                                                className="flex-1 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
                                                            >
                                                                Supprimer
                                                            </button>
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                {order?.status === 'preparation' && (
                                    <div className="mt-6">
                                        <button
                                            onClick={handleConfirmOrder}
                                            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
                                        >
                                            Confirmer la commande
                                        </button>
                                    </div>
                                )}
                                {order?.status === 'prepared' && (
                                    <div className="mt-6">
                                        <button
                                            onClick={generateInvoice}
                                            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
                                            </svg>
                                            Télécharger la facture
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>

                {order && order.status === 'preparation' && (
                    <>
                        <div className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Rechercher un article</h2>
                            <SearchBar articles={articles} onSearchResults={handleSearchResults} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredArticles.map((article) => (
                                <div key={article.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{article.name}</h3>
                                    <div className="space-y-2 mb-4">
                                        <p className="text-gray-600">Prix: {article.price}€</p>
                                        <p className="text-gray-600">Stock: {article.quantity}</p>
                                    </div>
                                    {articleToSelect?.id === article.id ? (
                                        <div className="mt-4 space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <Input 
                                                    type="number" 
                                                    name="price" 
                                                    placeholder={`Prix : ${article.price}`}
                                                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0})} 
                                                />
                                                <Input 
                                                    type="number" 
                                                    name="quantity" 
                                                    placeholder="Nombre de lots" 
                                                    onChange={(e) => setFormData({ ...formData, quantity: parseFloat(e.target.value) || 0})}
                                                />
                                            </div>
                                            <div className="text-sm space-y-1">
                                                <p className="text-gray-600">Quantité totale: {formData.quantity * 2000}</p>
                                                <p className="text-gray-600">Prix total: {formData.price * formData.quantity * 2000}€</p>
                                                <p className="text-gray-600">Quantité restante: {article.quantity - formData.quantity * 2000}</p>
                                            </div>
                                            <button 
                                                type='submit' 
                                                onClick={() => handleSubmitAddArticle()}
                                                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
                                            >
                                                Confirmer l'ajout
                                            </button>
                                        </div>
                                    ) : (
                                        <button 
                                            type='submit' 
                                            onClick={() => handleSelectArticle(article)}
                                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                                        >
                                            Ajouter cet article
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}