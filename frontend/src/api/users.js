import api from "./axios";

// saved services
export const getFavorites = () => api.get("/users/me/favorites");

export const addFavorite = (serviceId) =>
  api.post("/users/me/favorites", { serviceId });

export const removeFavorite = (serviceId) =>
  api.delete(`/users/me/favorites/${serviceId}`);

// the single address of the account
export const getAddress = () => api.get("/users/me/address");

// saves the first address and edits it afterwards
export const saveAddress = (data) => api.put("/users/me/address", data);

export const deleteAddress = () => api.delete("/users/me/address");

// dashboard activity feed
export const getMyActivities = () => api.get("/users/me/activities");

// account deletion ( soft delete on the server )
export const deleteAccount = () => api.delete("/users/me");
