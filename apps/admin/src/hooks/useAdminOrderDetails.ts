import { admin, client } from "@/lib/orpc";
import { useOrdersStore } from "@/store/zustand/useOrdersStore";
import type { OrderStatus } from "@lobango/contracts/enums";
import type { Order, OrderItem } from "@lobango/contracts/order";
import { useCallback, useEffect, useState } from "react";

export interface UseAdminOrderDetailsProps {
  orderId?: string;
}

export interface UseAdminOrderDetailsReturn {
  order: Order | null;
  items: OrderItem[];
  isLoading: boolean;
  isUpdating: boolean;
  error: string | null;
  updateStatus: (status: OrderStatus) => Promise<boolean>;
  refetch: () => Promise<void>;
}

export function useAdminOrderDetails({
  orderId,
}: UseAdminOrderDetailsProps): UseAdminOrderDetailsReturn {
  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [isLoading, setIsLoading] = useState(Boolean(orderId));
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrderDetails = useCallback(async () => {
    if (!orderId) {
      setOrder(null);
      setItems([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await client.order.getOrderById({ orderId });
      setOrder(res.order);
      setItems(res.items);
    } catch (err) {
      console.error("Error fetching order details via oRPC:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load order details"
      );
    } finally {
      setIsLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchOrderDetails();
  }, [fetchOrderDetails]);

  const updateStatus = useCallback(
    async (newStatus: OrderStatus): Promise<boolean> => {
      if (!orderId) return false;

      setIsUpdating(true);
      setError(null);

      try {
        const res = await admin.order.updateOrderStatus({
          orderId,
          status: newStatus,
        });

        if (res.success) {
          setOrder((prev) => (prev ? { ...prev, status: newStatus } : null));

          // Also update Zustand store
          const currentOrders = useOrdersStore.getState().orders;
          useOrdersStore
            .getState()
            .setOrders(
              currentOrders.map((o) =>
                o.orderId === orderId ? { ...o, status: newStatus } : o
              )
            );
          return true;
        }
        return false;
      } catch (err) {
        console.error("Error updating order status via oRPC:", err);
        setError(
          err instanceof Error ? err.message : "Failed to update status"
        );
        return false;
      } finally {
        setIsUpdating(false);
      }
    },
    [orderId]
  );

  return {
    order,
    items,
    isLoading,
    isUpdating,
    error,
    updateStatus,
    refetch: fetchOrderDetails,
  };
}
