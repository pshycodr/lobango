import { DeliveryAddress } from "@/components/Checkout/DeliveryAddress";
import { PaymentMethod } from "@/components/Checkout/PaymentMethod";
import type { Address } from "@lobango/contracts/address";

export interface CheckoutSidebarProps {
  selectedAddress: Address | undefined;
  onChangeAddress: () => void;
  onChangePayment: () => void;
}

export function CheckoutSidebar({
  selectedAddress,
  onChangeAddress,
  onChangePayment,
}: CheckoutSidebarProps) {
  return (
    <div className="space-y-6 lg:col-span-1">
      <DeliveryAddress
        address={selectedAddress}
        onChangeAddress={onChangeAddress}
      />
      <PaymentMethod onChangePayment={onChangePayment} />
    </div>
  );
}
