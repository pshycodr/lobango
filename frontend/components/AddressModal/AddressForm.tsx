'use client';

import { useGeolocation } from '@/hooks/useGeolocation';
import { Address } from '@/types/address';
import { useCallback, useState } from 'react';
import { AddressTypeSelector } from './AddressTypeSelector';
import { FormActions } from './FormActions';
import { FormInput } from './FormInput';
import LocationButton from './LocationButton';

interface AddressFormProps {
  initialData?: Partial<Address>;
  onSave: (address: Omit<Address, 'id'>) => void;
  onCancel: () => void;
}

export function AddressForm({ initialData, onSave, onCancel }: AddressFormProps) {
  const [formData, setFormData] = useState({
    label: initialData?.label || '',
    name: initialData?.name || '',
    phone: initialData?.phone || '',
    email: initialData?.phone || '',
    address: initialData?.address || '',
    city: initialData?.city || '',
    state: initialData?.state || '',
    zipCode: initialData?.zipCode || '',
    type: initialData?.type || 'home',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const { getCurrentLocation, isLoading: isLoadingLocation, error: locationError } = useGeolocation();

  const validateForm = useCallback(() => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) errors.name = 'Full name is required';
    if (!formData.phone.trim()) errors.phone = 'Phone number is required';
    if (!formData.email.trim()) errors.phone = 'Email is required';
    if (!formData.address.trim()) errors.address = 'Street address is required';
    if (!formData.city.trim()) errors.city = 'City is required';
    if (!formData.state.trim()) errors.state = 'State is required';
    if (!formData.zipCode.trim()) errors.zipCode = 'ZIP code is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  const handleFieldChange = useCallback((field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) setFormErrors((prev) => ({ ...prev, [field]: '' }));
  }, [formErrors]);

  const handleUseCurrentLocation = useCallback(async () => {
    try {
      const { latitude, longitude } = await getCurrentLocation();
      console.log(latitude, longitude);
      
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
      );
      if (!response.ok) throw new Error('Failed to fetch address');

      const data = await response.json();
      console.log(data);
      
      setFormData((prev) => ({
        ...prev,
        address: data.display_name || '',
        city: data.address.village || data.address.city || '',
        state: data.address.state || '',
        zipCode: data.address.postcode || '',
        label: prev.label || 'Current Location',
      }));
    } catch (err) {
      console.error('Location error:', err);
    }
  }, [getCurrentLocation]);

  const handleSubmit = useCallback(() => {
    if (!validateForm()) return;

    const newAddress: Omit<Address, 'id'> = {
      label: formData.label || formData.type.charAt(0).toUpperCase() + formData.type.slice(1),
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      zipCode: formData.zipCode,
      type: formData.type,
    };

    onSave(newAddress);
  }, [formData, onSave, validateForm]);

  return (
    <div className="p-4 md:p-6 space-y-6">

      {/* Section: Contact Info */}
      <section>
        <div className="border-b border-gray-700 pb-1 mb-4">
          <h2 className="text-sm text-gray-400 uppercase tracking-wider font-semibold">Contact Info</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormInput
            label="Full Name *"
            value={formData.name}
            onChange={(val) => handleFieldChange('name', val)}
            placeholder="your full name"
            error={formErrors.name}
          />
          <FormInput
            label="Phone Number *"
            value={formData.phone}
            onChange={(val) => handleFieldChange('phone', val)}
            placeholder="+91 1234567890"
            type="tel"
            error={formErrors.phone}
          />
          <FormInput
            label="Valid Email *"
            value={formData.email}
            onChange={(val) => handleFieldChange('email', val)}
            placeholder="your@mail.com"
            type="email"
            error={formErrors.phone}
          />
        </div>
      </section>

      {/* Section: Address Type + Label */}
      <section>
        <div className="border-b border-gray-700 pb-1 mb-4">
          <h2 className="text-sm text-gray-400 uppercase tracking-wider font-semibold">Address Type</h2>
        </div>

        <div className="mb-4">
          <AddressTypeSelector
            selectedType={formData.type}
            onSelect={(type) => setFormData((prev) => ({ ...prev, type: type as 'home' | 'work' | 'other' }))}

          />
        </div>

        <FormInput
          label="Custom Label (optional)"
          value={formData.label}
          onChange={(val) => handleFieldChange('label', val)}
          placeholder="e.g., My Gym, Nana's House"
        />
      </section>

      {/* Section: Address Fields */}
      <section>
        <div className="border-b border-gray-700 pb-1 mb-4">
          <h2 className="text-sm text-gray-400 uppercase tracking-wider font-semibold">Address</h2>
        </div>

        <FormInput
          label="Street Address *"
          value={formData.address}
          onChange={(val) => handleFieldChange('address', val)}
          placeholder="123 Main Street"
          error={formErrors.address}
        />

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 mt-4">
          <FormInput
            label="City *"
            value={formData.city}
            onChange={(val) => handleFieldChange('city', val)}
            placeholder="Anytown"
            error={formErrors.city}
          />
          <FormInput
            label="State *"
            value={formData.state}
            onChange={(val) => handleFieldChange('state', val)}
            placeholder="CA"
            error={formErrors.state}
          />
          <FormInput
            label="ZIP Code *"
            value={formData.zipCode}
            onChange={(val) => handleFieldChange('zipCode', val)}
            placeholder="12345"
            error={formErrors.zipCode}
          />
        </div>
      </section>

      {/* Section: Use Current Location */}
      <section className="space-y-4">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-600" />
          </div>
          <div className="relative flex justify-center">
            <span className="px-2 bg-gray-900 text-xs uppercase tracking-widest text-gray-500">OR</span>
          </div>
        </div>

        <LocationButton
          isLoading={isLoadingLocation}
          onClick={handleUseCurrentLocation}
          error={locationError}
        />
      </section>

      {/* Section: Actions */}
      <FormActions
        onCancel={onCancel}
        onSubmit={handleSubmit}
        submitLabel="Save Address"
      />
    </div>
  );
}
