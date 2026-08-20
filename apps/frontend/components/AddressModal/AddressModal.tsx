"use client";

import type { Address, AddressModalProps } from "@/types/address";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { AddressForm } from "./AddressForm";
import { AddressList } from "./AddressList";

const ADDRESS_STORAGE_KEY = "user_addresses";

export function AddressModal({
  isOpen,
  onClose,
  onSelectAddress,
  currentAddress,
}: AddressModalProps) {
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const storedAddresses = localStorage.getItem(ADDRESS_STORAGE_KEY);
    if (storedAddresses) {
      try {
        setSavedAddresses(JSON.parse(storedAddresses));
      } catch {
        localStorage.removeItem(ADDRESS_STORAGE_KEY);
      }
    }
    return () => setIsMounted(false);
  }, []);

  useEffect(() => {
    if (isMounted && savedAddresses.length >= 0) {
      localStorage.setItem(ADDRESS_STORAGE_KEY, JSON.stringify(savedAddresses));
    }
  }, [savedAddresses, isMounted]);

  const handleAddAddress = (addressData: Omit<Address, "id">) => {
    const newAddress: Address = {
      id: Date.now().toString(),
      ...addressData,
    };
    const updatedAddresses = [...savedAddresses, newAddress];
    setSavedAddresses(updatedAddresses);
    onSelectAddress(newAddress);
    setShowAddForm(false);
    onClose();
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setShowAddForm(true);
  };

  const handleUpdateAddress = (updatedAddress: Address) => {
    const updatedAddresses = savedAddresses.map((addr) =>
      addr.id === updatedAddress.id ? updatedAddress : addr
    );
    setSavedAddresses(updatedAddresses);

    if (currentAddress?.id === updatedAddress.id) {
      onSelectAddress(updatedAddress);
    }

    setEditingAddress(null);
    setShowAddForm(false);
    onClose();
  };

  const handleDeleteAddress = (id: string) => {
    const updatedAddresses = savedAddresses.filter((addr) => addr.id !== id);
    setSavedAddresses(updatedAddresses);
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingAddress(null);
    onClose();
  };

  const handleSaveAddress = (address: Address | Omit<Address, "id">) => {
    if (editingAddress && "id" in address) {
      handleUpdateAddress(address);
      return;
    }

    if (!editingAddress && !("id" in address)) {
      handleAddAddress(address);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-2xl bg-gray-900">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-gray-700 p-6">
          <h2 className="text-xl font-bold text-white">
            {showAddForm
              ? editingAddress
                ? "Edit Address"
                : "Add New Address"
              : "Select Delivery Address"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 transition-colors duration-200 hover:bg-gray-800 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto">
          {!showAddForm ? (
            <AddressList
              addresses={savedAddresses}
              currentAddress={currentAddress}
              onSelectAddress={(address) => {
                onSelectAddress(address);
                onClose();
              }}
              onDeleteAddress={handleDeleteAddress}
              onEditAddress={handleEditAddress}
              onAddNewAddress={() => setShowAddForm(true)}
            />
          ) : (
            <AddressForm
              initialData={editingAddress || undefined}
              onSave={handleSaveAddress}
              onCancel={handleCancel}
              isEditing={!!editingAddress}
            />
          )}
        </div>
      </div>
    </div>
  );
}
