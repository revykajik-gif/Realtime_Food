// import { createContext, useContext, useMemo, useState, useEffect } from "react";
// import { api } from "../api/client";
// const AuthContext = createContext(null);


// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(() => {
// const saved = sessionStorage.getItem("user");
//     return saved ? JSON.parse(saved) : null;
//   });

//   // Reconnect socket on page refresh if user is already logged in
// const login = async (email, password) => {
//   const response = await api.post("/api/auth/login", {
//     email,
//     password,
//   });

//   const { token, user: nextUser } =
//     response.data.data;

// sessionStorage.setItem("token", token);
// sessionStorage.setItem("user", JSON.stringify(nextUser));

//   setUser(nextUser);
// };

//   const register = async (payload) => {
//     const response = await api.post("/api/auth/register", payload);
//     const { token, user: nextUser } = response.data.data;

// sessionStorage.setItem("token", token);
// sessionStorage.setItem("user", JSON.stringify(nextUser));
//     setUser(nextUser);
//   };

//   const logout = () => {
// sessionStorage.removeItem("token");
// sessionStorage.removeItem("user");
//     setUser(null);
//   };

//   const value = useMemo(
//     () => ({ user, login, register, logout }),
//     [user]
//   );

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);
import {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
} from "react";

import { api } from "../api/client";
import { socket } from "../api/socket";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = sessionStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const joinRooms = async (nextUser) => {
    if (!socket.connected) {
      socket.connect();
    }

    await new Promise((resolve) => {
      if (socket.connected) {
        resolve();
      } else {
        socket.once("connect", resolve);
      }
    });

    if (nextUser.role === "CUSTOMER") {
      socket.emit(
        "join-customer",
        nextUser.id
      );
    }

    if (
      nextUser.role ===
      "RESTAURANT_OWNER"
    ) {
      const restaurant =
        await api.get(
          "/api/restaurants/mine"
        );

      if (
        restaurant.data.data
      ) {
        socket.emit(
          "join-restaurant",
          restaurant.data.data.id
        );
      }
    }

    if (
      nextUser.role === "RIDER"
    ) {
      const rider =
        await api.get(
          "/api/riders/me"
        );

      if (
        rider.data.data
      ) {
        socket.emit(
          "join-rider",
          rider.data.data.id
        );
      }
    }
  };

  useEffect(() => {
    if (!user) return;

    joinRooms(user);
  }, [user]);

  const login = async (
    email,
    password
  ) => {
    const response =
      await api.post(
        "/api/auth/login",
        {
          email,
          password,
        }
      );

    const {
      token,
      user: nextUser,
    } = response.data.data;

    sessionStorage.setItem(
      "token",
      token
    );

    sessionStorage.setItem(
      "user",
      JSON.stringify(nextUser)
    );

    setUser(nextUser);
  };

  const register = async (
    payload
  ) => {
    const response =
      await api.post(
        "/api/auth/register",
        payload
      );

    const {
      token,
      user: nextUser,
    } = response.data.data;

    sessionStorage.setItem(
      "token",
      token
    );

    sessionStorage.setItem(
      "user",
      JSON.stringify(nextUser)
    );

    setUser(nextUser);
  };

  const logout = () => {
    socket.disconnect();

    sessionStorage.removeItem(
      "token"
    );

    sessionStorage.removeItem(
      "user"
    );

    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      login,
      register,
      logout,
    }),
    [user]
  );

  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () =>
  useContext(AuthContext);