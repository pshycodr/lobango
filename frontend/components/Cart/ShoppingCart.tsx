'use client';

import React, { useState } from 'react';
import { CartItem } from '@/types/cart';
import { CartItemCard } from './CartItemCard';
import { CartSummary } from './CartSummary';

const initialCartItems: CartItem[] = [
  {
    id: '1',
    name: 'Tandoori Chicken (1pc)',
    description: 'Tender chicken with aromatic spices',
    price: 130,
    quantity: 1,
    image: '/api/placeholder/48/48'
  },
  {
    id: '2',
    name: 'Tandoori Kebab (1pc)',
    description: 'Fresh ingredients, traditional methods',
    price: 90,
    quantity: 1,
    image: '/api/placeholder/48/48'
  },
  {
    id: '3',
    name: 'Chicken Tengri Kebab (1pc)',
    description: 'Expertly prepared with spices',
    price: 90,
    quantity: 1,
    image: '/api/placeholder/48/48'
  },
  {
    id: '4',
    name: 'Chicken Pahari Kebab (6pcs)',
    description: 'Traditional mountain-style kebabs',
    price: 240,
    quantity: 1,
    image: '/api/placeholder/48/48'
  }
];

export const ShoppingCart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity === 0) {
      setCartItems(items => items.filter(item => item.id !== id));
    } else {
      setCartItems(items =>
        items.map(item =>
          item.id === id ? { ...item, quantity } : item
        )
      );
    }
  };

  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const handleCheckout = () => {
    console.log('Proceeding to checkout with items:', cartItems);
    // Implement checkout logic here
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
                cartItems.map(item => (
                  <CartItemCard
                    key={item.id}
                    item={item}
                    onUpdateQuantity={updateQuantity}
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