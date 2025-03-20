import React, { useState, useContext, createContext } from "react";
import { login, logout, getUser } from "../api/authService";

const AuthContext = createContext();

export function AuthProvider(props) {
  const value = useProvideAuth();

  return (
    <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

function useProvideAuth() {
  const [user, setUser] = useState(null);

  const [signinError, setSigninError] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  async function isUser() {
    setIsLoading(true);

    try {
      let { data } = await getUser();
      setUser(data.user);
    } catch (error) {
      setUser(null);
    }

    setIsLoading(false);

  }

  function signin({ password, email }) {
    setIsLoading(true);

    if (!email) {
      setIsLoading(false);
      return setSigninError(["An email must be provided"]);
    }

    if (!password) {
      setIsLoading(false);
      return setSigninError(["A password must be provided"]);
    }

    const regex = new RegExp(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g);
    if (!regex.test(email)) {
      setIsLoading(false);
      return setSigninError(["Must enter a valid email"]);
    }

    return login({ email, password }).then(({ data }) => {
      setIsLoading(false);

      if (!data.error) {
        setUser(data.user);
        setSigninError([]);
      } else setSigninError([data.error]);
    }).catch((err) => {
      setIsLoading(false);
      setSigninError([err.response.data.error]);
    });
  }

  function signout() {
    return logout().then(({ data }) => {
      if (data.success)
        setUser(null);
    }).catch((err) => console.log(err));
  }

  return {
    isUser,
    user,
    signin,
    signout,
    isLoading,
    signinError,
    setSigninError,
  };
}