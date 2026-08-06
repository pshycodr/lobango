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
      <div className="rounded-xl border border-(--eerie-black-4) bg-(--eerie-black-2) p-6 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-(--quick-silver)/10">
          <MapIcon size={24} className="text-(--quick-silver)" />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-(--white)">
          Location Not Available
        </h3>
        <p className="text-sm text-(--quick-silver)">
          Map location is not available for this order. Please contact the
          customer directly for delivery details.
        </p>
        {address && (
          <div className="mt-4 rounded-lg border border-(--eerie-black-4) bg-(--eerie-black-3) p-3">
            <div className="flex items-start gap-3">
              <MapPin
                size={16}
                className="mt-0.5 shrink-0 text-(--gold-crayola)"
              />
              <p className="flex-1 text-sm leading-relaxed text-(--white)">
                {address}
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-(--eerie-black-4) bg-(--eerie-black-2) shadow-lg">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-(--eerie-black-4) p-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-(--gold-crayola)/10">
          <MapPin size={20} className="text-(--gold-crayola)" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-(--white)">
            Delivery Location
          </h3>
          <p className="text-sm text-(--quick-silver)">
            Customer's delivery address
          </p>
        </div>
      </div>

      <div className="p-4">
        {/* Address Info */}
        {address && (
          <div className="mb-4 rounded-lg border border-(--eerie-black-4) bg-(--eerie-black-3) p-3">
            <div className="flex items-start gap-3">
              <MapPin
                size={16}
                className="mt-0.5 shrink-0 text-(--gold-crayola)"
              />
              <p className="flex-1 text-sm leading-relaxed text-(--white)">
                {address}
              </p>
            </div>
          </div>
        )}

        {/* Coordinates */}
        <div className="mb-4 text-sm text-(--quick-silver)">
          <span className="font-medium text-(--white)">Coordinates: </span>
          <span className="rounded bg-(--eerie-black-3) px-2 py-1 font-mono text-xs text-(--gold-crayola)">
            {latitude}, {longitude}
          </span>
        </div>

        {/* Google Maps Iframe */}
        <div className="relative mb-4 w-full overflow-hidden rounded-xl shadow-lg">
          <div className="aspect-4/3">
            <iframe
              src={getGoogleMapsEmbedUrl(latitude, longitude)}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Delivery Location"
              className="h-full w-full"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mb-4 grid grid-cols-2 gap-3">
          <a
            href={getDirectionsUrl(latitude, longitude)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-wrap items-center justify-center gap-2 rounded-lg bg-(--gold-crayola) px-4 py-3 font-medium text-(--smoky-black-1) transition-all hover:bg-(--gold-crayola)/90 active:scale-90"
          >
            <Navigation size={18} />
            Directions
          </a>
          <button
            onClick={shareLocation}
            className="flex items-center justify-center gap-2 rounded-lg border border-(--eerie-black-4) bg-(--eerie-black-3) px-4 py-3 font-medium text-(--white) transition-all hover:bg-(--eerie-black-4) active:scale-95"
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
            className="inline-flex items-center gap-1 text-sm text-(--gold-crayola) underline transition-colors hover:text-(--gold-crayola)/80 active:scale-95"
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
