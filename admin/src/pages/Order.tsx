import {
    ArrowLeft,
    CreditCard,
    DollarSign,
    Edit3,
    MapPin,
    Phone,
    ShoppingBag,
    User
} from 'lucide-react';
import React, { useState } from 'react';
import InfoCard from '../components/Order/InfoCard';
import OrderItemCard from '../components/Order/OrderItemCard';
import StatusBadge from '../components/Order/OrderStatusBadge';
import StatusUpdateModal from '../components/Order/StatusUpdateModal';
import type { Order } from '../types/orders';

// Mock order data
const mockOrder: Order = {
  orderId: "ORD-001",
  name: "John Doe",
  phone: "+1 (555) 123-4567",
  address: "123 Main Street, Apartment 4B, Downtown City, NY 10001",
  total: 67.48,
  paymentMethod: "card",
  paymentStatus: "paid",
  status: "pending",
  createdAt: "2024-08-03T10:30:00Z",
  notes: "Please ring the doorbell twice. Leave at door if no answer.",
  items: [
    {
      item_id: 1,
      name: "Margherita Pizza",
      quantity: 2,
      price: 18.99,
      description: "Fresh mozzarella, tomato sauce, basil, olive oil"
    },
    {
      item_id: 2,
      name: "Caesar Salad",
      quantity: 1,
      price: 12.99,
      description: "Romaine lettuce, parmesan cheese, croutons, caesar dressing"
    },
    {
      item_id: 3,
      name: "Garlic Bread",
      quantity: 2,
      price: 6.99,
      description: "Freshly baked bread with garlic butter and herbs"
    },
    {
      item_id: 4,
      name: "Chocolate Cake",
      quantity: 1,
      price: 8.99,
      description: "Rich chocolate cake with chocolate frosting"
    }
  ]
};

const AdminOrderDetails: React.FC = () => {
  const [order, setOrder] = useState<Order>(mockOrder);
  const [loading, setLoading] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);

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
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setOrder(prev => ({ ...prev, status: newStatus }));
      console.log('Status updated to:', newStatus);
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    // Navigate back to orders list
    console.log('Navigate back to orders list');
  };

  const subtotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const taxes = subtotal * 0.08; // 8% tax
  const deliveryFee = 5.00;
//   const calculatedTotal = subtotal + taxes + deliveryFee;

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
                <h1 className="text-xl md:text-2xl font-bold text-[var(--white)]">Order #{order.orderId}</h1>
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
        {/* Status Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[var(--white)]">Order Status</h2>
            <StatusBadge status={order.status} size="lg" />
          </div>
        </div>

        {/* Customer & Order Info */}
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
                  <span className={`px-2 py-1 rounded text-xs ${
                    order.paymentStatus === 'paid' 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-orange-500/20 text-orange-400'
                  }`}>
                    {order.paymentStatus}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Total:</span>
                  <span className="text-[var(--gold-crayola)] font-semibold">${order.total.toFixed(2)}</span>
                </div>
              </div>
            }
          />
        </div>

        {/* Special Notes */}
        {order.notes && (
          <div className="mb-6">
            <InfoCard
              icon={<Edit3 size={20} />}
              title="Special Instructions"
              content={<div className="text-[var(--white)]">{order.notes}</div>}
            />
          </div>
        )}

        {/* Order Items */}
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

        {/* Order Summary */}
        <div className="bg-[var(--eerie-black-2)] border border-[var(--eerie-black-4)] rounded-lg p-4">
          <div className="flex items-center gap-3 mb-4">
            <DollarSign size={20} className="text-[var(--gold-crayola)]" />
            <h3 className="text-lg font-semibold text-[var(--white)]">Order Summary</h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between text-[var(--quick-silver)]">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[var(--quick-silver)]">
              <span>Taxes (8%)</span>
              <span>${taxes.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[var(--quick-silver)]">
              <span>Delivery Fee</span>
              <span>${deliveryFee.toFixed(2)}</span>
            </div>
            <div className="border-t border-[var(--eerie-black-4)] pt-3">
              <div className="flex justify-between text-lg font-semibold">
                <span className="text-[var(--white)]">Total</span>
                <span className="text-[var(--gold-crayola)]">${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Update Modal */}
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