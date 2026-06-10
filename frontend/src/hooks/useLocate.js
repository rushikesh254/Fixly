import { useCallback, useState } from "react";
import providers from "../data/providers";
import axios from "axios";

function getDistanceInKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
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
  const [status, setStatus] = useState("idle");
  const [userCoords, setUserCoords] = useState(null);
  const [address, setAddress] = useState(null);

  const detect = useCallback(() => {
    if (!navigator.geolocation) {
      setStatus("denied");
      return;
    }
    setStatus("loading");
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        setUserCoords({
          lat,
          lon,
        });

        try {
          const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`;
          const res = await axios.get(url);
          console.log(res.data.address);
          setAddress(res.data.address);
          setStatus("success");
        } catch (e) {
          {
            console.log(e);
            setStatus("denied");
          }
        }
      },
      () => {
        setStatus("denied");
      },
    );
  }, []);

  const clearLocation = useCallback(() => {
    setStatus("idle");
    setUserCoords(null);
    setAddress(null);
  }, []);

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

  return { status, address, detect, clearLocation, nearbyProvidersList };
}
