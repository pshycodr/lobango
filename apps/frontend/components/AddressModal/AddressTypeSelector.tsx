import { ADDRESS_TYPES } from "@/types/address";

export interface AddressTypeSelectorProps {
  selectedType: string;
  onSelect: (type: string) => void;
}

export function AddressTypeSelector({
  selectedType,
  onSelect,
}: AddressTypeSelectorProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-white">
        Address Type
      </label>
      <div className="grid grid-cols-3 gap-2">
        {ADDRESS_TYPES.map(({ type, label, icon: Icon }) => (
          <button
            key={type}
            type="button"
            onClick={() => onSelect(type)}
            className={`rounded-lg border p-3 transition-all duration-200 ${
              selectedType === type
                ? "border-yellow-500 bg-gray-800 text-yellow-500"
                : "border-gray-600 text-gray-400 hover:border-yellow-500"
            }`}
          >
            <Icon size={18} className="mx-auto mb-1" />
            <span className="text-xs">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
