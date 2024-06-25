import { useState, createContext } from "react";

export const LoginContext = createContext();

export const LoginProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dataLogin,setDataLogin] = useState(null)
  return (
    <LoginContext.Provider value={{ isLoggedIn, setIsLoggedIn,dataLogin,setDataLogin }}>
      {children}
    </LoginContext.Provider>
  );
};
