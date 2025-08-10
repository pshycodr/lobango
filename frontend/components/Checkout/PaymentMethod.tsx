import { CreditCard } from 'lucide-react';
import { useState } from 'react';

interface PaymentMethodData {
  type: 'online';
  details: string;
}

interface PaymentMethodProps {
  paymentMethod?: PaymentMethodData;
  onChangePayment: (method: 'online') => void;
}

export default function PaymentMethod({ 
  paymentMethod, 
  onChangePayment 
}: PaymentMethodProps) {
  const [selectedMethod, setSelectedMethod] = useState<'online'>('online');

  const handleMethodChange = (method: 'online') => {
    setSelectedMethod(method);
    onChangePayment(method);
  };

  return (
    <div className="bg-[var(--eerie-black-1)] rounded-xl p-4 mb-4">
      <h3 className="text-[var(--white)] text-lg font-bold mb-3">
        Payment Method
      </h3>
      
      {/* Online Payment Option */}
      <button
        className="cursor-pointer flex items-center gap-3 w-full bg-[var(--eerie-black-2)] rounded-lg p-3 transition-colors duration-200 text-left border border-[var(--gold-crayola)]"
        onClick={() => handleMethodChange('online')}
        aria-label="Select online payment"
      >
        <div className="flex items-center justify-center rounded-lg shrink-0 size-10 bg-[var(--gold-crayola)] text-[var(--smoky-black-1)]">
          <CreditCard size={18} />
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="text-[var(--white)] text-sm font-semibold">Online Payment</p>
          <p className="text-[var(--quick-silver)] text-xs">Credit/Debit card, UPI, etc.</p>
        </div>
        
        <div className="w-5 h-5 rounded-full border-2 border-[var(--gold-crayola)] bg-[var(--gold-crayola)] flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-[var(--smoky-black-1)]"></div>
        </div>
      </button>
    </div>
  );
}