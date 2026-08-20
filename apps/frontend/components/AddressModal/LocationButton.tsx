import { Navigation } from "lucide-react";

export interface LocationButtonProps {
  isLoading: boolean;
  onClick: () => void;
  error?: string;
}

export function LocationButton({
  isLoading,
  onClick,
  error,
}: LocationButtonProps) {
  return (
    <div className="mb-4">
      <button
        type="button"
        onClick={onClick}
        disabled={isLoading}
        className="w-full rounded-xl border-2 border-blue-500 p-4 text-blue-400 transition-all duration-200 hover:border-blue-400 hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <div className="flex items-center justify-center gap-2">
          <Navigation size={18} className={isLoading ? "animate-spin" : ""} />
          <span className="font-medium">
            {isLoading ? "Getting your location..." : "Use Current Location"}
          </span>
        </div>
      </button>

      {error && (
        <p className="mt-2 text-center text-sm text-red-400">{error}</p>
      )}
    </div>
  );
}
