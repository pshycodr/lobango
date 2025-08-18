import { useState, useEffect } from 'react';

interface LocationState {
  isWithinRange: boolean | null; // null = loading/unknown, true = within range, false = outside range
  userLocation: { lat: number; lng: number } | null;
  distance: number | null; // distance in km
  error: string | null;
  isLoading: boolean;
}

interface UseLocationCheckOptions {
  maxDistanceKm?: number;
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
  autoCheck?: boolean; // whether to automatically check location on mount
}

export function useLocationCheck(options: UseLocationCheckOptions = {}) {
  const {
    maxDistanceKm = 10,
    enableHighAccuracy = true,
    timeout = 10000,
    maximumAge = 300000, // 5 minutes
    autoCheck = true
  } = options;

  // Shop location coordinates
  const SHOP_LOCATION = {
    lat: 23.6439598,
    lng: 88.125675
    // 23.1845829 87.9579848
  };

  const [locationState, setLocationState] = useState<LocationState>({
    isWithinRange: null,
    userLocation: null,
    distance: null,
    error: null,
    isLoading: false
  });

  // Calculate distance between two coordinates using Haversine formula
  const calculateDistance = (
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = toRadians(lat2 - lat1);
    const dLng = toRadians(lng2 - lng1);
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    
    return Math.round(distance * 100) / 100; // Round to 2 decimal places
  };

  const toRadians = (degrees: number): number => {
    return degrees * (Math.PI / 180);
  };

  // Get user's current location
  const checkUserLocation = async (): Promise<void> => {
    return new Promise((resolve, reject) => {
      setLocationState(prev => ({
        ...prev,
        isLoading: true,
        error: null
      }));

      if (!navigator.geolocation) {
        const error = 'Geolocation is not supported by this browser.';
        setLocationState(prev => ({
          ...prev,
          isLoading: false,
          error,
          isWithinRange: false
        }));
        reject(new Error(error));
        return;
      }

      const options: PositionOptions = {
        enableHighAccuracy,
        timeout,
        maximumAge
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;
          
          const distance = calculateDistance(
            userLat,
            userLng,
            SHOP_LOCATION.lat,
            SHOP_LOCATION.lng
          );

          const isWithinRange = distance <= maxDistanceKm;

          setLocationState({
            isWithinRange,
            userLocation: { lat: userLat, lng: userLng },
            distance,
            error: null,
            isLoading: false
          });

          resolve();
        },
        (error) => {
          let errorMessage = 'Unable to retrieve your location.';
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access denied. Please enable location services and refresh the page.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information is unavailable.';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out.';
              break;
          }

          setLocationState(prev => ({
            ...prev,
            isLoading: false,
            error: errorMessage,
            isWithinRange: false
          }));

          reject(new Error(errorMessage));
        },
        options
      );
    });
  };

  // Reset location check
  const resetLocationCheck = () => {
    setLocationState({
      isWithinRange: null,
      userLocation: null,
      distance: null,
      error: null,
      isLoading: false
    });
  };

  // Force recheck location
  const recheckLocation = async () => {
    await checkUserLocation();
  };

  // Auto-check location on mount if enabled
  useEffect(() => {
    if (autoCheck) {
      checkUserLocation().catch(console.error);
    }
  }, [autoCheck]);

  return {
    // Location state
    isWithinRange: locationState.isWithinRange,
    userLocation: locationState.userLocation,
    distance: locationState.distance,
    error: locationState.error,
    isLoading: locationState.isLoading,
    
    // Actions
    checkLocation: checkUserLocation,
    recheckLocation,
    resetLocationCheck,
    
    // Utils
    canCheckout: locationState.isWithinRange === true,
    shouldBlockCheckout: locationState.isWithinRange === false,
    maxDistance: maxDistanceKm,
    shopLocation: SHOP_LOCATION,
    
    // Helper methods
    getDistanceText: () => {
      if (locationState.distance === null) return null;
      return `${locationState.distance} km away`;
    },
    
    getLocationStatus: () => {
      if (locationState.isLoading) return 'checking';
      if (locationState.error) return 'error';
      if (locationState.isWithinRange === true) return 'within_range';
      if (locationState.isWithinRange === false) return 'outside_range';
      return 'unknown';
    }
  };
}