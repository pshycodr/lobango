'use client';

import { useCartStore } from '@/store/useCartStore';
import { useRouter } from 'next/navigation';
import { ShoppingCart } from 'lucide-react';

export const FloatingCart = () => {
    const { cart } = useCartStore();
    const router = useRouter();

    if (cart.length === 0) return null;

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const handleGoToCart = () => {
        router.push('/cart');
    };

    return (
        <>

            <div
                className={`
            fixed z-50 animate-in duration-500 transition-all
            flex items-center justify-between
            bottom-0 left-0 right-0
            lg:bottom-6 lg:left-auto lg:right-6 lg:w-auto lg:rounded-xl
            slide-in-from-bottom-4 lg:slide-in-from-bottom-8 lg:slide-in-from-right-8
          `}
            >
                <button
                    onClick={handleGoToCart}
                    className={`
              w-full lg:w-auto
              rounded-lg
              flex items-center justify-between lg:justify-start
              gap-3 lg:gap-4
              p-4 border shadow-2xl backdrop-blur-sm
              border-[var(--white-alpha-20)]
              bg-[var(--eerie-black-1)]
              hover:bg-[var(--white-alpha-10)]
              hover:scale-105 hover:shadow-3xl
              transition-all duration-300 group
            `}
                >
                    {/* Cart Icon with Badge */}
                    <div className="relative animate-pulse">
                        <div className="w-10 h-10 bg-[var(--gold-crayola)] bg-opacity-20 rounded-full flex items-center justify-center border border-[var(--gold-crayola)] border-opacity-30 group-hover:bg-opacity-30 group-hover:scale-110 transition-all duration-300">
                            <ShoppingCart className="w-5 h-5 transition-transform duration-300" strokeWidth={2} />
                        </div>
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-[var(--gold-crayola)] text-[var(--smoky-black-1)] text-xs font-bold rounded-full flex items-center justify-center animate-bounce group-hover:animate-pulse">
                            {totalItems > 99 ? '99+' : totalItems}
                        </div>
                        <div className="absolute inset-0 w-10 h-10 rounded-full border-2 border-[var(--gold-crayola)] opacity-20 animate-ping"></div>
                    </div>

                    {/* Text */}
                    <div className="text-left group-hover:translate-x-1 transition-transform duration-300">
                        <p className="text-sm font-medium text-[var(--white)] group-hover:text-[var(--gold-crayola)] transition-colors duration-300">
                            {totalItems} {totalItems === 1 ? 'item' : 'items'} in cart
                        </p>
                        <p className="text-xs text-[var(--quick-silver)] group-hover:text-[var(--white)] transition-colors duration-300">
                            {totalItems === 1 ? 'Tap to review item' : 'Tap to review items'}
                        </p>
                    </div>

                    {/* Price */}
                    <div className="text-right ml-auto lg:ml-4 group-hover:translate-x-1 transition-transform duration-300">
                        <p className="text-lg font-semibold text-[var(--gold-crayola)] group-hover:scale-110 transition-transform duration-300">
                            ₹{totalPrice}
                        </p>
                        <p className="text-xs text-[var(--quick-silver)] group-hover:text-[var(--white)] transition-colors duration-300">
                            Total
                        </p>
                    </div>

                    {/* Arrow */}
                    <div className="ml-2 group-hover:translate-x-2 transition-transform duration-300 animate-bounce-x">
                        <svg
                            className="w-5 h-5 text-[var(--gold-crayola)] opacity-70 group-hover:opacity-100"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                </button>
            </div>
        </>
    );
};