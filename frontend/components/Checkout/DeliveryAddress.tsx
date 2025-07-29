import { MapPin, ChevronRight } from 'lucide-react';

interface Address {
  id: string;
  label: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  type: 'home' | 'work' | 'other';
}

interface DeliveryAddressProps {
  address?: Address;
  onChangeAddress?: () => void;
}

export default function DeliveryAddress({ address, onChangeAddress }: DeliveryAddressProps) {
  const formatFullAddress = (addr: Address) => {
    return `${addr.address}, ${addr.city}, ${addr.state} ${addr.zipCode}`;
  };

  return (
    <div className="bg-[var(--eerie-black-1)] rounded-xl p-4 mb-4">
      <h3 className="text-[var(--white)] text-lg font-bold mb-3">
        Delivery Address
      </h3>
      
      <button 
        className="flex items-center gap-3 w-full bg-[var(--eerie-black-2)] rounded-lg p-3 active:bg-[var(--eerie-black-3)] transition-colors duration-200 text-left"
        onClick={onChangeAddress}
        aria-label={address ? 'Change delivery address' : 'Add delivery address'}
      >
        {/* Icon with better touch target */}
        <div className="text-[var(--gold-crayola)] flex items-center justify-center rounded-lg bg-[var(--smoky-black-1)] shrink-0 size-10 active:bg-[var(--smoky-black-2)]">
          <MapPin size={18} />
        </div>
        
        {/* Address content with better mobile spacing */}
        <div className="flex-1 min-w-0">
          {address ? (
            <>
              <p className="text-[var(--white)] text-sm font-semibold line-clamp-1 mb-1">
                {address.label}
              </p>
              <p className="text-[var(--quick-silver)] text-xs line-clamp-2">
                {formatFullAddress(address)}
              </p>
            </>
          ) : (
            <>
              <p className="text-[var(--white)] text-sm font-semibold mb-1">
                Add Delivery Address
              </p>
              <p className="text-[var(--quick-silver)] text-xs">
                Tap to add your delivery address
              </p>
            </>
          )}
        </div>
        
        {/* Chevron indicator */}
        <ChevronRight 
          size={16} 
          className="text-[var(--quick-silver)] active:text-[var(--gold-crayola)] shrink-0" 
        />
      </button>
    </div>
  );
}