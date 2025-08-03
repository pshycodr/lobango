import { Filter, Package } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import LoadingSpinner from '../components/Common/Loader';
import FilterButton from '../components/Orders/FilterButton';
import OrderCard from '../components/Orders/OrderCard';
import Header from '../components/Orders/OrdersHeader';
import type { Order } from '../types/orders';
import { useOrdersStore } from '../store/zustand/useOrdersStore';
import api from '../lib/axios';
import { useNavigate } from '@tanstack/react-router';

type OrderResponse = {
    success: boolean
    count: number
    orders: Order[]
}

const AdminOrdersView: React.FC = () => {
    const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
    const [activeFilter, setActiveFilter] = useState<'all' | Order['status']>('all');
    const [loading, setLoading] = useState(true);
    const setOrders = useOrdersStore((state) => state.setOrders)
    const orders = useOrdersStore((state) => state.orders)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true)
            const res = await api.get<OrderResponse>('/api/v1/admin/orders')
            const { orders: fetchedOrders } = res.data
            setOrders(fetchedOrders)
            setFilteredOrders(fetchedOrders)
            setLoading(false)
        }

        fetchOrders()
    }, [])

    // Filter orders
    useEffect(() => {
        if (activeFilter === 'all') {
            setFilteredOrders(orders);
        } else {
            setFilteredOrders(orders.filter(order => order.status === activeFilter));
        }
    }, [activeFilter, orders]);

    const getOrderCountByStatus = (status: Order['status'] | 'all') => {
        if (status === 'all') return orders.length;
        return orders.filter(order => order.status === status).length;
    };

    const filters: Array<{ key: 'all' | Order['status']; label: string }> = [
        { key: 'all', label: 'All Orders' },
        { key: 'pending', label: 'Pending' },
        { key: 'accepted', label: 'Accepted' },
        { key: 'out for delivery', label: 'Out for Delivery' },
        { key: 'delivered', label: 'Delivered' },
        { key: 'rejected', label: 'Rejected' }
    ];

    const handleOrderClick = (order: Order) => {
        console.log('Order clicked:', order.orderId);
        navigate({to: `/order?${order.orderId}`})
        
    };

    if (loading) {
        return (
            <div className='bg-[var(--smoky-black-1)] h-screen flex justify-center items-center'>
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--smoky-black-1)] p-4">
            <div className="max-w-7xl mx-auto">
                <Header totalOrders={orders.length} />

                {/* Filters */}
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Filter size={18} className="text-[var(--quick-silver)]" />
                        <span className="text-[var(--quick-silver)] text-sm font-medium">Filter by status</span>
                    </div>

                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-[var(--eerie-black-4)] scrollbar-track-transparent">
                        {filters.map(filter => (
                            <FilterButton
                                key={filter.key}
                                label={filter.label}
                                isActive={activeFilter === filter.key}
                                count={getOrderCountByStatus(filter.key)}
                                onClick={() => setActiveFilter(filter.key)}
                            />
                        ))}
                    </div>
                </div>

                {/* Orders Grid */}
                {filteredOrders.length === 0 ? (
                    <div className="text-center py-12">
                        <Package size={48} className="text-[var(--quick-silver)] mx-auto mb-4" />
                        <h3 className="text-[var(--white)] text-lg font-medium mb-2">No orders found</h3>
                        <p className="text-[var(--quick-silver)]">
                            {activeFilter === 'all'
                                ? "There are no orders yet."
                                : `No orders with status "${activeFilter}".`
                            }
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredOrders.map(order => (
                            <OrderCard
                                key={order.orderId}
                                order={order}
                                onClick={() => handleOrderClick(order)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminOrdersView;