import { createContext, useCallback, useContext, useEffect, useState } from "react";
import {
  addFavorite as addFavoriteApi,
  getFavorites as getFavoritesApi,
  removeFavorite as removeFavoriteApi,
} from "../api/users";
import { normalizeSavedService } from "../utils/normalize";
import { useAuth } from "./AuthContext";

const SavedContext = createContext();

export const SavedProvider = ({ children }) => {
  const { user } = useAuth();
  const [savedServices, setSavedServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    // saved services belong to an account, there is nothing to load for a visitor
    if (!user) {
      setSavedServices([]);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const { data } = await getFavoritesApi();
      setSavedServices(data.favorites.map(normalizeSavedService));
    } catch {
      setError("Could not load your saved services.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    // loads the saved list for the signed in account, and clears it on sign out
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
  }, [refresh]);

  // Function to check if a service is saved
  const isSaved = (id) => savedServices.some((s) => s.id === id);

  // Toggle the saved state, updating the list straight away and rolling the
  // change back if the request fails. Resolves with the new saved state.
  const toggleSaved = async (service) => {
    const id = service.id || service._id;
    const wasSaved = isSaved(id);

    setSavedServices((prev) =>
      wasSaved ? prev.filter((s) => s.id !== id) : [...prev, service],
    );

    try {
      if (wasSaved) {
        await removeFavoriteApi(id);
      } else {
        await addFavoriteApi(id);
      }
      return !wasSaved;
    } catch (err) {
      setSavedServices((prev) =>
        wasSaved ? [...prev, service] : prev.filter((s) => s.id !== id),
      );
      throw err;
    }
  };

  const removeSaved = async (id) => {
    const previous = savedServices;
    setSavedServices((prev) => prev.filter((s) => s.id !== id));

    try {
      await removeFavoriteApi(id);
    } catch (err) {
      setSavedServices(previous);
      throw err;
    }
  };

  return (
    <SavedContext.Provider
      value={{
        savedServices,
        setSavedServices,
        isSaved,
        toggleSaved,
        removeSaved,
        refresh,
        loading,
        error,
      }}
    >
      {children}
    </SavedContext.Provider>
  );
};

function useSaved() {
  return useContext(SavedContext);
}

// eslint-disable-next-line react-refresh/only-export-components
export { useSaved };
