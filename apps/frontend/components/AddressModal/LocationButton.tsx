import { Navigation } from "lucide-react";

interface LocationButtonProps {
  isLoading: boolean;
  onClick: () => void;
  error?: string;
}

export default function LocationButton({
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
        className="w-full p-4 border-2 border-blue-500 rounded-xl text-blue-400 hover:border-blue-400 hover:bg-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <div className="flex items-center justify-center gap-2">
          <Navigation size={18} className={isLoading ? "animate-spin" : ""} />
          <span className="font-medium">
            {isLoading ? "Getting your location..." : "Use Current Location"}
          </span>
        </div>
      </button>

      {error && (
        <p className="text-red-400 text-sm mt-2 text-center">{error}</p>
      )}
    </div>
  );
}
