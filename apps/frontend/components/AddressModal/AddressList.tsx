"use client";

import { ADDRESS_TYPES, type Address } from "@lobango/contracts/address";
import { Edit, MapPin, X } from "lucide-react";
import React from "react";

export interface AddressListProps {
  addresses: Address[];
  currentAddress?: Address;
  onSelectAddress: (address: Address) => void;
  onDeleteAddress: (id: string) => void;
  onEditAddress: (address: Address) => void;
  onAddNewAddress: () => void;
}

const getAddressIcon = (type: string) => {
  const addressType = ADDRESS_TYPES.find((t) => t.type === type);
  const IconComponent = addressType?.icon || MapPin;
  return <IconComponent size={18} />;
};

const formatFullAddress = (address: Address) => {
  return `${address.name}, ${address.phone}, ${address.address}`;
};

export function AddressList({
  addresses,
  currentAddress,
  onSelectAddress,
  onDeleteAddress,
  onEditAddress,
  onAddNewAddress,
}: AddressListProps) {
  return (
    <div className="p-6">
      {/* Add New Address Button */}
      <button
        onClick={onAddNewAddress}
        className="mb-4 w-full rounded-xl border-2 border-dashed border-gray-600 p-4 text-yellow-500 transition-all duration-200 hover:border-yellow-500 hover:bg-gray-800"
      >
        <div className="flex items-center justify-center gap-2">
          <MapPin size={18} />
          <span className="font-medium">Add New Address</span>
        </div>
      </button>

      {/* Saved Addresses */}
      <div className="space-y-3">
        {addresses.map((address) => (
          <div
            key={address.id}
            className={`group cursor-pointer rounded-xl border p-4 transition-all duration-200 ${
              currentAddress?.id === address.id
                ? "border-yellow-500 bg-gray-800"
                : "border-gray-600 hover:border-yellow-500 hover:bg-gray-800"
            }`}
            onClick={() => onSelectAddress(address)}
          >
            <div className="flex items-start justify-between">
              <div className="flex flex-1 items-start gap-3">
                <div className="mt-1 text-yellow-500">
                  {getAddressIcon(address.type)}
                </div>
                <div className="flex-1">
                  <h3 className="mb-1 font-semibold text-white">
                    {address.label}
                  </h3>
                  <p className="text-sm leading-relaxed text-gray-400">
                    {formatFullAddress(address)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditAddress(address);
                  }}
                  className="rounded p-1 text-gray-400 duration-200 hover:text-white"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteAddress(address.id);
                  }}
                  className="rounded p-1 text-gray-400 duration-200 hover:text-red-400"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {addresses.length === 0 && (
        <div className="py-8 text-center">
          <MapPin size={48} className="mx-auto mb-3 text-gray-400" />
          <p className="text-gray-400">No saved addresses yet</p>
        </div>
      )}
    </div>
  );
}
