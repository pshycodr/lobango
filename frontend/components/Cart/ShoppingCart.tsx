'use client';

import React, { useEffect } from 'react';
import { CartItemCard } from './CartItemCard';
import { CartSummary } from './CartSummary';
import { useCartStore } from '@/store/useCartStore';// adjust path if needed
import { useRouter } from 'next/navigation';
import { usePermissionsStore } from '@/store/usePermissionsStore';

export const ShoppingCart: React.FC = () => {
  const cartItems = useCartStore((state) => state.cart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const router = useRouter()
  const { newOrders, fetchPermissions } = usePermissionsStore();

  useEffect(() => {
    fetchPermissions()
  }, [])

  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity === 0) {
      removeItem(id);
    } else {
      updateQuantity(id, quantity);
    }
  };

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const handleCheckout = () => {
    console.log('Proceeding to checkout with items:', cartItems);

    router.push('/checkout')
    return null
  };

  return (
    <div className="min-h-screen bg-[var(--smoky-black-1)]">
      {/* Header */}
      <div className="bg-[var(--eerie-black-1)] border-b border-[var(--white-alpha-10)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-[var(--gold-crayola)] text-3xl md:text-4xl font-semibold font-playfair mb-2">
              Your Cart
            </h1>
            <p className="text-[var(--quick-silver)] text-sm font-inter">
              {itemCount} {itemCount === 1 ? 'item' : 'items'} ready for checkout
            </p>
          </div>
        </div>
      </div>

      {newOrders === false ? (
        <div className='flex justify-center items-center w-full'>
          <p className="p-4 mt-5 text-center text-red-500 text-xl font-semibold flex justify-center items-center gap-3 tracking-tighter border-2 rounded-md border-red-500 ">Online orders are currently closed.</p>
        </div>) : ""}

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-3">
              {cartItems.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-lg bg-[var(--eerie-black-2)] flex items-center justify-center">
                    <span className="text-2xl">🛒</span>
                  </div>
                  <h3 className="text-[var(--white)] text-lg font-playfair font-semibold mb-1">
                    Your cart is empty
                  </h3>
                  <p className="text-[var(--quick-silver)] text-sm font-inter">
                    Add some delicious items to get started
                  </p>
                </div>
              ) : (
                cartItems.map((item) => (
                  <CartItemCard
                    key={item.id}
                    item={item}
                    onUpdateQuantity={handleUpdateQuantity}
                  />
                ))
              )}
            </div>
          </div>

          {/* Summary */}
          <div className="mt-6 lg:mt-0">
            {cartItems.length > 0 && (
              <CartSummary
                subtotal={subtotal}
                itemCount={itemCount}
                onCheckout={handleCheckout}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
