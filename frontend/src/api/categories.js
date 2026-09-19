import api from "./axios";

export const getCategories = () => api.get("/categories");

export const createCategory = (name) => api.post("/categories", { name });
