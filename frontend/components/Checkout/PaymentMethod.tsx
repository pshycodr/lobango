import { CreditCard, Wallet, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface PaymentMethodData {
  type: 'online' | 'cash';
  details: string;
}

interface PaymentMethodProps {
  paymentMethod?: PaymentMethodData;
  onChangePayment: (method: 'online' | 'cash') => void;
}

export default function PaymentMethod({ 
  paymentMethod, 
  onChangePayment 
}: PaymentMethodProps) {
  const [selectedMethod, setSelectedMethod] = useState<'online' | 'cash'>(
    paymentMethod?.type || 'online'
  );

  const handleMethodChange = (method: 'online' | 'cash') => {
    setSelectedMethod(method);
    onChangePayment(method);
  };

  return (
    <div className="bg-[var(--eerie-black-1)] rounded-xl p-4 mb-4">
      <h3 className="text-[var(--white)] text-lg font-bold mb-3">
        Payment Method
      </h3>
      
      {/* Radio Options Container */}
      <div className="space-y-2">
        {/* Online Payment Option */}
        <button
          className={`flex items-center gap-3 w-full bg-[var(--eerie-black-2)] rounded-lg p-3 transition-colors duration-200 text-left border ${
            selectedMethod === 'online' 
              ? 'border-[var(--gold-crayola)]' 
              : 'border-transparent'
          }`}
          onClick={() => handleMethodChange('online')}
          aria-label="Select online payment"
        >
          <div className={`flex items-center justify-center rounded-lg shrink-0 size-10 ${
            selectedMethod === 'online' 
              ? 'bg-[var(--gold-crayola)] text-[var(--smoky-black-1)]' 
              : 'bg-[var(--smoky-black-1)] text-[var(--gold-crayola)]'
          }`}>
            <CreditCard size={18} />
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="text-[var(--white)] text-sm font-semibold">Online Payment</p>
            <p className="text-[var(--quick-silver)] text-xs">Credit/Debit card, UPI, etc.</p>
          </div>
          
          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
            selectedMethod === 'online' 
              ? 'border-[var(--gold-crayola)] bg-[var(--gold-crayola)]' 
              : 'border-[var(--quick-silver)]'
          }`}>
            {selectedMethod === 'online' && (
              <div className="w-2 h-2 rounded-full bg-[var(--smoky-black-1)]"></div>
            )}
          </div>
        </button>
        
        {/* Pay on Delivery Option */}
        <button
          className={`flex items-center gap-3 w-full bg-[var(--eerie-black-2)] rounded-lg p-3 transition-colors duration-200 text-left border ${
            selectedMethod === 'cash' 
              ? 'border-[var(--gold-crayola)]' 
              : 'border-transparent'
          }`}
          onClick={() => handleMethodChange('cash')}
          aria-label="Select pay on delivery"
        >
          <div className={`flex items-center justify-center rounded-lg shrink-0 size-10 ${
            selectedMethod === 'cash' 
              ? 'bg-[var(--gold-crayola)] text-[var(--smoky-black-1)]' 
              : 'bg-[var(--smoky-black-1)] text-[var(--gold-crayola)]'
          }`}>
            <Wallet size={18} />
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="text-[var(--white)] text-sm font-semibold">Pay on Delivery</p>
            <p className="text-[var(--quick-silver)] text-xs">Cash or card when you receive</p>
          </div>
          
          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
            selectedMethod === 'cash' 
              ? 'border-[var(--gold-crayola)] bg-[var(--gold-crayola)]' 
              : 'border-[var(--quick-silver)]'
          }`}>
            {selectedMethod === 'cash' && (
              <div className="w-2 h-2 rounded-full bg-[var(--smoky-black-1)]"></div>
            )}
          </div>
        </button>
      </div>
    </div>
  );
}