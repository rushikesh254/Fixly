import { createContext, useContext, useState } from "react";

import savedList from "../data/savedList";

const SavedContext = createContext();

export const SavedProvider = ({ children }) => {
  const [savedServices, setSavedServices] = useState(savedList);

  // Function to check if a service is saved
  const isSaved = (id) => savedServices.some((s) => s.id === id);

  // Function to toggle saved status of a service
  const toggleSaved = (service) => {
    setSavedServices((prev) =>
      prev.some((s) => s.id === service.id)
        ? prev.filter((s) => s.id !== service.id)
        : [...prev, service],
    );
  };
  return (
    <SavedContext.Provider
      value={{ savedServices, setSavedServices, isSaved, toggleSaved }}
    >
      {children}
    </SavedContext.Provider>
  );
};

function useSaved() {
  return useContext(SavedContext);
}

export { useSaved };
