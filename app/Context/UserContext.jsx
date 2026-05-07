import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { UserEntity } from "../Entities/UserEntity";

const STORAGE_KEY = "tokusatsu-chronicle.user-session";
const UserContext = createContext(null);
const DEFAULT_ADMIN_USER = new UserEntity({
  id: "seed-admin-user",
  username: "adm",
  password: "adm123",
  createdAt: "2026-04-29T00:00:00.000Z",
  updatedAt: "2026-04-29T00:00:00.000Z"
});

function getStorageAdapter() {
  if (typeof globalThis !== "undefined" && globalThis.localStorage) {
    return {
      getItem: async (key) => globalThis.localStorage.getItem(key),
      setItem: async (key, value) => {
        globalThis.localStorage.setItem(key, value);
      }
    };
  }

  if (AsyncStorage?.getItem && AsyncStorage?.setItem) {
    return AsyncStorage;
  }

  return null;
}

function sanitizeUser(user) {
  if (!user) {
    return null;
  }

  return new UserEntity({
    id: user.id,
    username: user.username,
    password: user.password,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  });
}

function ensureAdminUser(users) {
  const normalizedUsers = users.map((user) => {
    if (user.username.toLowerCase() !== "adm") {
      return user;
    }

    return new UserEntity({
      id: DEFAULT_ADMIN_USER.id,
      username: DEFAULT_ADMIN_USER.username,
      password: DEFAULT_ADMIN_USER.password,
      createdAt: user.createdAt ?? DEFAULT_ADMIN_USER.createdAt,
      updatedAt: DEFAULT_ADMIN_USER.updatedAt
    });
  });

  const hasAdmin = normalizedUsers.some((user) => user.username.toLowerCase() === "adm");

  if (hasAdmin) {
    return normalizedUsers;
  }

  return [...normalizedUsers, DEFAULT_ADMIN_USER];
}

export function UserProvider({ children }) {
  const [users, setUsers] = useState([DEFAULT_ADMIN_USER]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    async function hydrateSession() {
      const storage = getStorageAdapter();

      if (!storage) {
        setUsers([DEFAULT_ADMIN_USER]);
        setCurrentUserId(null);
        setHydrated(true);
        return;
      }

      try {
        const raw = await storage.getItem(STORAGE_KEY);

        if (!raw) {
          setUsers([DEFAULT_ADMIN_USER]);
          setCurrentUserId(null);
          return;
        }

        const parsed = JSON.parse(raw);
        const nextUsers = ensureAdminUser(
          Array.isArray(parsed?.users) ? parsed.users.map(sanitizeUser).filter(Boolean) : []
        );

        setUsers(nextUsers);
        setCurrentUserId(parsed?.currentUserId ?? null);
      } catch {
        setUsers([DEFAULT_ADMIN_USER]);
        setCurrentUserId(null);
      } finally {
        setHydrated(true);
      }
    }

    hydrateSession();
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    const storage = getStorageAdapter();

    if (!storage) {
      return;
    }

    storage
      .setItem(
        STORAGE_KEY,
        JSON.stringify({
          users: ensureAdminUser(users),
          currentUserId
        })
      )
      .catch(() => {});
  }, [hydrated, users, currentUserId]);

  const currentUser = useMemo(() => {
    return users.find((user) => user.id === currentUserId) ?? null;
  }, [currentUserId, users]);

  const registerUser = (username, password) => {
    const trimmedUsername = username?.trim();

    if (!trimmedUsername || !password) {
      return { ok: false, message: "Preencha usuario e senha." };
    }

    const normalizedUsername = trimmedUsername.toLowerCase();
    const alreadyExists = users.some((user) => user.username.toLowerCase() === normalizedUsername);

    if (alreadyExists) {
      return { ok: false, message: "Este usuario ja existe." };
    }

    const timestamp = new Date().toISOString();
    const nextUser = new UserEntity({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      username: trimmedUsername,
      password,
      createdAt: timestamp,
      updatedAt: timestamp
    });

    setUsers((current) => [...current, nextUser]);
    setCurrentUserId(nextUser.id);

    return { ok: true, user: nextUser };
  };

  const loginUser = (username, password) => {
    const normalizedUsername = username?.trim()?.toLowerCase();
    const matchedUser = users.find(
      (user) => user.username.toLowerCase() === normalizedUsername && user.password === password
    );

    if (!matchedUser) {
      return { ok: false, message: "Usuario ou senha invalidos." };
    }

    setCurrentUserId(matchedUser.id);
    return { ok: true, user: matchedUser };
  };

  const logoutUser = () => {
    setCurrentUserId(null);
  };

  return (
    <UserContext.Provider
      value={{
        hydrated,
        users,
        currentUser,
        isAuthenticated: Boolean(currentUser),
        registerUser,
        loginUser,
        logoutUser
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser must be used inside UserProvider.");
  }

  return context;
}