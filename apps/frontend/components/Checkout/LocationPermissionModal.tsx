import { AlertCircle, MapPin, Settings, X } from "lucide-react";
import React, { useState } from "react";

export interface LocationPermissionModalProps {
  isOpen: boolean;
  onPermissionGranted: () => void;
  onPermissionDenied: () => void;
  onClose?: () => void;
}

export function LocationPermissionModal({
  isOpen,
  onPermissionGranted,
  onPermissionDenied,
  onClose,
}: LocationPermissionModalProps) {
  const [isRequesting, setIsRequesting] = useState(false);
  const [hasBeenDenied, setHasBeenDenied] = useState(false);

  const handleDismiss = () => {
    if (onClose) {
      onClose();
    } else {
      onPermissionDenied();
    }
  };

  const requestLocationPermission = async () => {
    setIsRequesting(true);

    try {
      if (!navigator.geolocation) {
        throw new Error("Geolocation is not supported by this browser");
      }

      if ("permissions" in navigator) {
        const permission = await navigator.permissions.query({
          name: "geolocation",
        });

        if (permission.state === "granted") {
          setIsRequesting(false);
          onPermissionGranted();
          return;
        }
      }

      navigator.geolocation.getCurrentPosition(
        () => {
          setIsRequesting(false);
          onPermissionGranted();
        },
        () => {
          setIsRequesting(false);
          setHasBeenDenied(true);
          onPermissionDenied();
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        }
      );
    } catch {
      setIsRequesting(false);
      setHasBeenDenied(true);
      onPermissionDenied();
    }
  };

  const openBrowserSettings = () => {
    const userAgent = navigator.userAgent;
    let instructions = "";

    if (userAgent.includes("Chrome")) {
      instructions =
        "Click the location icon in your address bar and select Allow";
    } else if (userAgent.includes("Firefox")) {
      instructions =
        "Click the shield icon in your address bar and Allow Location Access";
    } else if (userAgent.includes("Safari")) {
      instructions = "Go to Safari > Settings > Websites > Location > Allow";
    } else {
      instructions = "Please enable location access in your browser settings";
    }

    alert(`To enable location:\n\n${instructions}\n\nThen refresh the page.`);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "var(--black-alpha-80)" }}
    >
      <div
        className="relative mx-auto w-full max-w-xs overflow-hidden rounded-2xl shadow-2xl sm:max-w-sm"
        style={{ backgroundColor: "var(--white)" }}
      >
        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 z-10 rounded-full p-1.5 text-gray-800 transition-colors hover:bg-black/10"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div
          className="px-6 py-6 text-center"
          style={{ backgroundColor: "var(--gold-crayola)" }}
        >
          <div
            className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full"
            style={{ backgroundColor: "var(--white-alpha-20)" }}
          >
            <MapPin
              className="h-6 w-6"
              style={{ color: "var(--smoky-black-1)" }}
            />
          </div>
          <h2
            className="mb-1 text-lg font-bold"
            style={{ color: "var(--smoky-black-1)" }}
          >
            Enable Location
          </h2>
          <p
            className="text-xs opacity-80"
            style={{ color: "var(--smoky-black-2)" }}
          >
            For faster and accurate address autofill
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {!hasBeenDenied ? (
            <div className="mb-5 text-center">
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--davys-grey)" }}
              >
                Allowing location helps autofill your delivery address and check
                delivery availability. You can also enter your address manually.
              </p>
            </div>
          ) : (
            <div className="mb-5 text-center">
              <div
                className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full"
                style={{ backgroundColor: "var(--eerie-black-4)" }}
              >
                <AlertCircle
                  className="h-6 w-6"
                  style={{ color: "var(--white)" }}
                />
              </div>
              <h3
                className="mb-2 text-base font-bold"
                style={{ color: "var(--eerie-black-1)" }}
              >
                Location Access Not Available
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--davys-grey)" }}
              >
                No worries! You can continue and enter your address details
                manually.
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            {!hasBeenDenied ? (
              <>
                <button
                  onClick={requestLocationPermission}
                  disabled={isRequesting}
                  className="flex w-full items-center justify-center space-x-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50"
                  style={{
                    backgroundColor: "var(--gold-crayola)",
                    color: "var(--smoky-black-1)",
                  }}
                >
                  {isRequesting ? (
                    <>
                      <div
                        className="h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"
                        style={{ borderColor: "var(--smoky-black-1)" }}
                      ></div>
                      <span>Getting Location...</span>
                    </>
                  ) : (
                    <>
                      <MapPin className="h-4 w-4" />
                      <span>Allow Location</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleDismiss}
                  className="flex w-full items-center justify-center rounded-xl border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
                >
                  Enter Address Manually
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleDismiss}
                  className="flex w-full items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-200"
                  style={{
                    backgroundColor: "var(--gold-crayola)",
                    color: "var(--smoky-black-1)",
                  }}
                >
                  Enter Address Manually
                </button>

                <button
                  onClick={requestLocationPermission}
                  disabled={isRequesting}
                  className="flex w-full items-center justify-center space-x-2 rounded-xl border border-gray-300 px-6 py-2 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-100 disabled:opacity-50"
                >
                  <MapPin className="h-3.5 w-3.5" />
                  <span>Retry Location Detection</span>
                </button>

                <button
                  onClick={openBrowserSettings}
                  className="flex w-full items-center justify-center space-x-2 rounded-xl px-6 py-2 text-xs font-medium text-gray-500 transition-colors hover:text-gray-800"
                >
                  <Settings className="h-3.5 w-3.5" />
                  <span>Browser Settings Help</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
