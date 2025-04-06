import { createContext, useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import axiosClient from "../axiosClient";

const DeviceContext = createContext({
  devices: null,
  setDevices: () => {},
});

export const DeviceContextProvider = ({ children }) => {
  const [devices, setDevices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setIsLoading(true);
    axiosClient
      .get("/api/devices/")
      .then((res) => {
        setDevices(res.data.data || []);
        console.log(res.data.data);
      })
      .catch((error) => {
        console.error("Error fetching devices:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <DeviceContext.Provider
      value={{ devices, setDevices, isLoading, setIsLoading }}
    >
      {children}
    </DeviceContext.Provider>
  );
};

DeviceContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
export const useDeviceContext = () => useContext(DeviceContext);
