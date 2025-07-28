import React from 'react';
import Image from 'next/image';
import { CartItem } from '@/types/cart';

interface CartItemCardProps {
  item: CartItem;
  onUpdateQuantity: (id: string, quantity: number) => void;
}

export const CartItemCard: React.FC<CartItemCardProps> = ({ item, onUpdateQuantity }) => {
  const handleQuantityChange = (change: number) => {
    const newQuantity = Math.max(0, item.quantity + change);
    onUpdateQuantity(item.id, newQuantity);
  };

  return (
    <div className="group bg-[var(--eerie-black-2)] hover:bg-[var(--eerie-black-3)] transition-all duration-200 rounded-lg p-3 border border-[var(--white-alpha-10)] hover:border-[var(--gold-crayola)] hover:border-opacity-20">
      <div className="flex items-center gap-3">
        {/* Image */}
        <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-[var(--eerie-black-4)]">
          <Image
            src={item.image}
            alt={item.name}
            width={48}
            height={48}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-[var(--white)] text-sm font-medium font-playfair leading-tight mb-1">
            {item.name}
          </h3>
          <p className="text-[var(--quick-silver)] text-xs font-inter leading-tight">
            {item.description}
          </p>
        </div>
        
        {/* Price and Controls */}
        <div className="flex items-center gap-3">
          <span className="text-[var(--gold-crayola)] text-lg font-semibold font-playfair">
            ₹{item.price.toFixed(0)}
          </span>
          
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleQuantityChange(-1)}
              className="w-6 h-6 rounded border border-[var(--gold-crayola)] text-[var(--gold-crayola)] flex items-center justify-center hover:bg-[var(--gold-crayola)] hover:text-[var(--smoky-black-1)] transition-all duration-150 text-sm active:scale-95"
            >
              −
            </button>
            
            <span className="text-[var(--white)] w-6 text-center font-inter text-sm font-medium">
              {item.quantity}
            </span>
            
            <button
              onClick={() => handleQuantityChange(1)}
              className="w-6 h-6 rounded border border-[var(--gold-crayola)] text-[var(--gold-crayola)] flex items-center justify-center hover:bg-[var(--gold-crayola)] hover:text-[var(--smoky-black-1)] transition-all duration-150 text-sm active:scale-95"
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};