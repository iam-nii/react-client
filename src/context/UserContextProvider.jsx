import { createContext, useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import axiosClient from "../axiosClient";

const UserContext = createContext({
  user: null,
  users: null,
  token: null,
  setUser: () => {},
  setUsers: () => {},
  setToken: () => {},
});

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState({
    user_id: null,
    userName: null,
    uEmail: null,
    uRole: null,
    uPosition: null,
    createdAt: null,
    updatedAt: null,
  });
  const [users, setUsers] = useState([]);
  const [token, _setToken] = useState(localStorage.getItem("ACCESS_TOKEN"));

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axiosClient.get("/api/users/");
        // console.log(data);
        setUsers(data.data);
        // console.log("Fetched users:", data.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const setToken = (newToken) => {
    _setToken(newToken);
    if (newToken) {
      localStorage.setItem("ACCESS_TOKEN", newToken);
    } else {
      localStorage.removeItem("ACCESS_TOKEN");
    }
  };

  return (
    <UserContext.Provider
      value={{ user, token, setUser, setToken, users, setUsers }}
    >
      {children}
    </UserContext.Provider>
  );
};

UserContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useUserContext = () => useContext(UserContext);
