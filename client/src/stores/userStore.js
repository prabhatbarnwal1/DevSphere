import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

const URL = "https://devsphere-server-srn8.onrender.com";

export const useUserStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      setUser: (userData) => {
        set({
          user: userData,
          isAuthenticated: true,
        });
      },

      clearUser: () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user-storage");
        set({
          user: null,
          isAuthenticated: false,
        });
        get().___persist?.setOptions?.({
          name: "user-storage",
          skipHydration: true,
        });
      },

      hardReset: () => {
        try {
          // Clear all tokens
          localStorage.removeItem("accessToken");

          // Use Zustand's persist API to clear storage
          if (get().___persist?.clearStorage) {
            get().___persist.clearStorage();
          } else {
            // Fallback manual clearing
            localStorage.removeItem("user-storage");
          }

          // Reset state
          set({
            user: null,
            isAuthenticated: false,
          });
        } catch (error) {
          // Fallback: manual clearing
          localStorage.removeItem("accessToken");
          localStorage.removeItem("user-storage");
          set({
            user: null,
            isAuthenticated: false,
          });
        }
      },

      updateUser: (updates) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, ...updates } });
        }
      },

      initializeAuth: async () => {
        const isLoggingOut = sessionStorage.getItem("logging-out");
        if (isLoggingOut) {
          sessionStorage.removeItem("logging-out");
          return;
        }

        const accessToken = localStorage.getItem("accessToken");

        if (accessToken) {
          try {
            const response = await axios.get(`${URL}/api/auth/me`, {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            });

            if (response.status === 200) {
              set({
                user: response.data.user,
                isAuthenticated: true,
              });
              return;
            }
          } catch (error) {
            // Token is invalid, clear everything
            get().hardReset();
            return;
          }
        }

        // Try refresh token only if not logging out
        if (!sessionStorage.getItem("logging-out")) {
          try {
            const response = await axios.post(
              `${URL}/api/auth/refresh`,
              {},
              {
                withCredentials: true,
              }
            );

            if (response.status === 200) {
              localStorage.setItem("accessToken", response.data.accessToken);
              set({
                user: response.data.user,
                isAuthenticated: true,
              });
            }
          } catch (error) {
            // No valid refresh token, ensure clean state
            get().hardReset();
          }
        }
      },

      // Expose persist methods (will be set by middleware)
      ___persist: null,
    }),
    {
      name: "user-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      // CRITICAL FIX: Expose persist methods to the store
      onRehydrateStorage: () => (state, error) => {
        if (state && !error) {
          // Make persist methods available
          state.___persist = useUserStore.persist;
        }
      },
    }
  )
);
