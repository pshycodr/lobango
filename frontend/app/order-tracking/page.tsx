"use client"

import { useState, useEffect } from 'react';
import { Inter, Playfair_Display } from 'next/font/google';
import axios from 'axios';
import OrderItems from '@/components/ViewOrder/OrderItems';
import OrderDetails from '@/components/ViewOrder/OrderDetails';
import OrderIdInput from '@/components/ViewOrder/OrderIdInput';
import ErrorMessage from '@/components/ViewOrder/ErrorMessage';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import api from '@/lib/axios';

const inter = Inter({ subsets: ['latin'] });
const playfair = Playfair_Display({ subsets: ['latin'] });

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  orderId: string;
  name: string;
  phone: string;
  address: string;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  status: string;
  createdAt: string;
}

interface OrderResponse {
  success: boolean;
  order: Order;
  items: OrderItem[];
}

export default function ViewOrderPage() {
  const [orderId, setOrderId] = useState<string>('');
  const [orderData, setOrderData] = useState<OrderResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [showInput, setShowInput] = useState<boolean>(false);

  useEffect(() => {
    const storedOrderId = localStorage.getItem('orderId');
    if (storedOrderId) {
      setOrderId(storedOrderId);
      fetchOrder(storedOrderId);
    } else {
      setShowInput(true);
    }
  }, []);

  const fetchOrder = async (id: string) => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:8787/api/v1/client/getorders', {
        order_id: id
      });

      if (response.data.success) {
        setOrderData(response.data);
        localStorage.setItem('orderId', id);
        setShowInput(false);
      } else {
        setError('Order not found. Please check your order ID.');
      }
    } catch (err) {
      setError('Failed to fetch order details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOrderIdSubmit = (id: string) => {
    setOrderId(id);
    fetchOrder(id);
  };

  const handleTryAnotherId = () => {
    setOrderData(null);
    setShowInput(true);
    setError('');
    localStorage.removeItem('orderId');
  };

  return (
    <div className={`min-h-screen bg-gradient-to-b from-[var(--eerie-black-1)] to-[var(--smoky-black-2)] ${inter.className}`}>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <header className="text-center mb-8">
          <h1 className={`${playfair.className} text-3xl md:text-4xl font-bold text-[var(--gold-crayola)] mb-2`}>
            My Order
          </h1>
          <p className="text-[var(--quick-silver)] text-sm md:text-base">
            Track your delicious order status
          </p>
        </header>

        {loading && <LoadingSpinner />}

        {error && (
          <ErrorMessage
            message={error}
            onRetry={() => fetchOrder(orderId)}
            onTryAnother={handleTryAnotherId}
          />
        )}

        {showInput && !loading && (
          <OrderIdInput onSubmit={handleOrderIdSubmit} />
        )}

        {orderData && !loading && (
          <div className="space-y-6">
            <OrderDetails order={orderData.order} onTryAnother={handleTryAnotherId} />
            <OrderItems items={orderData.items} total={orderData.order.total} />
          </div>
        )}
      </div>
    </div>
  );
}


