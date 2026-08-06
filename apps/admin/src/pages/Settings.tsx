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
    filename: string
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
        "/api/v1/admin/download-data"
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
        }))
      );

      XLSX.utils.book_append_sheet(workbook, customerSheet, "Customer Data");

      if (ordersData.length > 0) {
        const ordersSheet = XLSX.utils.json_to_sheet(
          ordersData.map((customer, index) => ({
            "S.No": index + 1,
            Name: customer.name || "N/A",
            Email: customer.email || "N/A",
            Phone: customer.phone || "N/A",
          }))
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
          }))
        );
        XLSX.utils.book_append_sheet(workbook, bookingsSheet, "Bookings");
      }

      const now = new Date();
      const dateStr = now.toISOString().split("T")[0];
      const filename = `customer-data-${dateStr}.xlsx`;

      const isMobile =
        /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
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
    <div className="min-h-screen bg-(--smoky-black-1) text-(--white)">
      <header className="bg-opacity-95 sticky top-0 z-40 border-b border-(--eerie-black-4) bg-(--smoky-black-1) backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center justify-between p-4 pb-3">
          <h1 className="flex-1 pr-10 text-center text-lg leading-tight font-bold tracking-[-0.015em] md:text-xl">
            Settings
          </h1>
        </div>
      </header>

      <main className="mx-auto max-w-4xl flex-1 px-4 pt-5 pb-24 md:pb-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
          <section className="lg:col-span-2">
            <SectionHeader
              title="Razor-Pay Settings"
              icon={<CreditCard size={24} />}
            />
            <SettingsCard>
              <div className="mb-6 flex items-center gap-4">
                <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-(--eerie-black-4) text-(--white) md:size-16">
                  <CreditCard size={28} />
                </div>
                <div className="flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <p className="text-base font-semibold text-(--white) md:text-lg">
                      Connected Razor-Pay Account
                    </p>
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                  </div>
                </div>
              </div>
              <button className="hover:bg-opacity-90 w-full transform rounded-xl bg-(--gold-crayola) px-6 py-3 font-semibold text-(--smoky-black-1) transition-all duration-200 hover:scale-[0.98]">
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

        <div className="mt-8 hidden grid-cols-1 gap-6 md:grid lg:grid-cols-2 lg:gap-8">
          <section className="lg:col-span-2">
            <SettingsCard className="border-opacity-20 border-(--gold-crayola) bg-linear-to-r from-(--eerie-black-2) to-(--eerie-black-3)">
              <div className="py-4 text-center">
                <div className="bg-opacity-20 mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-(--gold-crayola)">
                  <Check className="text-(--smoky-black-1)" size={24} />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-(--white)">
                  Settings Saved Successfully
                </h3>
                <p className="text-sm text-(--quick-silver)">
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
