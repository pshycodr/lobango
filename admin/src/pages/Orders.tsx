import { useNavigate } from '@tanstack/react-router';
import { Filter, Package, X } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import LoadingSpinner from '../components/Common/Loader';
import FilterButton from '../components/Orders/FilterButton';
import OrderCard from '../components/Orders/OrderCard';
import Header from '../components/Orders/OrdersHeader';
import api from '../lib/axios';
import { useOrdersStore } from '../store/zustand/useOrdersStore';
import type { Order } from '../types/orders';

type OrderResponse = {
    success: boolean;
    count: number;
    orders: Order[];
};

const AdminOrdersView: React.FC = () => {
    const [activeFilter, setActiveFilter] = useState<'all' | Order['status']>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const setOrders = useOrdersStore((state) => state.setOrders);
    const orders = useOrdersStore((state) => state.orders);
    const navigate = useNavigate();

    console.log(orders);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const res = await api.get<OrderResponse>('/api/v1/admin/orders');
                const { orders: fetchedOrders } = res.data;
                setOrders(fetchedOrders);
            } catch (error) {
                console.error('Error fetching orders:', error);
                // error toast here
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [setOrders]);

    // Search and filter orders
    const filteredOrders = useMemo(() => {
        let filtered = orders;

        // Apply status filter
        if (activeFilter !== 'all') {
            filtered = filtered.filter(order => order.status === activeFilter);
        }

        // Apply search filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            filtered = filtered.filter(order => {
                // Search in order ID
                if (order.orderId.toLowerCase().includes(query)) return true;
                
                // Search in customer name
                if (order.name.toLowerCase().includes(query)) return true;
                
                // Search in phone number
                if (order.phone.includes(query)) return true;
                
                // Search in address
                if (order.address.toLowerCase().includes(query)) return true;
                
                // Search in payment method
                if (order.paymentMethod.toLowerCase().includes(query)) return true;
                
                // Search in status
                if (order.status.toLowerCase().includes(query)) return true;
                
                // Search in item names
                if (order.items.some(item => 
                    item.name.toLowerCase().includes(query)
                )) return true;

                return false;
            });
        }

        return filtered;
    }, [orders, activeFilter, searchQuery]);

    const getOrderCountByStatus = (status: Order['status'] | 'all'): number => {
        // Count based on search results, not all orders
        const baseOrders = searchQuery.trim() 
            ? orders.filter(order => {
                const query = searchQuery.toLowerCase().trim();
                return (
                    order.orderId.toLowerCase().includes(query) ||
                    order.name.toLowerCase().includes(query) ||
                    order.phone.includes(query) ||
                    order.address.toLowerCase().includes(query) ||
                    order.paymentMethod.toLowerCase().includes(query) ||
                    order.status.toLowerCase().includes(query) ||
                    order.items.some(item => item.name.toLowerCase().includes(query))
                );
            })
            : orders;

        if (status === 'all') return baseOrders.length;
        return baseOrders.filter(order => order.status === status).length;
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
        navigate({
            to: '/order',
            search: {
                orderId: order.orderId
            }
        });
    };

    const handleSearchChange = (query: string) => {
        setSearchQuery(query);
    };

    const clearSearch = () => {
        setSearchQuery('');
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
                <Header 
                    totalOrders={orders.length} 
                    searchQuery={searchQuery}
                    onSearchChange={handleSearchChange}
                />

                {/* Search Results Info */}
                {searchQuery.trim() && (
                    <div className="mb-4 flex items-center justify-between bg-[var(--eerie-black-2)] border border-[var(--eerie-black-4)] rounded-lg p-3">
                        <div className="flex items-center gap-2">
                            <span className="text-[var(--white)] text-sm">
                                Showing {filteredOrders.length} result{filteredOrders.length !== 1 ? 's' : ''} for 
                            </span>
                            <span className="text-[var(--gold-crayola)] font-medium text-sm">"{searchQuery}"</span>
                        </div>
                        <button
                            onClick={clearSearch}
                            className="flex items-center gap-1 text-[var(--quick-silver)] hover:text-[var(--white)] text-sm transition-colors"
                        >
                            <X size={16} />
                            Clear search
                        </button>
                    </div>
                )}

                {/* Filters */}
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Filter size={18} className="text-[var(--quick-silver)]" />
                        <span className="text-[var(--quick-silver)] text-sm font-medium">Filter by status</span>
                        {searchQuery.trim() && (
                            <span className="text-[var(--gold-crayola)] text-xs">
                                (filtered by search)
                            </span>
                        )}
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
                        <h3 className="text-[var(--white)] text-lg font-medium mb-2">
                            {searchQuery.trim() ? 'No matching orders found' : 'No orders found'}
                        </h3>
                        <p className="text-[var(--quick-silver)] mb-4">
                            {searchQuery.trim() 
                                ? `No orders match your search "${searchQuery}"${activeFilter !== 'all' ? ` with status "${activeFilter}"` : ''}.`
                                : activeFilter === 'all'
                                    ? "There are no orders yet."
                                    : `No orders with status "${activeFilter}".`
                            }
                        </p>
                        {searchQuery.trim() && (
                            <button
                                onClick={clearSearch}
                                className="bg-[var(--gold-crayola)] text-[var(--smoky-black-1)] px-4 py-2 rounded-lg font-medium hover:bg-[var(--gold-crayola)]/90 transition-colors"
                            >
                                Clear search
                            </button>
                        )}
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