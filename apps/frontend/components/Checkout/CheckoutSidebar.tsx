import DeliveryAddress from "@/components/Checkout/DeliveryAddress";
import PaymentMethod from "@/components/Checkout/PaymentMethod";
import { Address } from "@/types/address";

interface CheckoutSidebarProps {
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
    <div className="lg:col-span-1 space-y-6">
      <DeliveryAddress
        address={selectedAddress}
        onChangeAddress={onChangeAddress}
      />
      <PaymentMethod onChangePayment={onChangePayment} />
    </div>
  );
}
