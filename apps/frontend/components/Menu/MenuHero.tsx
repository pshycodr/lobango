import { usePermissionsStore } from "@/store/usePermissionsStore";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({ subsets: ["latin"] });

export const MenuHero = () => {
  const { newOrders } = usePermissionsStore();

  return (
    <div className="mb-16 text-center px-4">
      <h2
        className={`text-3xl md:text-4xl lg:text-5xl font-light text-[var(--white)] mb-6 ${playfair.className} tracking-wide`}
      >
        Our Menu
      </h2>
      <p className="text-[var(--quick-silver)] text-base lg:text-lg max-w-2xl mx-auto font-light leading-relaxed">
        Carefully crafted dishes that celebrate flavor, tradition, and culinary
        artistry
      </p>
      <div className="flex justify-center items-center gap-4 mt-8">
        <div className="h-px w-12 bg-[var(--gold-crayola)] opacity-40"></div>
        <div className="w-1 h-1 bg-[var(--gold-crayola)] rounded-full opacity-60"></div>
        <div className="h-px w-12 bg-[var(--gold-crayola)] opacity-40"></div>
      </div>
      {newOrders === false ? (
        <div className="flex justify-center items-center w-full">
          <p className="p-4 mt-5 text-center text-red-500 text-xl font-semibold flex justify-center items-center gap-3 tracking-tighter border-2 rounded-md border-red-500 ">
            Online orders are currently closed.
          </p>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};
