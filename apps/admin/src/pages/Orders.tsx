import LoadingSpinner from "@/components/Common/Loader";
import CalendarPicker from "@/components/Orders/CalendarPicker";
import FilterButton from "@/components/Orders/FilterButton";
import OrderCard from "@/components/Orders/OrderCard";
import OrdersHeader from "@/components/Orders/OrdersHeader";
import SearchResultsInfo from "@/components/Orders/SearchResultsInfo";
import { useAdminOrders } from "@/hooks/useAdminOrders";
import type { OrderStatus } from "@lobango/contracts/enums";
import type { GetAllOrder } from "@lobango/contracts/order";
import { useNavigate } from "@tanstack/react-router";
import { Calendar, Filter, Package } from "lucide-react";
import { useState } from "react";

export function AdminOrdersView() {
  const {
    orders,
    filteredOrders,
    activeFilter,
    searchQuery,
    selectedDate,
    showAllOrders,
    isLoading,
    setActiveFilter,
    handleSearchChange,
    clearSearch,
    handleDateSelect,
    handleShowAllOrders,
    getOrderCountByStatus,
    getTodayDate,
  } = useAdminOrders();

  const [showCalendar, setShowCalendar] = useState(false);
  const navigate = useNavigate();

  const filters: Array<{ key: "all" | OrderStatus; label: string }> = [
    { key: "all", label: "All Orders" },
    { key: "pending", label: "Pending" },
    { key: "accepted", label: "Accepted" },
    { key: "out_for_delivery", label: "Out for Delivery" },
    { key: "delivered", label: "Delivered" },
    { key: "canceld", label: "Cancelled" },
    { key: "rejected", label: "Rejected" },
  ];

  const handleOrderClick = (order: GetAllOrder) => {
    navigate({
      to: "/order",
      search: {
        orderId: order.orderId,
      },
    });
  };

  const formatDisplayDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr + "T00:00:00");
      const isToday = dateStr === getTodayDate();
      if (isToday) return "Today";

      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-(--smoky-black-1)">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-(--smoky-black-1) p-4">
      <div className="mx-auto max-w-7xl">
        <OrdersHeader
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

        {/* Date Filter */}
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
                handleDateSelect(getTodayDate());
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
            onDateSelect={(date) => {
              handleDateSelect(date);
              setShowCalendar(false);
            }}
            onClose={() => setShowCalendar(false)}
          />
        )}
      </div>
    </div>
  );
}

export default AdminOrdersView;
