"use client";
import { Address, AddressModalProps } from "@lobango/contracts/address";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { AddressForm } from "./AddressForm";
import { AddressList } from "./AddressList";

const ADDRESS_STORAGE_KEY = "user_addresses";

export default function AddressModal({
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
      } catch (e) {
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
      addr.id === updatedAddress.id ? updatedAddress : addr,
    );
    setSavedAddresses(updatedAddresses);

    // Update current address if it's the one being edited
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

    if (currentAddress?.id === id) {
      // @ts-ignore
      onSelectAddress(null);
    }
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingAddress(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 bg-opacity-80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-white text-xl font-bold">
            {showAddForm
              ? editingAddress
                ? "Edit Address"
                : "Add New Address"
              : "Select Delivery Address"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-800 transition-colors duration-200"
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
              // @ts-ignore
              onSave={editingAddress ? handleUpdateAddress : handleAddAddress}
              onCancel={handleCancel}
              isEditing={!!editingAddress}
            />
          )}
        </div>
      </div>
    </div>
  );
}
