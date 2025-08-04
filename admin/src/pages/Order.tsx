import { useNavigate, useSearch } from '@tanstack/react-router';
import {
  ArrowLeft,
  CreditCard,
  Edit3,
  IndianRupee,
  MapPin,
  Phone,
  ShoppingBag,
  User
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import InfoCard from '../components/Order/InfoCard';
import OrderItemCard from '../components/Order/OrderItemCard';
import StatusBadge from '../components/Order/OrderStatusBadge';
import StatusUpdateModal from '../components/Order/StatusUpdateModal';
import { Route } from '../routes/__root';
import { useOrdersStore } from '../store/zustand/useOrdersStore';
import type { Order } from '../types/orders';
import api from '../lib/axios';

const AdminOrderDetails: React.FC = () => {
  const { orderId } = useSearch({ from: Route.id });
  console.log(orderId);

  const getOrderById = useOrdersStore(state => state.getOrderById);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const navigate = useNavigate()

  useEffect(() => {
    const fetched = getOrderById(orderId);
    setOrder(fetched || null);
  }, [orderId, getOrderById]);

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
    };
  };

  const handleStatusUpdate = async (newStatus: Order['status']) => {
    if (!order) return;
    setLoading(true);

    try {
      const payload = { status: newStatus, orderId };
      console.log(payload);

      const res = await api.post("/api/v1/admin/orders/update-status", payload);
      const data = res.data;

      if (!data.success) {
        alert("Failed to update status");
        return;
      }

      // Update local state
      setOrder(prev => (prev ? { ...prev, status: newStatus } : null));

      // Update Zustand store too
      useOrdersStore.getState().setOrders(
        useOrdersStore.getState().orders.map(o =>
          o.orderId === orderId ? { ...o, status: newStatus } : o
        )
      );
    } catch (error) {
      console.error('Failed to update status:', error);
      alert("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };
  const handleBack = () => {
    navigate({ to: '/orders' })
  };

  if (!order) {
    return (
      <div className="text-center text-white p-10">
        <p>Order not found.</p>
      </div>
    );
  }

  const subtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const taxes = subtotal * 0.08;
  const deliveryFee = 5.0;

  const { date, time } = formatDateTime(order.createdAt);

  return (
    <div className="min-h-screen bg-[var(--smoky-black-1)]">
      {/* Header */}
      <div className="sticky top-0 bg-[var(--smoky-black-1)] border-b border-[var(--eerie-black-4)] z-40">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBack}
                className="text-[var(--quick-silver)] hover:text-[var(--white)] transition-colors"
              >
                <ArrowLeft size={24} />
              </button>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-[var(--white)]">
                  Order #{order.orderId}
                </h1>
                <p className="text-[var(--quick-silver)] text-sm">{date} • {time}</p>
              </div>
            </div>
            <button
              onClick={() => setShowStatusModal(true)}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-[var(--eerie-black-2)] border border-[var(--eerie-black-4)] rounded-lg text-[var(--white)] hover:bg-[var(--eerie-black-3)] hover:border-[var(--gold-crayola)]/30 transition-all disabled:opacity-50"
            >
              <Edit3 size={16} />
              <span className="hidden sm:inline">Update Status</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Order Status */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[var(--white)]">Order Status</h2>
            <StatusBadge status={order.status} size="lg" />
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <InfoCard
            icon={<User size={20} />}
            title="Customer Information"
            content={
              <div className="space-y-2">
                <div className="text-[var(--white)] font-medium">{order.name}</div>
                <div className="flex items-center gap-2">
                  <Phone size={14} />
                  <span>{order.phone}</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin size={14} className="mt-0.5" />
                  <span className="flex-1">{order.address}</span>
                </div>
              </div>
            }
          />
          <InfoCard
            icon={<CreditCard size={20} />}
            title="Payment Information"
            content={
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Method:</span>
                  <span className="text-[var(--white)] capitalize">{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className={`px-2 py-1 rounded text-xs ${order.paymentStatus === 'paid'
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-orange-500/20 text-orange-400'
                    }`}>
                    {order.paymentStatus}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Total:</span>
                  <span className="text-[var(--gold-crayola)] font-semibold">₹{order.total.toFixed(2)}</span>
                </div>
              </div>
            }
          />
        </div>

        {/* Notes */}
        {order.notes && (
          <div className="mb-6">
            <InfoCard
              icon={<Edit3 size={20} />}
              title="Special Instructions"
              content={<div className="text-[var(--white)]">{order.notes}</div>}
            />
          </div>
        )}

        {/* Items */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <ShoppingBag size={20} className="text-[var(--gold-crayola)]" />
            <h2 className="text-lg font-semibold text-[var(--white)]">Order Items</h2>
            <span className="text-[var(--quick-silver)] text-sm">({order.items.length} items)</span>
          </div>
          <div className="space-y-3">
            {order.items.map(item => (
              <OrderItemCard key={item.item_id} item={item} />
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="bg-[var(--eerie-black-2)] border border-[var(--eerie-black-4)] rounded-lg p-4">
          <div className="flex items-center gap-3 mb-4">
            <IndianRupee size={20} className="text-[var(--gold-crayola)]" />
            <h3 className="text-lg font-semibold text-[var(--white)]">Order Summary</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-[var(--quick-silver)]">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[var(--quick-silver)]">
              <span>Taxes (8%)</span>
              <span>₹{taxes.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[var(--quick-silver)]">
              <span>Delivery Fee</span>
              <span>₹{deliveryFee.toFixed(2)}</span>
            </div>
            <div className="border-t border-[var(--eerie-black-4)] pt-3">
              <div className="flex justify-between text-lg font-semibold">
                <span className="text-[var(--white)]">Total</span>
                <span className="text-[var(--gold-crayola)]">₹{order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <StatusUpdateModal
        currentStatus={order.status}
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        onUpdate={handleStatusUpdate}
      />
    </div>
  );
};

export default AdminOrderDetails;
