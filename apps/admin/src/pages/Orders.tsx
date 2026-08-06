import { useNavigate } from "@tanstack/react-router";
import { Calendar, Filter, Package } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import LoadingSpinner from "../components/Common/Loader";
import CalendarPicker from "../components/Orders/CalendarPicker";
import FilterButton from "../components/Orders/FilterButton";
import OrderCard from "../components/Orders/OrderCard";
import Header from "../components/Orders/OrdersHeader";
import SearchResultsInfo from "../components/Orders/SearchResultsInfo";
import api from "../lib/axios";
import { useOrdersStore } from "../store/zustand/useOrdersStore";
import type { Order } from "../types/orders";

type OrderResponse = {
  success: boolean;
  count: number;
  orders: Order[];
};

const AdminOrdersView: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<"all" | Order["status"]>(
    "all"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showAllOrders, setShowAllOrders] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showCalendar, setShowCalendar] = useState(false);

  const setOrders = useOrdersStore((state) => state.setOrders);
  const orders = useOrdersStore((state) => state.orders);
  const navigate = useNavigate();

  // Get today's date in YYYY-MM-DD format (timezone safe)
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Initialize with today's date
  useEffect(() => {
    if (!selectedDate && !showAllOrders) {
      setSelectedDate(getTodayDate());
    }
  }, []);

  // Fetch orders based on current state
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const fetchOrders = async (isBackground = false) => {
      try {
        if (!isBackground) {
          setLoading(true);
        }

        let url = "/api/v1/admin/orders";
        if (!showAllOrders && selectedDate) {
          url += `?date=${selectedDate}`;
        }

        const res = await api.get<OrderResponse>(url);
        const { orders: fetchedOrders } = res.data;
        setOrders(fetchedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
        // TODO: Add error toast here
      } finally {
        if (!isBackground) {
          setLoading(false);
        }
      }
    };

    if (selectedDate || showAllOrders) {
      fetchOrders(false);
      // 1-minute polling interval
      intervalId = setInterval(() => fetchOrders(true), 60 * 1000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [setOrders, selectedDate, showAllOrders]);

  // Search and filter orders
  const filteredOrders = useMemo(() => {
    let filtered = orders;

    // Apply status filter
    if (activeFilter !== "all") {
      filtered = filtered.filter((order) => order.status === activeFilter);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((order) => {
        return (
          order.orderId.toLowerCase().includes(query) ||
          order.name.toLowerCase().includes(query) ||
          order.phone.includes(query) ||
          order.address.toLowerCase().includes(query) ||
          order.paymentMethod.toLowerCase().includes(query) ||
          order.status.toLowerCase().includes(query) ||
          order.items.some((item) => item.name.toLowerCase().includes(query))
        );
      });
    }

    return filtered;
  }, [orders, activeFilter, searchQuery]);

  const getOrderCountByStatus = (status: Order["status"] | "all"): number => {
    const baseOrders = searchQuery.trim()
      ? orders.filter((order) => {
          const query = searchQuery.toLowerCase().trim();
          return (
            order.orderId.toLowerCase().includes(query) ||
            order.name.toLowerCase().includes(query) ||
            order.phone.includes(query) ||
            order.address.toLowerCase().includes(query) ||
            order.paymentMethod.toLowerCase().includes(query) ||
            order.status.toLowerCase().includes(query) ||
            order.items.some((item) => item.name.toLowerCase().includes(query))
          );
        })
      : orders;

    if (status === "all") return baseOrders.length;
    return baseOrders.filter((order) => order.status === status).length;
  };

  const filters: Array<{ key: "all" | Order["status"]; label: string }> = [
    { key: "all", label: "All Orders" },
    { key: "pending", label: "Pending" },
    { key: "accepted", label: "Accepted" },
    { key: "out for delivery", label: "Out for Delivery" },
    { key: "delivered", label: "Delivered" },
    { key: "rejected", label: "Rejected" },
  ];

  const handleOrderClick = (order: Order) => {
    console.log("Order clicked:", order.orderId);
    navigate({
      to: "/order",
      search: {
        orderId: order.orderId,
      },
    });
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  const handleDateSelect = (date: string | null) => {
    setSelectedDate(date || getTodayDate());
    setShowAllOrders(false);
    setActiveFilter("all");
  };

  const handleShowAllOrders = () => {
    setShowAllOrders(true);
    setSelectedDate(null);
    setActiveFilter("all");
  };

  const formatDisplayDate = (dateStr: string) => {
    const date = new Date(dateStr + "T00:00:00"); // Add time to avoid timezone issues

    // Compare dates properly
    const isToday = dateStr === getTodayDate();

    if (isToday) return "Today";

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-(--smoky-black-1)">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-(--smoky-black-1) p-4">
      <div className="mx-auto max-w-7xl">
        <Header
          totalOrders={orders.length}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
        />

        {/* Search Results Info */}
        <SearchResultsInfo
          searchQuery={searchQuery}
          resultCount={filteredOrders.length}
          onClearSearch={clearSearch}
        />

        {/* Date Filter - 3 Options Only */}
        <div className="mb-6">
          <div className="mb-4 flex items-center gap-2">
            <Calendar size={18} className="text-(--quick-silver)" />
            <span className="text-sm font-medium text-(--quick-silver)">
              Date filter
            </span>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {/* Today */}
            <button
              onClick={() => {
                const today = getTodayDate();
                setSelectedDate(today);
                setShowAllOrders(false);
                setActiveFilter("all");
              }}
              className={`rounded-lg px-4 py-2 text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                !showAllOrders && selectedDate === getTodayDate()
                  ? "bg-(--gold-crayola) text-(--smoky-black-1)"
                  : "bg-(--eerie-black-2) text-(--quick-silver) hover:bg-(--eerie-black-3) hover:text-(--white)"
              }`}
            >
              Today
              {!showAllOrders &&
                selectedDate === getTodayDate() &&
                orders.length > 0 &&
                ` (${orders.length})`}
            </button>

            {/* All Orders */}
            <button
              onClick={handleShowAllOrders}
              className={`rounded-lg px-4 py-2 text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                showAllOrders
                  ? "bg-(--gold-crayola) text-(--smoky-black-1)"
                  : "bg-(--eerie-black-2) text-(--quick-silver) hover:bg-(--eerie-black-3) hover:text-(--white)"
              }`}
            >
              All Orders
              {showAllOrders && orders.length > 0 && ` (${orders.length})`}
            </button>

            {/* Select Date */}
            <button
              onClick={() => setShowCalendar(true)}
              className={`rounded-lg px-4 py-2 text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                !showAllOrders &&
                selectedDate &&
                selectedDate !== getTodayDate()
                  ? "bg-(--gold-crayola) text-(--smoky-black-1)"
                  : "bg-(--eerie-black-2) text-(--quick-silver) hover:bg-(--eerie-black-3) hover:text-(--white)"
              }`}
            >
              {!showAllOrders && selectedDate && selectedDate !== getTodayDate()
                ? formatDisplayDate(selectedDate)
                : "Select Date"}
              {!showAllOrders &&
                selectedDate &&
                selectedDate !== getTodayDate() &&
                orders.length > 0 &&
                ` (${orders.length})`}
            </button>
          </div>
        </div>

        {/* Status Filters */}
        <div className="mb-6">
          <div className="mb-4 flex items-center gap-2">
            <Filter size={18} className="text-(--quick-silver)" />
            <span className="text-sm font-medium text-(--quick-silver)">
              Filter by status
            </span>
          </div>

          <div className="flex scrollbar-thin scrollbar-thumb-(--eerie-black-4) scrollbar-track-transparent gap-2 overflow-x-auto pb-2">
            {filters.map((filter) => (
              <FilterButton
                key={filter.key}
                label={filter.label}
                isActive={activeFilter === filter.key}
                count={getOrderCountByStatus(filter.key)}
                onClick={() => setActiveFilter(filter.key)}
              />
            ))}
          </div>
        </div>

        {/* Orders Grid */}
        {filteredOrders.length === 0 ? (
          <div className="py-12 text-center">
            <Package size={48} className="mx-auto mb-4 text-(--quick-silver)" />
            <h3 className="mb-2 text-lg font-medium text-(--white)">
              {searchQuery.trim() || (!showAllOrders && selectedDate)
                ? "No matching orders found"
                : "No orders found"}
            </h3>
            <p className="mb-4 text-(--quick-silver)">
              {searchQuery.trim()
                ? `No orders match your search "${searchQuery}"${activeFilter !== "all" ? ` with status "${activeFilter}"` : ""}.`
                : !showAllOrders && selectedDate
                  ? `No orders found for ${selectedDate === getTodayDate() ? "today" : formatDisplayDate(selectedDate)}${activeFilter !== "all" ? ` with status "${activeFilter}"` : ""}.`
                  : activeFilter === "all"
                    ? "There are no orders yet."
                    : `No orders with status "${activeFilter}".`}
            </p>
            <div className="flex justify-center gap-2">
              {searchQuery.trim() && (
                <button
                  onClick={clearSearch}
                  className="rounded-lg bg-(--gold-crayola) px-4 py-2 font-medium text-(--smoky-black-1) transition-colors hover:bg-(--gold-crayola)/90"
                >
                  Clear search
                </button>
              )}
              {!showAllOrders && (
                <button
                  onClick={handleShowAllOrders}
                  className="rounded-lg bg-(--eerie-black-3) px-4 py-2 font-medium text-(--white) transition-colors hover:bg-(--eerie-black-4)"
                >
                  Show all orders
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredOrders.map((order) => (
              <OrderCard
                key={order.orderId}
                order={order}
                onClick={() => handleOrderClick(order)}
              />
            ))}
          </div>
        )}

        {/* Calendar Modal */}
        {showCalendar && (
          <CalendarPicker
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
            onClose={() => setShowCalendar(false)}
          />
        )}
      </div>
    </div>
  );
};

export default AdminOrdersView;
