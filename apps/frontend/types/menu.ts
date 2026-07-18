export type MenuItem = {
  id: string;
  name: string;
  price: number;
  category?: string;
  description?: string;
  isVeg: boolean;
  image: string;
};

export type Category = {
  category: string;
  items: MenuItem[];
};
