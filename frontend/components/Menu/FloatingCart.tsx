'use client';

import { useState } from 'react';
import { useCartStore } from '@/store/useCartStore';
import { useRouter } from 'next/navigation';
import { Rubik, Playfair_Display } from 'next/font/google';
import Image from 'next/image';

const rubik = Rubik({ subsets: ['latin'] });
const playfair = Playfair_Display({ subsets: ['latin'] });

export const FloatingCart = () => {
  const { cart, updateQuantity, removeItem } = useCartStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();

  // Don't render if cart is empty
  if (cart.length === 0) return null;

  // Calculate totals manually
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleIncrease = (id: string, currentQuantity: number) => {
    updateQuantity(id, currentQuantity + 1);
  };

  const handleDecrease = (id: string, currentQuantity: number) => {
    if (currentQuantity <= 1) {
      removeItem(id);
    } else {
      updateQuantity(id, currentQuantity - 1);
    }
  };

  const handleGoToCart = () => {
    router.push('/cart');
  };

  return (
    <>
      {/* Backdrop for expanded state on mobile */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-[var(--black-alpha-80)] backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsExpanded(false)}
        />
      )}

      {/* Desktop Floating Cart */}
      <div className="hidden lg:block fixed bottom-6 right-6 z-50 w-80">
        <div className="bg-[var(--eerie-black-1)] border border-[var(--white-alpha-20)] rounded-xl shadow-2xl backdrop-blur-sm">
          
          {/* Desktop Header */}
          <div className="p-4 border-b border-[var(--white-alpha-10)]">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-8 h-8 bg-[var(--gold-crayola)] bg-opacity-20 rounded-full flex items-center justify-center border border-[var(--gold-crayola)] border-opacity-30">
                  <svg className="w-4 h-4 text-[var(--gold-crayola)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m-.4-2L3 3m4 10v6a1 1 0 001 1h8a1 1 0 001-1v-6M7 13l-1-5m5 5v6m4-6v6" />
                  </svg>
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-[var(--gold-crayola)] text-[var(--smoky-black-1)] text-xs font-bold rounded-full flex items-center justify-center">
                  {totalItems > 99 ? '99+' : totalItems}
                </div>
              </div>
              <div>
                <h3 className={`text-base font-medium text-[var(--white)] ${playfair.className}`}>
                  Cart Summary
                </h3>
                <p className="text-xs text-[var(--quick-silver)]">
                  {totalItems} {totalItems === 1 ? 'item' : 'items'}
                </p>
              </div>
            </div>
          </div>

          {/* Desktop Cart Items Preview (max 3 items) */}
          <div className="p-4 space-y-2 max-h-48 overflow-y-auto">
            {cart.slice(0, 3).map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-2 rounded-lg bg-[var(--eerie-black-2)] border border-[var(--white-alpha-10)]">
                
                <div className="relative w-10 h-10 flex-shrink-0">
                  <Image
                    src={item.image || "/assets/images/menu-3.png"}
                    alt={item.name}
                    fill
                    className="object-cover rounded"
                    sizes="40px"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-[var(--white)] truncate">
                    {item.name}
                  </h4>
                  <p className="text-xs text-[var(--gold-crayola)]">
                    ₹{item.price} × {item.quantity}
                  </p>
                </div>

                <div className="text-sm font-medium text-[var(--gold-crayola)]">
                  ₹{item.price * item.quantity}
                </div>
              </div>
            ))}

            {cart.length > 3 && (
              <div className="text-center py-2">
                <p className="text-xs text-[var(--quick-silver)]">
                  +{cart.length - 3} more {cart.length - 3 === 1 ? 'item' : 'items'}
                </p>
              </div>
            )}
          </div>

          {/* Desktop Footer */}
          <div className="p-4 border-t border-[var(--white-alpha-10)] bg-[var(--eerie-black-2)] rounded-b-xl">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[var(--quick-silver)] text-sm">Total</span>
              <span className="text-lg font-semibold text-[var(--gold-crayola)]">
                ₹{totalPrice}
              </span>
            </div>
            
            <button 
              onClick={handleGoToCart}
              className="w-full bg-[var(--gold-crayola)] text-[var(--smoky-black-1)] font-semibold py-2.5 rounded-lg hover:bg-opacity-90 transition-all duration-200 flex items-center justify-center gap-2 text-sm"
            >
              <span>Go to Cart</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Cart */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50">
        
        {/* Mobile Expanded View */}
        {isExpanded && (
          <div className="bg-[var(--eerie-black-1)] border-t border-[var(--white-alpha-10)] h-[75vh] flex flex-col">
            
            {/* Mobile Header */}
            <div className="flex items-center justify-between p-4 border-b border-[var(--white-alpha-10)]">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-8 h-8 bg-[var(--gold-crayola)] bg-opacity-20 rounded-full flex items-center justify-center border border-[var(--gold-crayola)] border-opacity-30">
                    <svg className="w-4 h-4 text-[var(--gold-crayola)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m-.4-2L3 3m4 10v6a1 1 0 001 1h8a1 1 0 001-1v-6M7 13l-1-5m5 5v6m4-6v6" />
                    </svg>
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-[var(--gold-crayola)] text-[var(--smoky-black-1)] text-xs font-bold rounded-full flex items-center justify-center">
                    {totalItems > 99 ? '99+' : totalItems}
                  </div>
                </div>
                <div>
                  <h3 className={`text-lg font-medium text-[var(--white)] ${playfair.className}`}>
                    Cart Summary
                  </h3>
                  <p className="text-xs text-[var(--quick-silver)]">
                    {totalItems} {totalItems === 1 ? 'item' : 'items'}
                  </p>
                </div>
              </div>
              
              <button 
                onClick={() => setIsExpanded(false)}
                className="w-8 h-8 flex items-center justify-center text-[var(--quick-silver)] hover:text-[var(--white)] transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            {/* Mobile Cart Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center gap-3 bg-[var(--eerie-black-2)] rounded-lg p-3 border border-[var(--white-alpha-10)]">
                  
                  <div className="relative w-12 h-12 flex-shrink-0">
                    <Image
                      src={item.image || "/assets/images/menu-3.png"}
                      alt={item.name}
                      fill
                      className="object-cover rounded-md"
                      sizes="48px"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-[var(--white)] truncate">
                      {item.name}
                    </h4>
                    <p className="text-xs text-[var(--gold-crayola)] font-medium">
                      ₹{item.price}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 bg-[var(--eerie-black-3)] rounded-lg border border-[var(--white-alpha-10)]">
                    <button
                      onClick={() => handleDecrease(item.id, item.quantity)}
                      className="w-8 h-8 flex items-center justify-center text-[var(--gold-crayola)] hover:bg-[var(--white-alpha-10)] rounded-l-lg transition-colors"
                    >
                      {item.quantity === 1 ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      ) : (
                        '−'
                      )}
                    </button>
                    
                    <span className="w-8 text-center text-sm text-[var(--white)] font-medium">
                      {item.quantity}
                    </span>
                    
                    <button
                      onClick={() => handleIncrease(item.id, item.quantity)}
                      className="w-8 h-8 flex items-center justify-center text-[var(--gold-crayola)] hover:bg-[var(--white-alpha-10)] rounded-r-lg transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile Footer */}
            <div className="p-4 border-t border-[var(--white-alpha-10)] bg-[var(--eerie-black-2)]">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[var(--quick-silver)] text-sm">Total Amount</span>
                <span className="text-lg font-semibold text-[var(--gold-crayola)]">
                  ₹{totalPrice}
                </span>
              </div>
              
              <button 
                onClick={handleGoToCart}
                className="w-full bg-[var(--gold-crayola)] text-[var(--smoky-black-1)] font-semibold py-3 rounded-lg hover:bg-opacity-90 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <span>Go to Cart</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Mobile Collapsed View */}
        {!isExpanded && (
          <div className="bg-[var(--eerie-black-1)] border-t border-[var(--white-alpha-10)]">
            <button 
              onClick={() => setIsExpanded(true)}
              className="w-full p-4 flex items-center justify-between hover:bg-[var(--white-alpha-10)] transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-[var(--gold-crayola)] bg-opacity-20 rounded-full flex items-center justify-center border border-[var(--gold-crayola)] border-opacity-30">
                    <svg className="w-5 h-5 text-[var(--gold-crayola)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m-.4-2L3 3m4 10v6a1 1 0 001 1h8a1 1 0 001-1v-6M7 13l-1-5m5 5v6m4-6v6" />
                    </svg>
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-[var(--gold-crayola)] text-[var(--smoky-black-1)] text-xs font-bold rounded-full flex items-center justify-center">
                    {totalItems > 99 ? '99+' : totalItems}
                  </div>
                </div>
                
                <div className="text-left">
                  <p className="text-sm font-medium text-[var(--white)]">
                    {totalItems} {totalItems === 1 ? 'item' : 'items'} in cart
                  </p>
                  <p className="text-xs text-[var(--quick-silver)]">
                    Tap to review items
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-lg font-semibold text-[var(--gold-crayola)]">
                    ₹{totalPrice}
                  </p>
                  <p className="text-xs text-[var(--quick-silver)]">
                    Total
                  </p>
                </div>
                
                <svg className="w-5 h-5 text-[var(--gold-crayola)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </div>
            </button>
          </div>
        )}
      </div>
    </>
  );
};