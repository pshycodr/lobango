import React, { useState, useEffect } from 'react';
import { MapPin, AlertCircle, Settings } from 'lucide-react';

interface LocationPermissionModalProps {
  isOpen: boolean;
  onPermissionGranted: () => void;
  onPermissionDenied: () => void;
}

export default function LocationPermissionModal({
  isOpen,
  onPermissionGranted,
  onPermissionDenied
}: LocationPermissionModalProps) {
  const [isRequesting, setIsRequesting] = useState(false);
  const [hasBeenDenied, setHasBeenDenied] = useState(false);
  const [denialCount, setDenialCount] = useState(0);

  const requestLocationPermission = async () => {
    setIsRequesting(true);
    
    try {
      if (!navigator.geolocation) {
        throw new Error('Geolocation is not supported by this browser');
      }

      const permission = await navigator.permissions.query({ name: 'geolocation' });
      
      if (permission.state === 'granted') {
        onPermissionGranted();
        return;
      }

      // Request location
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setIsRequesting(false);
          onPermissionGranted();
        },
        (error) => {
          setIsRequesting(false);
          setHasBeenDenied(true);
          setDenialCount(prev => prev + 1);
          onPermissionDenied();
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    } catch (error) {
      setIsRequesting(false);
      setHasBeenDenied(true);
      setDenialCount(prev => prev + 1);
      onPermissionDenied();
    }
  };

  const openBrowserSettings = () => {
    const userAgent = navigator.userAgent;
    let instructions = '';
    
    if (userAgent.includes('Chrome')) {
      instructions = 'Click the location icon in your address bar and select Allow';
    } else if (userAgent.includes('Firefox')) {
      instructions = 'Click the shield icon in your address bar and Allow Location Access';
    } else if (userAgent.includes('Safari')) {
      instructions = 'Go to Safari > Settings > Websites > Location > Allow';
    } else {
      instructions = 'Please enable location access in your browser settings';
    }
    
    alert(`To enable location:\n\n${instructions}\n\nThen refresh the page.`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" 
         style={{ backgroundColor: 'var(--black-alpha-80)' }}>
      <div className="w-full max-w-xs sm:max-w-sm mx-auto rounded-2xl shadow-2xl overflow-hidden"
           style={{ backgroundColor: 'var(--white)' }}>
        
        {/* Header */}
        <div className="px-6 py-6 text-center"
             style={{ backgroundColor: 'var(--gold-crayola)' }}>
          <div className="mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-3"
               style={{ backgroundColor: 'var(--white-alpha-20)' }}>
            <MapPin className="w-6 h-6" style={{ color: 'var(--smoky-black-1)' }} />
          </div>
          <h2 className="text-lg font-bold mb-1"
              style={{ color: 'var(--smoky-black-1)' }}>
            Enable Location
          </h2>
          <p className="text-xs opacity-80"
             style={{ color: 'var(--smoky-black-2)' }}>
            For accurate delivery
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {!hasBeenDenied ? (
            <>
              <div className="text-center mb-5">
                <p className="text-sm leading-relaxed"
                   style={{ color: 'var(--davys-grey)' }}>
                  We need your location to check delivery availability and provide accurate service.
                </p>
              </div>
            </>
          ) : (
            <div className="text-center mb-5">
              <div className="mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-3"
                   style={{ backgroundColor: 'var(--eerie-black-4)' }}>
                <AlertCircle className="w-6 h-6" style={{ color: 'var(--white)' }} />
              </div>
              <h3 className="text-base font-bold mb-2"
                  style={{ color: 'var(--eerie-black-1)' }}>
                Location Blocked
              </h3>
              <p className="text-sm leading-relaxed"
                 style={{ color: 'var(--davys-grey)' }}>
                Please enable location access to continue with your order.
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            {!hasBeenDenied ? (
              <button
                onClick={requestLocationPermission}
                disabled={isRequesting}
                className="w-full py-3 px-6 rounded-xl font-semibold text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                style={{ 
                  backgroundColor: 'var(--gold-crayola)',
                  color: 'var(--smoky-black-1)'
                }}
              >
                {isRequesting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-t-transparent"
                         style={{ borderColor: 'var(--smoky-black-1)' }}></div>
                    <span>Getting Location...</span>
                  </>
                ) : (
                  <>
                    <MapPin className="w-4 h-4" />
                    <span>Allow Location</span>
                  </>
                )}
              </button>
            ) : (
              <>
                <button
                  onClick={requestLocationPermission}
                  disabled={isRequesting}
                  className="w-full py-3 px-6 rounded-xl font-semibold text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  style={{ 
                    backgroundColor: 'var(--gold-crayola)',
                    color: 'var(--smoky-black-1)'
                  }}
                >
                  {isRequesting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-t-transparent"
                           style={{ borderColor: 'var(--smoky-black-1)' }}></div>
                      <span>Getting Location...</span>
                    </>
                  ) : (
                    <>
                      <MapPin className="w-4 h-4" />
                      <span>Try Again</span>
                    </>
                  )}
                </button>
                
                <button
                  onClick={openBrowserSettings}
                  className="w-full py-2.5 px-6 rounded-xl font-medium text-sm transition-all duration-200 flex items-center justify-center space-x-2"
                  style={{ 
                    backgroundColor: 'var(--eerie-black-4)',
                    color: 'var(--white)'
                  }}
                >
                  <Settings className="w-4 h-4" />
                  <span>Browser Settings</span>
                </button>
              </>
            )}
          </div>

          {/* Simple Privacy Note */}
          <div className="mt-4 text-center">
            <p className="text-xs"
               style={{ color: 'var(--quick-silver)' }}>
              Your location is used only for delivery
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}