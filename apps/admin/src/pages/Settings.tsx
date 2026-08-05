"use client";

import { Check, CreditCard, Download } from "lucide-react";
import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import SectionHeader from "../components/Settings/SectionHeader";
import SettingsCard from "../components/Settings/SettingsCard";
import SettingItem from "../components/Settings/SettingsItems";
import api from "../lib/axios";
import { usePermissionsStore } from "../store/zustand/usePermissionsStore";

declare global {
  interface Window {
    Capacitor?: any;
  }
}

interface CustomerData {
  name: string;
  email: string;
  phone: string;
}

interface CustomerWithSource extends CustomerData {
  source: "Orders" | "Bookings" | "Orders/Bookings";
}

interface DownloadResponse {
  success: boolean;
  customers: CustomerWithSource[];
  orders: CustomerData[];
  bookings: CustomerData[];
  error?: string;
}

const AdminSettingsPage: React.FC = () => {
  const {
    fetchPermissions,
    newBookings,
    newOrders,
    setNewBookingPermission,
    setNewOrderPermission,
    loading: permsLoading,
  } = usePermissionsStore();

  const [dataRetention, setDataRetention] = useState({
    orders: false,
    bookings: false,
  });

  const [updating, setUpdating] = useState({
    orders: false,
    bookings: false,
  });

  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    fetchPermissions();
  }, [fetchPermissions]);

  useEffect(() => {
    setDataRetention({
      orders: !!newOrders,
      bookings: !!newBookings,
    });
  }, [newOrders, newBookings]);

  const handleDataRetentionChange =
    (key: keyof typeof dataRetention) => async (checked: boolean) => {
      setDataRetention((prev) => ({ ...prev, [key]: checked }));
      if (key === "orders") {
        setUpdating((s) => ({ ...s, orders: true }));
        try {
          await setNewOrderPermission(checked);
        } catch (e) {
          setDataRetention((prev) => ({ ...prev, orders: !!newOrders }));
        } finally {
          setUpdating((s) => ({ ...s, orders: false }));
        }
      } else {
        setUpdating((s) => ({ ...s, bookings: true }));
        try {
          await setNewBookingPermission(checked);
        } catch (e) {
          setDataRetention((prev) => ({ ...prev, bookings: !!newBookings }));
        } finally {
          setUpdating((s) => ({ ...s, bookings: false }));
        }
      }
    };

  const downloadForWeb = (workbook: XLSX.WorkBook, filename: string) => {
    const wbout = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

    const blob = new Blob([wbout], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const downloadForMobile = async (
    workbook: XLSX.WorkBook,
    filename: string,
  ) => {
    try {
      const wbout = XLSX.write(workbook, { bookType: "xlsx", type: "base64" });

      if (window.Capacitor && window.Capacitor.isNativePlatform()) {
        try {
          const { Filesystem, Directory } =
            await import("@capacitor/filesystem");

          await Filesystem.writeFile({
            path: filename,
            data: wbout,
            directory: Directory.Documents,
          });

          alert(`File saved successfully to Downloads/${filename}`);
        } catch (capacitorError) {
          console.error("Capacitor filesystem error:", capacitorError);
          throw capacitorError;
        }
      } else {
        const byteCharacters = atob(wbout);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        if ("download" in document.createElement("a")) {
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = filename;
          link.style.display = "none";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        } else {
          const url = window.URL.createObjectURL(blob);
          window.open(url, "_blank");
          setTimeout(() => window.URL.revokeObjectURL(url), 1000);
        }
      }
    } catch (error) {
      console.error("Mobile download error:", error);

      try {
        const wbout = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const blob = new Blob([wbout], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        link.click();
        window.URL.revokeObjectURL(url);
      } catch (fallbackError) {
        alert("Download failed. Please try again or contact support.");
      }
    }
  };

  const handleDataDownload = async () => {
    setDownloading(true);
    try {
      const response = await api.get<DownloadResponse>(
        "/api/v1/admin/download-data",
      );

      if (!response.data.success) {
        throw new Error(response.data.error || "Failed to fetch data");
      }

      const {
        customers,
        orders: ordersData,
        bookings: bookingsData,
      } = response.data;

      const customerMap = new Map<string, CustomerWithSource>();

      customers.forEach((customer) => {
        if (customer.phone) {
          const phone = customer.phone;
          const existingCustomer = customerMap.get(phone);

          if (existingCustomer) {
            if (existingCustomer.source !== customer.source) {
              customerMap.set(phone, {
                name: existingCustomer.name || customer.name,
                email: existingCustomer.email || customer.email,
                phone: phone,
                source: "Orders/Bookings",
              });
            }
          } else {
            customerMap.set(phone, customer);
          }
        }
      });

      const uniqueCustomersList = Array.from(customerMap.values());

      const workbook = XLSX.utils.book_new();

      const customerSheet = XLSX.utils.json_to_sheet(
        uniqueCustomersList.map((customer, index) => ({
          "S.No": index + 1,
          Name: customer.name || "N/A",
          Email: customer.email || "N/A",
          Phone: customer.phone || "N/A",
          Source: customer.source,
        })),
      );

      XLSX.utils.book_append_sheet(workbook, customerSheet, "Customer Data");

      if (ordersData.length > 0) {
        const ordersSheet = XLSX.utils.json_to_sheet(
          ordersData.map((customer, index) => ({
            "S.No": index + 1,
            Name: customer.name || "N/A",
            Email: customer.email || "N/A",
            Phone: customer.phone || "N/A",
          })),
        );
        XLSX.utils.book_append_sheet(workbook, ordersSheet, "Orders");
      }

      if (bookingsData.length > 0) {
        const bookingsSheet = XLSX.utils.json_to_sheet(
          bookingsData.map((customer, index) => ({
            "S.No": index + 1,
            Name: customer.name || "N/A",
            Email: customer.email || "N/A",
            Phone: customer.phone || "N/A",
          })),
        );
        XLSX.utils.book_append_sheet(workbook, bookingsSheet, "Bookings");
      }

      const now = new Date();
      const dateStr = now.toISOString().split("T")[0];
      const filename = `customer-data-${dateStr}.xlsx`;

      const isMobile =
        /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent,
        ) || window.Capacitor?.isNativePlatform();

      if (isMobile) {
        await downloadForMobile(workbook, filename);
      } else {
        downloadForWeb(workbook, filename);
      }
    } catch (error) {
      console.error("Download error:", error);
      alert("Failed to download data. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--smoky-black-1)] text-[var(--white)]">
      <header className="sticky top-0 z-40 bg-[var(--smoky-black-1)] bg-opacity-95 backdrop-blur-md border-b border-[var(--eerie-black-4)]">
        <div className="flex items-center p-4 pb-3 justify-between max-w-4xl mx-auto">
          <h1 className="text-lg md:text-xl font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-10">
            Settings
          </h1>
        </div>
      </header>

      <main className="flex-1 px-4 pt-5 pb-24 md:pb-8 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          <section className="lg:col-span-2">
            <SectionHeader
              title="Razor-Pay Settings"
              icon={<CreditCard size={24} />}
            />
            <SettingsCard>
              <div className="flex items-center gap-4 mb-6">
                <div className="text-[var(--white)] flex items-center justify-center rounded-xl bg-[var(--eerie-black-4)] shrink-0 size-14 md:size-16">
                  <CreditCard size={28} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-[var(--white)] text-base md:text-lg font-semibold">
                      Connected Razor-Pay Account
                    </p>
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                  </div>
                </div>
              </div>
              <button className="w-full bg-[var(--gold-crayola)] text-[var(--smoky-black-1)] rounded-xl px-6 py-3 font-semibold hover:bg-opacity-90 transition-all duration-200 transform hover:scale-[0.98]">
                Manage Razor-Pay Account
              </button>
            </SettingsCard>
          </section>

          <section>
            <SectionHeader title="Toggle Permissions" />
            <SettingsCard className="mb-6">
              <SettingItem
                title="Orders"
                description="Automatically accept new orders"
                type="toggle"
                checked={dataRetention.orders}
                onToggle={handleDataRetentionChange("orders")}
                showBorder={true}
                loading={permsLoading || updating.orders}
              />
              <SettingItem
                title="Bookings"
                description="Automatically accept new table bookings"
                type="toggle"
                checked={dataRetention.bookings}
                onToggle={handleDataRetentionChange("bookings")}
                showBorder={false}
                loading={permsLoading || updating.bookings}
              />
            </SettingsCard>
          </section>
          <section>
            <SectionHeader title="Data Download" />
            <SettingsCard>
              <SettingItem
                title="Download Customer Data"
                description="Export customer data from orders and bookings (.xlsx)"
                type="action"
                onAction={handleDataDownload}
                icon={<Download size={20} />}
                showBorder={false}
                loading={downloading}
              />
            </SettingsCard>
          </section>
        </div>

        <div className="hidden md:grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mt-8">
          <section className="lg:col-span-2">
            <SettingsCard className="bg-gradient-to-r from-[var(--eerie-black-2)] to-[var(--eerie-black-3)] border-[var(--gold-crayola)] border-opacity-20">
              <div className="text-center py-4">
                <div className="w-12 h-12 bg-[var(--gold-crayola)] bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Check className="text-[var(--smoky-black-1)]" size={24} />
                </div>
                <h3 className="text-lg font-semibold text-[var(--white)] mb-2">
                  Settings Saved Successfully
                </h3>
                <p className="text-[var(--quick-silver)] text-sm">
                  All your preferences have been automatically saved and
                  applied.
                </p>
              </div>
            </SettingsCard>
          </section>
        </div>
      </main>
    </div>
  );
};

export default AdminSettingsPage;
