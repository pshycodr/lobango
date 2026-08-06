import { usePermissionsStore } from "@/store/usePermissionsStore";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({ subsets: ["latin"] });

export const MenuHero = () => {
  const { newOrders } = usePermissionsStore();

  return (
    <div className="mb-16 px-4 text-center">
      <h2
        className={`mb-6 text-3xl font-light text-(--white) md:text-4xl lg:text-5xl ${playfair.className} tracking-wide`}
      >
        Our Menu
      </h2>
      <p className="mx-auto max-w-2xl text-base leading-relaxed font-light text-(--quick-silver) lg:text-lg">
        Carefully crafted dishes that celebrate flavor, tradition, and culinary
        artistry
      </p>
      <div className="mt-8 flex items-center justify-center gap-4">
        <div className="h-px w-12 bg-(--gold-crayola) opacity-40"></div>
        <div className="h-1 w-1 rounded-full bg-(--gold-crayola) opacity-60"></div>
        <div className="h-px w-12 bg-(--gold-crayola) opacity-40"></div>
      </div>
      {newOrders === false ? (
        <div className="flex w-full items-center justify-center">
          <p className="mt-5 flex items-center justify-center gap-3 rounded-md border-2 border-red-500 p-4 text-center text-xl font-semibold tracking-tighter text-red-500">
            Online orders are currently closed.
          </p>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};
