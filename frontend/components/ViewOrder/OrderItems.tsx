import { Playfair_Display } from 'next/font/google';

const playfair = Playfair_Display({ subsets: ['latin'] });

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
    <div className="bg-[var(--eerie-black-2)] rounded-xl p-6 md:p-8 border border-[var(--white-alpha-10)]">
      <div className="flex items-center justify-between mb-6">
        <h2 className={`${playfair.className} text-xl md:text-2xl font-semibold text-[var(--gold-crayola)]`}>
          Your Order
        </h2>
        <div className="bg-[var(--gold-crayola)] text-[var(--smoky-black-1)] px-3 py-1 rounded-full text-sm font-semibold">
          {items.length} item{items.length > 1 ? 's' : ''}
        </div>
      </div>

      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="group hover:bg-[var(--smoky-black-3)] transition-all duration-300 rounded-lg p-4 border border-transparent hover:border-[var(--white-alpha-10)]">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="bg-[var(--gold-crayola)] text-[var(--smoky-black-1)] w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                    {item.quantity}
                  </div>
                  <h3 className="text-[var(--white)] font-semibold text-lg group-hover:text-[var(--gold-crayola)] transition-colors">
                    {item.name}
                  </h3>
                </div>
                <div className="ml-11">
                  <p className="text-[var(--quick-silver)] text-sm">
                    {formatPrice(item.price)} × {item.quantity}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[var(--gold-crayola)] font-bold text-lg">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-gradient-to-r from-[var(--gold-crayola)] to-[var(--gold-crayola)] p-0.5 rounded-xl">
        <div className="bg-[var(--eerie-black-2)] rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <span className={`${playfair.className} text-xl font-bold text-[var(--white)] block`}>
                Total Amount
              </span>
              <span className="text-[var(--quick-silver)] text-sm">Including all taxes</span>
            </div>
            <div className="text-right">
              <span className={`text-2xl font-bold text-[var(--gold-crayola)] animate-pulse`}>
                {formatPrice(total)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
