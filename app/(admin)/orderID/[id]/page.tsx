'use client';

import { use, useEffect, useState } from 'react';
import { Tables } from '@/database.types';
import { createClient } from '@/utils/supabase/client';
import SearchBar from '@/app/components/SearchBarArticles';

export default function OrderID( { params }: { params: Promise<{ id: string }> }) {
    const searchParams = use(params);
    const [order, setOrder] = useState<Tables<"order"> | null>(null);
    const [articles, setArticles] = useState<Tables<"article">[]>([]);
    const [filteredArticles, setFilteredArticles] = useState<Tables<"article">[]>([]);

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
            setIsLoading(false);
        }
        fetchOrder();
    }, [searchParams.id]);

    const handleSearchResults = (results: Tables<"article">[]) => {
        setFilteredArticles(results);
    }

    if (isLoading) {
        return <div>Chargement...</div>;
    }

    return (
        <div>
            <p> Order ID </p>

            <SearchBar articles={articles} onSearchResults={handleSearchResults} />

            <div key={order?.id}>
                <p> {order?.id} </p>
                <p> {order?.name_client} </p>
                <p> {order?.status} </p>
                <p> {order?.description_order} </p>
            </div>

            <p> VOICI LES ARTICLES ici</p>

            {filteredArticles.map((article) => ( // Utiliser filteredArticles au lieu de articles
                <div key={article.id}>
                    <p> {article.name} </p>
                    <p> {article.price} </p>
                    <p> {article.quantity} </p>
                </div>
            ))}

            <p> {searchParams.id} </p>
        </div>
    )
}