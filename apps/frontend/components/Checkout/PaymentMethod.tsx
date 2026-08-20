import { CreditCard } from "lucide-react";
import { useState } from "react";

export interface PaymentMethodData {
  type: "online";
  details: string;
}

export interface PaymentMethodProps {
  paymentMethod?: PaymentMethodData;
  onChangePayment: (method: "online") => void;
}

export function PaymentMethod({ onChangePayment }: PaymentMethodProps) {
  const [, setSelectedMethod] = useState<"online">("online");

  const handleMethodChange = (method: "online") => {
    setSelectedMethod(method);
    onChangePayment(method);
  };

  return (
    <div className="mb-4 rounded-xl bg-(--eerie-black-1) p-4">
      <h3 className="mb-3 text-lg font-bold text-(--white)">Payment Method</h3>

      {/* Online Payment Option */}
      <button
        className="flex w-full cursor-pointer items-center gap-3 rounded-lg border border-(--gold-crayola) bg-(--eerie-black-2) p-3 text-left transition-colors duration-200"
        onClick={() => handleMethodChange("online")}
        aria-label="Select online payment"
      >
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-(--gold-crayola) text-(--smoky-black-1)">
          <CreditCard size={18} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-(--white)">Online Payment</p>
          <p className="text-xs text-(--quick-silver)">
            Credit/Debit card, UPI, etc.
          </p>
        </div>

        <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-(--gold-crayola) bg-(--gold-crayola)">
          <div className="h-2 w-2 rounded-full bg-(--smoky-black-1)"></div>
        </div>
      </button>
    </div>
  );
}
