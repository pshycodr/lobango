import { MapPin, ChevronRight } from "lucide-react";

interface Address {
  id: string;
  label: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  type: "home" | "work" | "other";
}

interface DeliveryAddressProps {
  address?: Address;
  onChangeAddress?: () => void;
}

export default function DeliveryAddress({
  address,
  onChangeAddress,
}: DeliveryAddressProps) {
  const formatFullAddress = (addr: Address) => {
    return `${addr.address}, ${addr.city}, ${addr.state} ${addr.zipCode}`;
  };

  return (
    <div className="mb-4 rounded-xl bg-(--eerie-black-1) p-4">
      <h3 className="mb-3 text-lg font-bold text-(--white)">
        Delivery Address
      </h3>

      <button
        className="flex w-full items-center gap-3 rounded-lg bg-(--eerie-black-2) p-3 text-left transition-colors duration-200 active:bg-(--eerie-black-3)"
        onClick={onChangeAddress}
        aria-label={
          address ? "Change delivery address" : "Add delivery address"
        }
      >
        {/* Icon with better touch target */}
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-(--gold-crayola) bg-(--smoky-black-1) text-(--gold-crayola) active:bg-(--smoky-black-2)">
          <MapPin size={18} />
        </div>

        {/* Address content with better mobile spacing */}
        <div className="min-w-0 flex-1">
          {address ? (
            <>
              <p className="mb-1 line-clamp-1 text-sm font-semibold text-(--white)">
                {address.label}
              </p>
              <p className="line-clamp-2 text-xs text-(--quick-silver)">
                {formatFullAddress(address)}
              </p>
            </>
          ) : (
            <>
              <p className="mb-1 text-sm font-semibold text-(--white)">
                Add Delivery Address
              </p>
              <p className="text-xs text-(--quick-silver)">
                Tap to add your delivery address
              </p>
            </>
          )}
        </div>

        {/* Chevron indicator */}
        <ChevronRight
          size={16}
          className="shrink-0 text-(--quick-silver) active:text-(--gold-crayola)"
        />
      </button>
    </div>
  );
}
