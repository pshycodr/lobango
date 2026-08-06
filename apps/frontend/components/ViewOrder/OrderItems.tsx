import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({ subsets: ["latin"] });

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
}

interface OrderItemsProps {
  items: OrderItem[];
  total: number;
}

export default function OrderItems({ items, total }: OrderItemsProps) {
  const formatPrice = (price: number) => {
    return `₹${price}`;
  };

  return (
    <div className="rounded-xl border border-(--white-alpha-10) bg-(--eerie-black-2) p-6 md:p-8">
      <div className="mb-6 flex items-center justify-between">
        <h2
          className={`${playfair.className} text-xl font-semibold text-(--gold-crayola) md:text-2xl`}
        >
          Your Order
        </h2>
        <div className="rounded-full bg-(--gold-crayola) px-3 py-1 text-sm font-semibold text-(--smoky-black-1)">
          {items.length} item{items.length > 1 ? "s" : ""}
        </div>
      </div>

      <div className="space-y-3">
        {items.map((item, index) => (
          <div
            key={index}
            className="group rounded-lg border border-transparent p-4 transition-all duration-300 hover:border-(--white-alpha-10) hover:bg-(--smoky-black-3)"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="mb-2 flex items-center space-x-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-(--gold-crayola) text-sm font-bold text-(--smoky-black-1)">
                    {item.quantity}
                  </div>
                  <h3 className="text-lg font-semibold text-(--white) transition-colors group-hover:text-(--gold-crayola)">
                    {item.name}
                  </h3>
                </div>
                <div className="ml-11">
                  <p className="text-sm text-(--quick-silver)">
                    {formatPrice(item.price)} × {item.quantity}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-(--gold-crayola)">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-xl bg-linear-to-r from-(--gold-crayola) to-(--gold-crayola) p-0.5">
        <div className="rounded-xl bg-(--eerie-black-2) p-6">
          <div className="flex items-center justify-between">
            <div>
              <span
                className={`${playfair.className} block text-xl font-bold text-(--white)`}
              >
                Total Amount
              </span>
              <span className="text-sm text-(--quick-silver)">
                Including all taxes
              </span>
            </div>
            <div className="text-right">
              <span
                className={`animate-pulse text-2xl font-bold text-(--gold-crayola)`}
              >
                {formatPrice(total)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
