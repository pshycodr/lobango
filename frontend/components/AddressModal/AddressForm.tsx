'use client';

import { useState } from 'react';
import { Navigation, X } from 'lucide-react';
import { Address, ADDRESS_TYPES } from '@/types/address';

interface AddressFormProps {
    initialData?: Partial<Address>;
    onSave: (address: Omit<Address, 'id'>) => void;
    onCancel: () => void;
}

export function AddressForm({ initialData, onSave, onCancel }: AddressFormProps) {
    const [isLoadingLocation, setIsLoadingLocation] = useState(false);
    const [locationError, setLocationError] = useState('');
    const [formData, setFormData] = useState({
        label: initialData?.label || '',
        address: initialData?.address || '',
        city: initialData?.city || '',
        state: initialData?.state || '',
        zipCode: initialData?.zipCode || '',
        type: initialData?.type || 'home'
    });

    const reverseGeocode = async (lat: number, lng: number) => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
            );
            const data = await response.json();
            
            return {
                address: data.display_name.trim(),
                city: data.address.village,
                state: data.address.state || '',
                zipCode: data.address.postcode || ''
            };
        } catch (error) {
            throw new Error('Failed to get address from coordinates');
        }
    };

    const handleUseCurrentLocation = async () => {
        if (!navigator.geolocation) {
            setLocationError('Geolocation is not supported by this browser');
            return;
        }

        setIsLoadingLocation(true);
        setLocationError('');

        try {
            const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 60000
                });
            });
            
            const { latitude, longitude } = position.coords;
            const addressData = await reverseGeocode(latitude, longitude);

            setFormData(prev => ({
                ...prev,
                address: addressData.address,
                city: addressData.city,
                state: addressData.state,
                zipCode: addressData.zipCode,
                label: prev.label || 'Current Location'
            }));

        } catch (error) {
            if (error instanceof GeolocationPositionError) {
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        setLocationError('Location access denied. Please enable location permissions.');
                        break;
                    case error.POSITION_UNAVAILABLE:
                        setLocationError('Location information unavailable.');
                        break;
                    case error.TIMEOUT:
                        setLocationError('Location request timed out.');
                        break;
                    default:
                        setLocationError('An error occurred while retrieving location.');
                        break;
                }
            } else {
                setLocationError('Failed to get address from your location.');
            }
        } finally {
            setIsLoadingLocation(false);
        }
    };

    const handleSubmit = () => {
        const newAddress = {
            label: formData.label || formData.type.charAt(0).toUpperCase() + formData.type.slice(1),
            address: formData.address,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode,
            type: formData.type
        };
        onSave(newAddress);
    };

    return (
        <div className="p-6 space-y-4">
            {/* Use Current Location Button */}
            <div className="mb-4">
                <button
                    type="button"
                    onClick={handleUseCurrentLocation}
                    disabled={isLoadingLocation}
                    className="w-full p-4 border-2 border-blue-500 rounded-xl text-blue-400 hover:border-blue-400 hover:bg-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <div className="flex items-center justify-center gap-2">
                        <Navigation size={18} className={isLoadingLocation ? 'animate-spin' : ''} />
                        <span className="font-medium">
                            {isLoadingLocation ? 'Getting your location...' : 'Use Current Location'}
                        </span>
                    </div>
                </button>

                {locationError && (
                    <p className="text-red-400 text-sm mt-2 text-center">{locationError}</p>
                )}
            </div>

            {/* Address Type Selection */}
            <div>
                <label className="block text-white text-sm font-medium mb-2">
                    Address Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                    {ADDRESS_TYPES.map(({ type, label, icon: Icon }) => (
                        <button
                            key={type}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, type }))}
                            className={`p-3 rounded-lg border transition-all duration-200 ${
                                formData.type === type
                                    ? 'border-yellow-500 bg-gray-800 text-yellow-500'
                                    : 'border-gray-600 text-gray-400 hover:border-yellow-500'
                            }`}
                        >
                            <Icon size={18} className="mx-auto mb-1" />
                            <span className="text-xs">{label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Custom Label */}
            <div>
                <label className="block text-white text-sm font-medium mb-2">
                    Label (Optional)
                </label>
                <input
                    type="text"
                    value={formData.label}
                    onChange={(e) => setFormData(prev => ({ ...prev, label: e.target.value }))}
                    placeholder="e.g., Home, Office, etc."
                    className="w-full p-3 rounded-lg bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:border-yellow-500 focus:outline-none transition-colors duration-200"
                />
            </div>

            {/* Street Address */}
            <div>
                <label className="block text-white text-sm font-medium mb-2">
                    Street Address *
                </label>
                <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="123 Main Street"
                    required
                    className="w-full p-3 rounded-lg bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:border-yellow-500 focus:outline-none transition-colors duration-200"
                />
            </div>

            {/* City, State, ZIP */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div>
                    <label className="block text-white text-sm font-medium mb-2">
                        City *
                    </label>
                    <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                        placeholder="Anytown"
                        required
                        className="w-full p-3 rounded-lg bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:border-yellow-500 focus:outline-none transition-colors duration-200"
                    />
                </div>
                <div>
                    <label className="block text-white text-sm font-medium mb-2">
                        State *
                    </label>
                    <input
                        type="text"
                        value={formData.state}
                        onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                        placeholder="CA"
                        required
                        className="w-full p-3 rounded-lg bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:border-yellow-500 focus:outline-none transition-colors duration-200"
                    />
                </div>
                <div className="col-span-2 md:col-span-1">
                    <label className="block text-white text-sm font-medium mb-2">
                        ZIP Code *
                    </label>
                    <input
                        type="text"
                        value={formData.zipCode}
                        onChange={(e) => setFormData(prev => ({ ...prev, zipCode: e.target.value }))}
                        placeholder="12345"
                        required
                        className="w-full p-3 rounded-lg bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:border-yellow-500 focus:outline-none transition-colors duration-200"
                    />
                </div>
            </div>

            {/* Form Actions */}
            <div className="flex gap-3 pt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 p-3 rounded-lg border border-gray-600 text-gray-400 hover:text-white hover:bg-gray-800 transition-colors duration-200"
                >
                    Cancel
                </button>
                <button
                    type="button"
                    onClick={handleSubmit}
                    className="flex-1 p-3 rounded-lg bg-yellow-500 text-black font-semibold hover:brightness-110 transition-all duration-200"
                >
                    Save Address
                </button>
            </div>
        </div>
    );
}