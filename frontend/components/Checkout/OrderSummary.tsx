import Image from 'next/image';
import { Plus, Minus, X } from 'lucide-react';

interface OrderItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  price: number;
  image: string;
}

interface OrderSummaryProps {
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
}

export default function OrderSummary({ 
  items, 
  subtotal, 
  deliveryFee, 
  total,
  onUpdateQuantity,
  onRemoveItem
}: OrderSummaryProps) {
  const formatPrice = (price: number) => `₹${price.toFixed(2)}`;

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      onRemoveItem(id);
    } else {
      onUpdateQuantity(id, newQuantity);
    }
  };

  return (
    <div className="bg-[var(--eerie-black-1)] rounded-lg p-4 mb-4">
      <h3 className="text-[var(--white)] text-lg font-bold mb-4">
        Order Summary
      </h3>
      
      {/* Order Items - Scrollable on mobile */}
      <div className="max-h-[50vh] overflow-y-auto mb-4 space-y-3 -mx-2 px-2">
        {items.map((item) => (
          <div 
            key={item.id}
            className="flex items-start gap-3 bg-[var(--eerie-black-2)] rounded-lg p-3 relative"
          >
            {/* Remove button (mobile-friendly) */}
            <button
              onClick={() => onRemoveItem(item.id)}
              className="cursor-pointer absolute top-1 right-1 p-1 text-[var(--quick-silver)] hover:text-[var(--gold-crayola)]"
              aria-label="Remove item"
            >
              <X size={16} />
            </button>
            
            {/* Item image */}
            <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 56px, 64px"
              />
            </div>
            
            {/* Item details - Fixed width container */}
            <div className="flex-1 min-w-0 pr-4"> {/* Added pr-4 for padding right */}
              <div className="flex justify-between items-start gap-2">
                <h4 className="text-[var(--white)] text-sm font-semibold flex-1 line-clamp-1 break-words">
                  {item.name}
                </h4>
                <p className="text-[var(--gold-crayola)] text-sm font-bold shrink-0">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>
              
              <p className="text-[var(--quick-silver)] text-xs line-clamp-2 mt-1 mb-2">
                {item.description}
              </p>
              
              {/* Quantity controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                  className="w-7 h-7 cursor-pointer rounded-md border border-[var(--gold-crayola)] text-[var(--gold-crayola)] flex items-center justify-center active:bg-[var(--gold-crayola)] active:text-[var(--smoky-black-1)] transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus size={12} />
                </button>
                
                <span className="text-[var(--white)] text-sm font-medium min-w-[1.5rem] text-center">
                  {item.quantity}
                </span>
                
                <button
                  onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                  className="w-7 h-7 cursor-pointer rounded-md border border-[var(--gold-crayola)] text-[var(--gold-crayola)] flex items-center justify-center active:bg-[var(--gold-crayola)] active:text-[var(--smoky-black-1)] transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus size={12} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Order Totals */}
      <div className="border-t border-[var(--eerie-black-3)] pt-4 space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-[var(--quick-silver)] text-sm">
            Subtotal
          </p>
          <p className="text-[var(--white)] text-sm">
            {formatPrice(subtotal)}
          </p>
        </div>
        
        <div className="flex items-center justify-between">
          <p className="text-[var(--quick-silver)] text-sm">
            Delivery Fee
          </p>
          <p className="text-[var(--white)] text-sm">
            {formatPrice(deliveryFee)}
          </p>
        </div>
                
        <div className="flex items-center justify-between pt-3 border-t border-[var(--eerie-black-3)]">
          <p className="text-[var(--white)] text-base font-bold">
            Total
          </p>
          <p className="text-[var(--gold-crayola)] text-base font-bold">
            {formatPrice(total)}
          </p>
        </div>
      </div>
    </div>
  );
}