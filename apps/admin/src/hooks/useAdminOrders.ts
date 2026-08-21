import { admin } from "@/lib/orpc";
import { useOrdersStore } from "@/store/zustand/useOrdersStore";
import type { OrderStatus } from "@lobango/contracts/enums";
import type { GetAllOrder } from "@lobango/contracts/order";
import { useCallback, useEffect, useMemo, useState } from "react";

export interface UseAdminOrdersReturn {
  orders: GetAllOrder[];
  filteredOrders: GetAllOrder[];
  activeFilter: "all" | OrderStatus;
  searchQuery: string;
  selectedDate: string | null;
  showAllOrders: boolean;
  isLoading: boolean;
  error: string | null;
  setActiveFilter: (filter: "all" | OrderStatus) => void;
  handleSearchChange: (query: string) => void;
  clearSearch: () => void;
  handleDateSelect: (date: string | null) => void;
  handleShowAllOrders: () => void;
  getOrderCountByStatus: (status: "all" | OrderStatus) => number;
  refetch: () => Promise<void>;
  getTodayDate: () => string;
}

export function useAdminOrders(): UseAdminOrdersReturn {
  const getTodayDate = useCallback(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }, []);

  const [activeFilter, setActiveFilter] = useState<"all" | OrderStatus>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState<string | null>(
    getTodayDate()
  );
  const [showAllOrders, setShowAllOrders] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const orders = useOrdersStore((state) => state.orders);
  const setOrders = useOrdersStore((state) => state.setOrders);

  const fetchOrders = useCallback(
    async (isBackground = false) => {
      try {
        if (!isBackground) {
          setIsLoading(true);
        }
        setError(null);

        const params =
          !showAllOrders && selectedDate ? { date: selectedDate } : {};

        const res = await admin.order.getAllOrders(params);
        setOrders(res.orders);
      } catch (err) {
        console.error("Error fetching orders via oRPC:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch orders");
      } finally {
        if (!isBackground) {
          setIsLoading(false);
        }
      }
    },
    [selectedDate, setOrders, showAllOrders]
  );

  useEffect(() => {
    fetchOrders(false);

    const intervalId = setInterval(() => {
      fetchOrders(true);
    }, 60 * 1000);

    return () => clearInterval(intervalId);
  }, [fetchOrders]);

  const filteredOrders = useMemo(() => {
    let filtered = orders;

    if (activeFilter !== "all") {
      filtered = filtered.filter((order) => order.status === activeFilter);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((order) => {
        return (
          order.orderId.toLowerCase().includes(query) ||
          order.customerName.toLowerCase().includes(query) ||
          order.customerPhone.includes(query) ||
          order.paymentMethod.toLowerCase().includes(query) ||
          order.status.toLowerCase().includes(query)
        );
      });
    }

    return filtered;
  }, [orders, activeFilter, searchQuery]);

  const getOrderCountByStatus = useCallback(
    (status: "all" | OrderStatus): number => {
      const baseOrders = searchQuery.trim()
        ? orders.filter((order) => {
            const query = searchQuery.toLowerCase().trim();
            return (
              order.orderId.toLowerCase().includes(query) ||
              order.customerName.toLowerCase().includes(query) ||
              order.customerPhone.includes(query) ||
              order.paymentMethod.toLowerCase().includes(query) ||
              order.status.toLowerCase().includes(query)
            );
          })
        : orders;

      if (status === "all") return baseOrders.length;
      return baseOrders.filter((order) => order.status === status).length;
    },
    [orders, searchQuery]
  );

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQuery("");
  }, []);

  const handleDateSelect = useCallback(
    (date: string | null) => {
      setSelectedDate(date || getTodayDate());
      setShowAllOrders(false);
      setActiveFilter("all");
    },
    [getTodayDate]
  );

  const handleShowAllOrders = useCallback(() => {
    setShowAllOrders(true);
    setSelectedDate(null);
    setActiveFilter("all");
  }, []);

  return {
    orders,
    filteredOrders,
    activeFilter,
    searchQuery,
    selectedDate,
    showAllOrders,
    isLoading,
    error,
    setActiveFilter,
    handleSearchChange,
    clearSearch,
    handleDateSelect,
    handleShowAllOrders,
    getOrderCountByStatus,
    refetch: () => fetchOrders(false),
    getTodayDate,
  };
}
