import { useCallback, useState } from "react";
import axios from "axios";

export function getDistanceInKm(lat1, lon1, lat2, lon2) {
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
        // the coordinates are enough for the nearby search, so the location
        // counts as detected even if the address lookup below fails
        setStatus("success");

        try {
          const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`;
          const res = await axios.get(url);
          setAddress(res.data.address);
        } catch {
          setAddress(null);
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

  // Attach the distance from the detected position to api results. The server
  // already filters and orders by proximity, this only supplies the label the
  // cards show.
  const withDistance = useCallback(
    (items = []) => {
      if (!userCoords) return items;

      return items.map((item) => {
        const coordinates = item.coordinates;
        if (!coordinates || coordinates.length !== 2) return item;

        // GeoJSON stores [longitude, latitude]
        const [lon, lat] = coordinates;
        return {
          ...item,
          distance: getDistanceInKm(userCoords.lat, userCoords.lon, lat, lon),
        };
      });
    },
    [userCoords],
  );

  return { status, address, userCoords, detect, clearLocation, withDistance };
}
