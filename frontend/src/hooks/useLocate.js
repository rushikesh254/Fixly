import { useCallback, useState } from "react";
import providers from "../data/providers";

// Haversine formula to calculate distance between two coordinates

function getDistanceInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; //earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function useLocate() {
  const [status, setStatus] = useState("idle"); //idle , loading,success,denied
  const [userCoords, setUserCoords] = useState(null);

  // detect if geolocation is supported and get user location

  const detect = useCallback(() => {
    if (!navigator.geolocation) {
      setStatus("denied");
      return;
    }
    setStatus("loading");
    navigator.geolocation.getCurrentPosition(
      //success callback
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        setUserCoords({
          lat,
          lon,
        });
        setStatus("success");
      },
      //error callback
      () => {
        setStatus("denied");
      },
    );
  }, []);

  const clearLocation = useCallback(() => {
    setStatus("idle");
    setUserCoords(null);
  }, []);

  //return providers with distance if user location is available

  const nearbyProviders = (providersList) => {
    if (!userCoords) return providersList;
    return [...providersList]
      .filter((p) => p.lat !== null && p.lon !== null)
      .map((p) => ({
        ...p,
        distance: getDistanceInKm(userCoords.lat, userCoords.lon, p.lat, p.lon),
      }))
      .filter((p) => p.distance <= 400);
  };
  const nearbyProvidersList = nearbyProviders(providers);

  return { status, detect, clearLocation, nearbyProvidersList };
}
