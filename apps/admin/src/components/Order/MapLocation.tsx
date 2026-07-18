import {
  Check,
  ExternalLink,
  MapIcon,
  MapPin,
  Navigation,
  Share2,
} from "lucide-react";
import React, { useState } from "react";

interface MapLocationProps {
  latitude: string;
  longitude: string;
  address?: string;
  customerName?: string;
}

const MapLocation: React.FC<MapLocationProps> = ({
  latitude,
  longitude,
  address,
  customerName,
}) => {
  const [copied, setCopied] = useState(false);

  // Check if coordinates are available
  const isLocationAvailable =
    latitude &&
    longitude &&
    latitude.toLowerCase() !== "none" &&
    latitude.toLowerCase() !== "n/a" &&
    longitude.toLowerCase() !== "none" &&
    longitude.toLowerCase() !== "n/a";

  // Generate Google Maps URLs
  const getGoogleMapsEmbedUrl = (lat: string, lng: string): string => {
    return `https://maps.google.com/maps?q=${lat},${lng}&hl=en&z=16&output=embed`;
  };

  const getGoogleMapsUrl = (lat: string, lng: string): string => {
    return `https://www.google.com/maps?q=${lat},${lng}`;
  };

  const getDirectionsUrl = (lat: string, lng: string): string => {
    return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  };

  // Share location
  const shareLocation = async (): Promise<void> => {
    const locationUrl = getGoogleMapsUrl(latitude, longitude);
    const shareText = `📍 Delivery Location${customerName ? ` for ${customerName}` : ""}${address ? `\n🏠 ${address}` : ""}\n📌 ${locationUrl}`;

    // Try native share first, fallback to copy
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Delivery Location${customerName ? ` - ${customerName}` : ""}`,
          text: shareText,
          url: locationUrl,
        });
        return;
      } catch (err) {
        // User cancelled or share failed, continue to copy
      }
    }

    // Fallback to copy
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to share location:", err);
    }
  };

  // No location available state
  if (!isLocationAvailable) {
    return (
      <div className="bg-[var(--eerie-black-2)] border border-[var(--eerie-black-4)] rounded-xl p-6 text-center">
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--quick-silver)]/10">
          <MapIcon size={24} className="text-[var(--quick-silver)]" />
        </div>
        <h3 className="text-lg font-semibold text-[var(--white)] mb-2">
          Location Not Available
        </h3>
        <p className="text-[var(--quick-silver)] text-sm">
          Map location is not available for this order. Please contact the
          customer directly for delivery details.
        </p>
        {address && (
          <div className="mt-4 p-3 bg-[var(--eerie-black-3)] rounded-lg border border-[var(--eerie-black-4)]">
            <div className="flex items-start gap-3">
              <MapPin
                size={16}
                className="text-[var(--gold-crayola)] mt-0.5 flex-shrink-0"
              />
              <p className="text-[var(--white)] text-sm leading-relaxed flex-1">
                {address}
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-[var(--eerie-black-2)] border border-[var(--eerie-black-4)] rounded-xl overflow-hidden shadow-lg">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-[var(--eerie-black-4)]">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--gold-crayola)]/10">
          <MapPin size={20} className="text-[var(--gold-crayola)]" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-[var(--white)]">
            Delivery Location
          </h3>
          <p className="text-[var(--quick-silver)] text-sm">
            Customer's delivery address
          </p>
        </div>
      </div>

      <div className="p-4">
        {/* Address Info */}
        {address && (
          <div className="mb-4 p-3 bg-[var(--eerie-black-3)] rounded-lg border border-[var(--eerie-black-4)]">
            <div className="flex items-start gap-3">
              <MapPin
                size={16}
                className="text-[var(--gold-crayola)] mt-0.5 flex-shrink-0"
              />
              <p className="text-[var(--white)] text-sm leading-relaxed flex-1">
                {address}
              </p>
            </div>
          </div>
        )}

        {/* Coordinates */}
        <div className="mb-4 text-[var(--quick-silver)] text-sm">
          <span className="text-[var(--white)] font-medium">Coordinates: </span>
          <span className="font-mono bg-[var(--eerie-black-3)] px-2 py-1 rounded text-[var(--gold-crayola)] text-xs">
            {latitude}, {longitude}
          </span>
        </div>

        {/* Google Maps Iframe */}
        <div className="relative w-full rounded-xl overflow-hidden shadow-lg mb-4">
          <div className="aspect-[4/3]">
            <iframe
              src={getGoogleMapsEmbedUrl(latitude, longitude)}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Delivery Location"
              className="w-full h-full"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <a
            href={getDirectionsUrl(latitude, longitude)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center flex-wrap gap-2 px-4 py-3 bg-[var(--gold-crayola)] text-[var(--smoky-black-1)] rounded-lg hover:bg-[var(--gold-crayola)]/90 transition-all active:scale-90 font-medium"
          >
            <Navigation size={18} />
            Directions
          </a>
          <button
            onClick={shareLocation}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-[var(--eerie-black-3)] border border-[var(--eerie-black-4)] text-[var(--white)] rounded-lg hover:bg-[var(--eerie-black-4)] transition-all active:scale-95 font-medium"
          >
            {copied ? <Check size={18} /> : <Share2 size={18} />}
            {copied ? "Copied!" : "Share"}
          </button>
        </div>

        {/* Open in Maps Link */}
        <div className="text-center">
          <a
            href={getGoogleMapsUrl(latitude, longitude)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[var(--gold-crayola)] hover:text-[var(--gold-crayola)]/80 text-sm underline transition-colors active:scale-95"
          >
            <ExternalLink size={12} />
            Open in Google Maps
          </a>
        </div>
      </div>
    </div>
  );
};

export default MapLocation;
