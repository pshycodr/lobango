import { useLocationCheck } from "@/hooks/useLocationCheck";
import { AlertCircle, MapPin, RefreshCw } from "lucide-react";
import React from "react";

export interface LocationCheckProps {
  onLocationChange?: (canCheckout: boolean) => void;
  className?: string;
}

export function LocationCheck({
  onLocationChange,
  className = "",
}: LocationCheckProps) {
  const {
    error,
    canCheckout,
    maxDistance,
    getDistanceText,
    getLocationStatus,
    recheckLocation,
    checkLocation,
  } = useLocationCheck();

  React.useEffect(() => {
    onLocationChange?.(canCheckout);
  }, [canCheckout, onLocationChange]);

  const status = getLocationStatus();
  const wrapperClass = `p-4 border-l-4 flex items-center rounded-r-lg ${className}`;

  switch (status) {
    case "checking":
      return (
        <div
          className={`${wrapperClass} border-blue-400 bg-blue-950/40 text-white`}
        >
          <RefreshCw className="mr-3 h-5 w-5 animate-spin text-blue-400" />
          <div>
            <p className="text-sm font-medium text-blue-300">
              Checking your location...
            </p>
            <p className="text-xs text-blue-400">
              Detecting delivery proximity. You can also enter your address
              manually.
            </p>
          </div>
        </div>
      );

    case "within_range":
      return null;

    case "outside_range":
      return (
        <div
          className={`${wrapperClass} border-amber-400 bg-amber-950/40 text-white`}
        >
          <AlertCircle className="mr-3 h-5 w-5 shrink-0 text-amber-400" />
          <div className="flex-1">
            <p className="text-sm font-medium text-amber-300">
              Location check: {getDistanceText()} away
            </p>
            <p className="text-xs text-amber-400">
              Our standard delivery radius is {maxDistance}km. You may still
              continue with your confirmed address.
            </p>
          </div>
          <button
            onClick={recheckLocation}
            className="text-xs text-amber-300 underline hover:text-amber-100"
          >
            Retry
          </button>
        </div>
      );

    case "error":
      return (
        <div
          className={`${wrapperClass} border-gray-600 bg-(--eerie-black-2) text-white`}
        >
          <AlertCircle className="mr-3 h-5 w-5 shrink-0 text-gray-400" />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-300">
              Location detection unavailable
            </p>
            <p className="text-xs text-gray-400">
              {error || "Please enter your address manually."}
            </p>
          </div>
          <button
            onClick={recheckLocation}
            className="rounded bg-gray-800 px-3 py-1 text-xs font-medium text-gray-300 transition-colors hover:bg-gray-700 hover:text-white"
          >
            Try Again
          </button>
        </div>
      );

    case "unknown":
    default:
      return null;
  }
}
