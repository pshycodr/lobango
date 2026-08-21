import { useCallback, useEffect, useState } from "react";

export interface LocationPermissionState {
  hasPermission: boolean;
  isModalOpen: boolean;
  isLoading: boolean;
  error: string | null;
  coordinates: { latitude: number; longitude: number } | null;
}

export function useLocationPermission() {
  const [state, setState] = useState<LocationPermissionState>({
    hasPermission: false,
    isModalOpen: false,
    isLoading: true,
    error: null,
    coordinates: null,
  });

  const checkLocationPermission = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      if (!navigator.geolocation) {
        throw new Error("Geolocation is not supported by this browser");
      }

      // Check if permission API is available
      if ("permissions" in navigator) {
        const permission = await navigator.permissions.query({
          name: "geolocation",
        });

        if (permission.state === "granted") {
          // Get current position to confirm it works
          navigator.geolocation.getCurrentPosition(
            (position) => {
              setState((prev) => ({
                ...prev,
                hasPermission: true,
                isModalOpen: false,
                isLoading: false,
                coordinates: {
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                },
              }));
            },
            () => {
              setState((prev) => ({
                ...prev,
                hasPermission: false,
                isModalOpen: true,
                isLoading: false,
                error: "Failed to get location",
              }));
            }
          );
        } else if (permission.state === "denied") {
          setState((prev) => ({
            ...prev,
            hasPermission: false,
            isModalOpen: true,
            isLoading: false,
            error: "Location permission denied",
          }));
        } else {
          // Permission is 'prompt' - show modal
          setState((prev) => ({
            ...prev,
            hasPermission: false,
            isModalOpen: true,
            isLoading: false,
          }));
        }
      } else {
        // Fallback for browsers without permission API
        setState((prev) => ({
          ...prev,
          hasPermission: false,
          isModalOpen: true,
          isLoading: false,
        }));
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        hasPermission: false,
        isModalOpen: true,
        isLoading: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }));
    }
  }, []);

  // Check initial permission status
  useEffect(() => {
    checkLocationPermission();
  }, [checkLocationPermission]);

  const handlePermissionGranted = useCallback(() => {
    // Get current position
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState((prev) => ({
          ...prev,
          hasPermission: true,
          isModalOpen: false,
          error: null,
          coordinates: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
        }));
      },
      () => {
        setState((prev) => ({
          ...prev,
          hasPermission: false,
          isModalOpen: true,
          error: "Failed to get location",
        }));
      }
    );
  }, []);

  const handlePermissionDenied = useCallback(() => {
    setState((prev) => ({
      ...prev,
      hasPermission: false,
      isModalOpen: true, // Keep modal open if denied
      error: "Location permission required for checkout",
    }));
  }, []);

  const retryPermission = useCallback(() => {
    checkLocationPermission();
  }, [checkLocationPermission]);

  return {
    ...state,
    handlePermissionGranted,
    handlePermissionDenied,
    retryPermission,
    checkLocationPermission,
  };
}
