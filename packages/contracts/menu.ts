export type MenuItem = {
  id: string;
  name: string;
  price: number;
  category?: string;
  description?: string;
  isVeg: boolean;
  image: string;
  badge?: "Seasonal" | "New";
};

export type Category = {
  category: string;
  items: MenuItem[];
};
