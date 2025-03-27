import { createContext, useEffect, useReducer } from "react";
import axios from "../helpers/axios";

const AuthContext = createContext();

let AuthReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_USER":
      localStorage.setItem("user", JSON.stringify(action.payload)); // Save user in localStorage
      return { user: action.payload };
    case "LOGOUT":
      localStorage.removeItem("user"); // Remove on logout
      return { user: null };
    default:
      return state;
  }
};

const AuthContextProvider = ({ children }) => {
  let [state, dispatch] = useReducer(AuthReducer, {
    user: JSON.parse(localStorage.getItem("user")) || null,
  });

  let getUser = async (token) => {
    try {
      let res = await axios.get("/user");

      if (res.data.status && res.data.data) {
        dispatch({ type: "LOGIN_USER", payload: res.data.data });
      } else {
        dispatch({ type: "LOGOUT" });
      }
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    let token = localStorage.getItem("accessToken");
    if (token) {
      getUser(token);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ getUser, dispatch, ...state }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthContextProvider };
