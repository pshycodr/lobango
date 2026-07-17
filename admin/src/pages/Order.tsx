import { useNavigate, useSearch } from '@tanstack/react-router';
import {
  ArrowLeft,
  Clock,
  CreditCard,
  Edit3,
  IndianRupee,
  MapPin,
  Package,
  Phone,
  ShoppingBag,
  User
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import InfoCard from '../components/Order/InfoCard';
import OrderItemCard from '../components/Order/OrderItemCard';
import StatusBadge from '../components/Order/OrderStatusBadge';
import StatusUpdateModal from '../components/Order/StatusUpdateModal';
import api from '../lib/axios';
import { Route } from '../routes/__root';
import { useOrdersStore } from '../store/zustand/useOrdersStore';
import type { Order } from '../types/orders';
import MapLocation from '../components/Order/MapLocation';

interface OrderSearchParams {
  orderId?: string;
}

const AdminOrderDetails: React.FC = () => {
  const searchParams = useSearch({ from: Route.id }) as OrderSearchParams;
  const orderId = searchParams.orderId;

  const getOrderById = useOrdersStore(state => state.getOrderById);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (orderId) {
      const fetched = getOrderById(orderId);
      setOrder(fetched || null);
    }
  }, [orderId, getOrderById]);

  const formatDateTime = (dateString: string): { date: string; time: string } => {
    try {
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
    } catch (error) {
      console.error('Error formatting date:', error);
      return { date: 'Invalid Date', time: 'Invalid Time' };
    }
  };

  const handleStatusUpdate = async (newStatus: Order['status']) => {
    if (!order || !orderId) return;
    setLoading(true);

    try {
      const payload = { status: newStatus, orderId };

      const res = await api.post("/api/v1/admin/order/update-status", payload);
      const data = res.data;

      if (!data.success) {
        throw new Error(data.message || "Failed to update status");
      }

      // Update local state
      setOrder(prev => (prev ? { ...prev, status: newStatus } : null));

      // Update Zustand store
      const ordersStore = useOrdersStore.getState();
      ordersStore.setOrders(
        ordersStore.orders.map(o =>
          o.orderId === orderId ? { ...o, status: newStatus } : o
        )
      );

      setShowStatusModal(false);
    } catch (error) {
      console.error('Failed to update status:', error);
      const errorMessage = error instanceof Error ? error.message : "Something went wrong. Try again.";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate({ to: '/' });
  };

  // Loading state
  if (!orderId) {
    return (
      <div className="min-h-screen bg-[var(--smoky-black-1)] flex items-center justify-center">
        <div className="text-center text-[var(--white)]">
          <p>Invalid order ID.</p>
        </div>
      </div>
    );
  }

  // Order not found
  if (!order) {
    return (
      <div className="min-h-screen bg-[var(--smoky-black-1)] flex items-center justify-center">
        <div className="text-center text-[var(--white)] p-10">
          <Package size={48} className="mx-auto mb-4 text-[var(--quick-silver)]" />
          <h2 className="text-xl font-semibold mb-2">Order Not Found</h2>
          <p className="text-[var(--quick-silver)] mb-4">
            The order with ID #{orderId} could not be found.
          </p>
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-[var(--gold-crayola)] text-[var(--smoky-black-1)] rounded-lg hover:bg-[var(--gold-crayola)]/90 transition-colors font-medium"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const subtotal = order.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;
  // const taxes = subtotal * 0.08;
  // const deliveryFee = 5.0;

  const { date, time } = formatDateTime(order.createdAt);

  return (
    <div className="min-h-screen bg-[var(--smoky-black-1)]">
      {/* Header */}
      <div className="sticky top-0 bg-[var(--smoky-black-1)]/95 backdrop-blur-sm border-b border-[var(--eerie-black-4)] z-40">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBack}
                className="text-[var(--quick-silver)] hover:text-[var(--white)] transition-colors p-2 rounded-lg hover:bg-[var(--eerie-black-2)]"
                aria-label="Go back"
              >
                <ArrowLeft size={24} />
              </button>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-[var(--white)]">
                  Order #{order.orderId}
                </h1>
                <div className="flex items-center gap-2 text-[var(--quick-silver)] text-sm">
                  <Clock size={12} />
                  <span>{date} • {time}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Order Status */}
        <div className="bg-[var(--eerie-black-2)] border border-[var(--eerie-black-4)] rounded-xl p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[var(--white)]">Order Status</h2>
            <StatusBadge
              status={order.status}
              size="lg"
              onClick={() => setShowStatusModal(true)}
              disabled={loading}
            />
          </div>
        </div>

        {/* Info Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <InfoCard
            icon={<User size={20} />}
            title="Customer Information"
            content={
              <div className="space-y-3">
                <div className="text-[var(--white)] font-medium text-lg">
                  {order.name || 'N/A'}
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={14} className="text-[var(--gold-crayola)]" />
                  <span className="text-[var(--quick-silver)]">{order.phone || 'N/A'}</span>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin size={14} className="text-[var(--gold-crayola)] mt-0.5 flex-shrink-0" />
                  <span className="text-[var(--quick-silver)] flex-1 leading-relaxed">
                    {order.address || 'No address provided'}
                  </span>
                </div>
              </div>
            }
          />

          <InfoCard
            icon={<CreditCard size={20} />}
            title="Payment Information"
            content={
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[var(--quick-silver)]">Method:</span>
                  <span className="text-[var(--white)] capitalize font-medium">
                    {order.paymentMethod || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[var(--quick-silver)]">Status:</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${order.paymentStatus === 'paid'
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                    }`}>
                    {order.paymentStatus || 'pending'}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-[var(--eerie-black-4)]">
                  <span className="text-[var(--quick-silver)]">Total:</span>
                  <span className="text-[var(--gold-crayola)] font-semibold text-lg">
                    ₹{order.total?.toFixed(2) || '0.00'}
                  </span>
                </div>
              </div>
            }
          />
        </div>

        {/* Delivery Location Map */}
        {order.latitude && order.longitude && (
          <MapLocation
            latitude={order.latitude}
            longitude={order.longitude}
            address={order.address}
            customerName={order.name}
          />
        )}


        {/* Special Instructions */}
        {order.notes && (
          <InfoCard
            icon={<Edit3 size={20} />}
            title="Special Instructions"
            content={
              <div className="text-[var(--white)] bg-[var(--eerie-black-3)] p-4 rounded-lg border border-[var(--eerie-black-4)]">
                {order.notes}
              </div>
            }
          />
        )}

        {/* Order Items */}
        <div className="bg-[var(--eerie-black-2)] border border-[var(--eerie-black-4)] rounded-xl overflow-hidden">
          <div className="flex items-center gap-3 p-6 border-b border-[var(--eerie-black-4)]">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--gold-crayola)]/10">
              <ShoppingBag size={20} className="text-[var(--gold-crayola)]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[var(--white)]">Order Items</h2>
              <p className="text-[var(--quick-silver)] text-sm">
                {order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          <div className="p-6">
            {order.items && order.items.length > 0 ? (
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <OrderItemCard key={item.item_id || index} item={item} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-[var(--quick-silver)]">
                <ShoppingBag size={48} className="mx-auto mb-3 opacity-50" />
                <p>No items found in this order</p>
              </div>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-[var(--eerie-black-2)] border border-[var(--eerie-black-4)] rounded-xl overflow-hidden">
          <div className="flex items-center gap-3 p-6 border-b border-[var(--eerie-black-4)]">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--gold-crayola)]/10">
              <IndianRupee size={20} className="text-[var(--gold-crayola)]" />
            </div>
            <h3 className="text-lg font-semibold text-[var(--white)]">Order Summary</h3>
          </div>

          <div className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center text-[var(--quick-silver)]">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              {/* <div className="flex justify-between items-center text-[var(--quick-silver)]">
                <span>Taxes (8%)</span>
                <span>₹{taxes.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-[var(--quick-silver)]">
                <span>Delivery Fee</span>
                <span>₹{deliveryFee.toFixed(2)}</span>
              </div> */}
              <div className="border-t border-[var(--eerie-black-4)] pt-4">
                <div className="flex justify-between items-center text-xl font-bold">
                  <span className="text-[var(--white)]">Total</span>
                  <span className="text-[var(--gold-crayola)]">₹{order.total?.toFixed(2) || '0.00'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Update Modal */}
      {showStatusModal && (
        <StatusUpdateModal
          currentStatus={order.status}
          isOpen={showStatusModal}
          onClose={() => setShowStatusModal(false)}
          onUpdate={handleStatusUpdate}
        />
      )}
    </div>
  );
};

export default AdminOrderDetails;