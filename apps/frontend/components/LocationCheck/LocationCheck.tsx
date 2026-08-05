import { useLocationCheck } from "@/hooks/useLocationCheck";
import { AlertCircle, MapPin, RefreshCw } from "lucide-react";
import React from "react";

interface LocationCheckProps {
  onLocationChange?: (canCheckout: boolean) => void;
  className?: string;
}

export default function LocationCheck({
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

  const wrapperClass = `p-4 border-l-4 flex items-center ${className}`;

  switch (status) {
    case "checking":
      return (
        <div className={`${wrapperClass} bg-blue-50 border-blue-400`}>
          <RefreshCw className="h-5 w-5 text-blue-400 animate-spin mr-3" />
          <div>
            <p className="text-sm font-medium text-blue-800">
              Checking your location...
            </p>
            <p className="text-sm text-blue-600">
              Please allow location access to verify delivery availability.
            </p>
          </div>
        </div>
      );

    case "within_range":
      return;

    case "outside_range":
      return (
        <div className={`${wrapperClass} bg-red-50 border-red-400`}>
          <AlertCircle className="h-5 w-5 text-red-400 mr-3" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-800">
              Outside delivery area
            </p>
            <p className="text-sm text-red-600">
              You are {getDistanceText()} from our store. We only deliver within{" "}
              {maxDistance}km.
            </p>
          </div>
          <button
            onClick={recheckLocation}
            className="text-red-600 hover:text-red-800 text-xs underline"
          >
            Retry
          </button>
        </div>
      );

    case "error":
      return (
        <div className={`${wrapperClass} bg-yellow-50 border-yellow-400`}>
          <AlertCircle className="h-5 w-5 text-yellow-400 mr-3" />
          <div className="flex-1">
            <p className="text-sm font-medium text-yellow-800">
              Unable to verify location
            </p>
            <p className="text-sm text-yellow-600">{error}</p>
          </div>
          <button
            onClick={recheckLocation}
            className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-3 py-1 rounded text-xs font-medium transition-colors"
          >
            Try Again
          </button>
        </div>
      );

    case "unknown":
    default:
      return (
        <div className={`${wrapperClass} bg-gray-50 border-gray-300`}>
          <MapPin className="h-5 w-5 text-gray-400 mr-3" />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-700">
              Location check required
            </p>
            <p className="text-sm text-gray-600">
              We need to verify your location for delivery availability.
            </p>
          </div>
          <button
            onClick={checkLocation}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
          >
            Check Location
          </button>
        </div>
      );
  }
}
