export interface OrderItem {
  item_id: number;
  name: string;
  quantity: number;
  price: number;
  description?: string;
  image?: string;
}

export interface Order {
  longitude: string;
  latitude: string;
  orderId: string;
  name: string;
  phone: string;
  address: string;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  status: string;
  createdAt: string;
  items: OrderItem[];
  notes?: string;
}
