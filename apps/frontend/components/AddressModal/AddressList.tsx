"use client";

import { Address, ADDRESS_TYPES } from "@lobango/contracts/address";
import { Edit, MapPin, X } from "lucide-react";

interface AddressListProps {
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
        className="w-full p-4 border-2 border-dashed border-gray-600 rounded-xl text-yellow-500 hover:border-yellow-500 hover:bg-gray-800 transition-all duration-200 mb-4"
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
            className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer group ${
              currentAddress?.id === address.id
                ? "border-yellow-500 bg-gray-800"
                : "border-gray-600 hover:border-yellow-500 hover:bg-gray-800"
            }`}
            onClick={() => onSelectAddress(address)}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                <div className="text-yellow-500 mt-1">
                  {getAddressIcon(address.type)}
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold mb-1">
                    {address.label}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
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
                  className="text-gray-400 hover:text-white p-1 rounded duration-200"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteAddress(address.id);
                  }}
                  className="text-gray-400 hover:text-red-400 p-1 rounded duration-200"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {addresses.length === 0 && (
        <div className="text-center py-8">
          <MapPin size={48} className="text-gray-400 mx-auto mb-3" />
          <p className="text-gray-400">No saved addresses yet</p>
        </div>
      )}
    </div>
  );
}
