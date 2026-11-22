/**
 * Utility to extract latitude and longitude from Google Maps URLs,
 * coordinate strings, or coordinate objects.
 */
function parseCoordinates(input) {
  if (!input) return null;

  // If already an object with lat/lng or latitude/longitude
  if (typeof input === 'object') {
    const lat = Number(input.lat !== undefined ? input.lat : input.latitude);
    const lng = Number(
      input.lng !== undefined
        ? input.lng
        : input.longitude !== undefined
        ? input.longitude
        : input.langitude
    );
    if (!isNaN(lat) && !isNaN(lng) && (lat !== 0 || lng !== 0)) {
      return { lat: Number(lat.toFixed(7)), lng: Number(lng.toFixed(7)) };
    }
    return null;
  }

  const str = String(input).trim();
  if (!str) return null;

  // 1. Exact place pin in Google Maps URL (!3d<lat>!4d<lng>)
  // Often multiple exist in the URL (context + target). The last pair represents the selected pin!
  const pinRegex = /!3d(-?\d+(?:\.\d+)?)(?:.*?)[!&]4d(-?\d+(?:\.\d+)?)/g;
  let lastPinMatch = null;
  let match;
  while ((match = pinRegex.exec(str)) !== null) {
    lastPinMatch = match;
  }
  if (lastPinMatch) {
    const lat = parseFloat(lastPinMatch[1]);
    const lng = parseFloat(lastPinMatch[2]);
    if (!isNaN(lat) && !isNaN(lng)) {
      return { lat: Number(lat.toFixed(7)), lng: Number(lng.toFixed(7)) };
    }
  }

  // 2. Query param (q=lat,lng or query=lat,lng or ll=lat,lng)
  const qMatch = str.match(/[?&](?:q|query|ll)=(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/i);
  if (qMatch) {
    const lat = parseFloat(qMatch[1]);
    const lng = parseFloat(qMatch[2]);
    if (!isNaN(lat) && !isNaN(lng)) {
      return { lat: Number(lat.toFixed(7)), lng: Number(lng.toFixed(7)) };
    }
  }

  // 3. Viewport center (@lat,lng) in Google Maps URL
  const atMatch = str.match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);
  if (atMatch) {
    const lat = parseFloat(atMatch[1]);
    const lng = parseFloat(atMatch[2]);
    if (!isNaN(lat) && !isNaN(lng)) {
      return { lat: Number(lat.toFixed(7)), lng: Number(lng.toFixed(7)) };
    }
  }

  // 4. Plain comma-separated coords: "26.5024868, 80.318637"
  const commaMatch = str.match(/(-?\d{1,3}(?:\.\d+)?)\s*,\s*(-?\d{1,3}(?:\.\d+)?)/);
  if (commaMatch) {
    const lat = parseFloat(commaMatch[1]);
    const lng = parseFloat(commaMatch[2]);
    if (!isNaN(lat) && !isNaN(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180) {
      return { lat: Number(lat.toFixed(7)), lng: Number(lng.toFixed(7)) };
    }
  }

  return null;
}

const KNOWN_GEO = {
  'civil lines': { lat: 26.474, lng: 80.335 },
  'swaroop nagar': { lat: 26.482, lng: 80.315 },
  'vip road': { lat: 26.479, lng: 80.342 },
  'tilak nagar': { lat: 26.471, lng: 80.32 },
  'kanpur': { lat: 26.4499, lng: 80.3319 },
  'delhi': { lat: 28.6139, lng: 77.209 },
  'new delhi': { lat: 28.6015, lng: 77.2285 },
  'golf links': { lat: 28.599, lng: 77.234 },
  'mumbai': { lat: 19.076, lng: 72.8777 },
  'worli': { lat: 19.0178, lng: 72.8178 },
  'bandra': { lat: 19.0596, lng: 72.8295 },
  'dubai': { lat: 25.2048, lng: 55.2708 },
  'palm jumeirah': { lat: 25.1124, lng: 55.139 },
  'marina': { lat: 25.0805, lng: 55.1403 },
  'hyderabad': { lat: 17.385, lng: 78.4867 },
  'jubilee hills': { lat: 17.4319, lng: 78.4073 },
  'goa': { lat: 15.2993, lng: 74.124 },
  'bangalore': { lat: 12.9716, lng: 77.5946 },
  'bengaluru': { lat: 12.9716, lng: 77.5946 },
  'california': { lat: 34.0522, lng: -118.2437 },
  'beverly hills': { lat: 34.0736, lng: -118.4004 },
  'new york': { lat: 40.7128, lng: -74.006 },
  'manhattan': { lat: 40.7831, lng: -73.9712 },
  'miami': { lat: 25.7617, lng: -80.1918 },
  'miami beach': { lat: 25.7907, lng: -80.13 },
  'aspen': { lat: 39.1911, lng: -106.8175 },
};

/**
 * Resolves coordinates deterministically from available inputs:
 * 1. Google Maps URL or string (mapUrl, mapLocation, or locationUrl)
 * 2. Explicit coordinates object or latitude/longitude numbers
 * 3. Text location matching KNOWN_GEO (deterministic, NO random jitter!)
 * 4. Default fallback: Kanpur Civil Lines (26.474, 80.335)
 */
function resolveCoordinates({ mapUrl, location, coordinates, latitude, longitude, langitude } = {}) {
  // 1. Try Google Maps URL / map string
  if (mapUrl) {
    const parsed = parseCoordinates(mapUrl);
    if (parsed) return parsed;
  }

  // 2. Check if location itself is a URL or coordinates string
  if (typeof location === 'string' && (location.includes('google.com/maps') || location.includes('maps.app.goo.gl') || location.includes('http'))) {
    const parsed = parseCoordinates(location);
    if (parsed) return parsed;
  }

  // 3. Check explicit coordinates object
  if (coordinates && typeof coordinates === 'object') {
    const parsed = parseCoordinates(coordinates);
    if (parsed) return parsed;
  }

  // 4. Check explicit latitude/longitude numbers
  if (latitude !== undefined || longitude !== undefined || langitude !== undefined) {
    const lat = Number(latitude);
    const lng = Number(longitude !== undefined ? longitude : langitude);
    if (!isNaN(lat) && !isNaN(lng) && (lat !== 0 || lng !== 0)) {
      return { lat: Number(lat.toFixed(7)), lng: Number(lng.toFixed(7)) };
    }
  }

  // 5. Match location name against known cities/neighborhoods (NO random jitter!)
  const locStr = (
    typeof location === 'string'
      ? location
      : `${location?.city || ''} ${location?.address || ''} ${location?.state || ''}`
  ).toLowerCase();

  for (const [key, coords] of Object.entries(KNOWN_GEO)) {
    if (locStr.includes(key)) {
      return { lat: coords.lat, lng: coords.lng };
    }
  }

  // 6. Default fallback
  return { lat: 26.474, lng: 80.335 };
}

module.exports = {
  parseCoordinates,
  resolveCoordinates,
  KNOWN_GEO,
};
