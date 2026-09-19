import api from "./axios";

export const getServiceTypes = (params) =>
  api.get("/service-types", { params });

export const createServiceType = (data) => api.post("/service-types", data);
