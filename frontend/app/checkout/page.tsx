'use client';


import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CheckoutHeader from '@/components/Checkout/CheckoutHeader';
import DeliveryAddress from '@/components/Checkout/DeliveryAddress';
import PaymentMethod from '@/components/Checkout/PaymentMethod';
import OrderSummary from '@/components/Checkout/OrderSummary';
import PlaceOrderButton from '@/components/Checkout/PlaceOrderButton';
import { useCartStore } from '@/store/useCartStore';
import AddressModal from '@/components/AddressModal/AddressModal';

interface Address {
  id: string;
  label: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  type: 'home' | 'work' | 'other';
}

const samplePaymentMethod = {
  type: 'Credit Card',
  details: 'Ending in 4242'
};

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, updateQuantity, removeItem, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | undefined>(undefined);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  // Handle client-side hydration
  useEffect(() => {
    setIsClient(true);
    
    // Load last selected address from localStorage
    if (typeof window !== 'undefined') {
      const savedAddress = localStorage.getItem('selected-address');
      if (savedAddress) {
        setSelectedAddress(JSON.parse(savedAddress));
      }
    }
  }, []);

  // Calculate totals from cart
  const { subtotal, deliveryFee, tax, total } = useMemo(() => {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = subtotal > 50 ? 0 : 2.99; // Free delivery over $50
    const taxRate = 0.08; // 8% tax
    const tax = subtotal * taxRate;
    const total = subtotal + deliveryFee + tax;

    return {
      subtotal,
      deliveryFee,
      tax,
      total
    };
  }, [cart]);

  const handleBack = () => {
    router.back();
  };

  const handleChangeAddress = () => {
    setIsAddressModalOpen(true);
  };

  const handleSelectAddress = (address: Address) => {
    setSelectedAddress(address);
    // Save selected address to localStorage
    localStorage.setItem('selected-address', JSON.stringify(address));
  };

  const handleChangePayment = () => {
    // router.push('/payment');
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    updateQuantity(id, quantity);
  };

  const handleRemoveItem = (id: string) => {
    removeItem(id);
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      alert('Please select a delivery address');
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clear cart after successful order
      clearCart();
      
      // Navigate to order confirmation
      router.push('/order-confirmation');
    } catch (error) {
      console.error('Error placing order:', error);
      // Handle error (show toast, etc.)
    } finally {
      setLoading(false);
    }
  };

  // Show loading state during hydration
  if (!isClient) {
    return (
      <div className="min-h-screen bg-[var(--smoky-black-1)] flex items-center justify-center">
        <div className="text-[var(--white)]">Loading...</div>
      </div>
    );
  }

  // Redirect to cart if empty (only after client-side hydration)
  if (cart.length === 0) {
    router.push('/cart');
    return null;
  }

  return (
    <div 
      className="min-h-screen bg-[var(--smoky-black-1)]"
      style={{ 
        fontFamily: 'var(--font-work-sans), var(--font-noto-sans), sans-serif',
        // CSS Variables for colors
        '--gold-crayola': 'hsl(38, 61%, 73%)',
        '--quick-silver': 'hsla(0, 0%, 65%, 1)',
        '--davys-grey': 'hsla(30, 3%, 34%, 1)',
        '--smoky-black-1': 'hsla(40, 12%, 5%, 1)',
        '--smoky-black-2': 'hsla(30, 8%, 5%, 1)',
        '--smoky-black-3': 'hsla(0, 3%, 7%, 1)',
        '--eerie-black-1': 'hsla(210, 4%, 9%, 1)',
        '--eerie-black-2': 'hsla(210, 4%, 11%, 1)',
        '--eerie-black-3': 'hsla(180, 2%, 8%, 1)',
        '--eerie-black-4': 'hsla(0, 0%, 13%, 1)',
        '--white': 'hsla(0, 0%, 100%, 1)',
        '--white-alpha-20': 'hsla(0, 0%, 100%, 0.2)',
        '--white-alpha-10': 'hsla(0, 0%, 100%, 0.1)',
        '--black': 'hsla(0, 0%, 0%, 1)',
        '--black-alpha-80': 'hsla(0, 0%, 0%, 0.8)',
        '--black-alpha-15': 'hsla(0, 0%, 0%, 0.15)'
      } as React.CSSProperties}
    >
      <CheckoutHeader onBack={handleBack} />
      
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Address & Payment */}
          <div className="lg:col-span-1 space-y-6">
            <DeliveryAddress 
              address={selectedAddress}
              onChangeAddress={handleChangeAddress}
            />
            
            <PaymentMethod 
            //   paymentMethod={samplePaymentMethod}
              onChangePayment={handleChangePayment}
            />
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-2">
            <OrderSummary 
              items={cart}
              subtotal={subtotal}
              deliveryFee={deliveryFee}
              tax={tax}
              total={total}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
            />
            
            <PlaceOrderButton 
              onPlaceOrder={handlePlaceOrder}
              loading={loading}
              total={total}
              disabled={!selectedAddress}
            />
          </div>
        </div>
      </div>

      {/* Address Modal */}
      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        onSelectAddress={handleSelectAddress}
        currentAddress={selectedAddress}
      />
    </div>
  );
}