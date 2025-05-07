'use client';

import { useState, useEffect, use } from 'react';
import { Tables } from '@/database.types';
import Link from 'next/link';
import data_orders from '@/app/data_orders';
import data_delivery_men from '@/app/data_delivery_men';

export default function DeliveryManPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    return (
        <div>
            <h1>Delivery Man ID : {resolvedParams.id}</h1>
        </div>
    )
} 