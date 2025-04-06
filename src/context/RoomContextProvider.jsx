import { createContext, useContext, useEffect, useState } from "react";
import axiosClient from "../axiosClient";
import PropTypes from "prop-types";

const RoomContext = createContext({
  rooms: null,
  isLoading: false,
  setIsLoading: () => {},
  setRooms: () => {},
});

export const RoomContextProvider = ({ children }) => {
  const [rooms, setRooms] = useState([]);
  useEffect(() => {
    axiosClient.get("/api/rooms/").then((res) => {
      setRooms(res.data.data);
      console.log(res.data.data);
    });
  }, []);

  return (
    <RoomContext.Provider value={{ rooms, setRooms }}>
      {children}
    </RoomContext.Provider>
  );
};

RoomContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useRoomContext = () => useContext(RoomContext);
