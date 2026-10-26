"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { fetchFavoriteTracks } from "../services/userService";
import { useSession } from "./SessionContext";

const FavoriteTracksContext = createContext({
  favoriteTracks: [],
  setFavoriteTracks: () => {},
  refresh: () => {},
  loading: false,
});

export function FavoriteTracksProvider({ children }) {
  const { user } = useSession();

  const [favoriteTracks, setFavoriteTracks] = useState([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!user?.id) {
      setFavoriteTracks([]);
      return;
    }

    try {
      setLoading(true);

      const tracks = await fetchFavoriteTracks(user.id);
      setFavoriteTracks(tracks || []);
    } catch (error) {
      console.error("Error fetching favorite tracks:", error);
      setFavoriteTracks([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <FavoriteTracksContext.Provider
      value={{
        favoriteTracks,
        setFavoriteTracks,
        refresh,
        loading,
      }}
    >
      {children}
    </FavoriteTracksContext.Provider>
  );
}

export function useFavoriteTracks() {
  return useContext(FavoriteTracksContext);
}
