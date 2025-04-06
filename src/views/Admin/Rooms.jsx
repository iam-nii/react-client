import { HeroUIProvider, Tabs, Tab } from "@heroui/react";
import { useState } from "react";
import { useRoomContext } from "../../context/RoomContextProvider";

import AddDevice from "../../components/devices/AddDevice";
import AddRoom from "../../components/rooms/AddRoom";
// import axiosClient from "../../axiosClient";

//get all rooms on page load
function Rooms() {
  const [selected, setSelected] = useState("addRoom");
  const { rooms, setRooms, isLoading, setIsLoading } = useRoomContext();
  //   const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // useEffect(() => {
  //     setIsLoading(true);
  //     axiosClient
  //         .get("/rooms")
  //         .then(({ data }) => {
  //             console.log("Rooms API Response:", data); // Log the full response
  //             if (data.success && Array.isArray(data.data)) {
  //                 setRooms(data.data); // Set rooms if data.data is an array
  //             } else {
  //                 setError("Invalid data format for rooms");
  //             }
  //             setIsLoading(false);
  //         })
  //         .catch((error) => {
  //             setError(
  //                 error.response?.data?.message || "Error fetching rooms"
  //             );
  //             console.error("Rooms Fetch Error:", error);
  //             setIsLoading(false);
  //         });
  // }, []);

  // useEffect(() => {
  //     setIsLoading(true);
  //     axiosClient
  //         .get("/devices")
  //         .then(({ data }) => {
  //             console.log("Devices API Response:", data); // Log the full response
  //             if (data.success && Array.isArray(data.data)) {
  //                 // console.log(data.data);
  //                 setDevices(data.data); // Set devices if data.data is an array
  //             } else {
  //                 setError("Invalid data format for devices");
  //             }
  //             setIsLoading(false);
  //         })
  //         .catch((error) => {
  //             setError(
  //                 error.response?.data?.message || "Error fetching devices"
  //             );
  //             console.error("Devices Fetch Error:", error);
  //             setIsLoading(false);
  //         });
  // }, []);

  return (
    <HeroUIProvider>
      <Tabs
        fullWidth
        aria-label="Табы"
        selectedKey={selected}
        size="md"
        onSelectionChange={setSelected}
      >
        <Tab key="addRoom" title="Добавить помещение">
          <AddRoom
            // setSelected={setSelected}
            // rooms={Array.isArray(rooms) ? rooms : []} // Ensure rooms is an array
            setRooms={setRooms}
            setError={setError}
            setSuccess={setSuccess}
            isLoading={isLoading}
            error={error}
            success={success}
          />
        </Tab>
        <Tab key="addDevice" title="Добавить устройство">
          <AddDevice
            setSelected={setSelected}
            rooms={Array.isArray(rooms) ? rooms : []} // Ensure rooms is an array
            setError={setError}
            setSuccess={setSuccess}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            error={error}
            success={success}
          />
        </Tab>
      </Tabs>
    </HeroUIProvider>
  );
}

export default Rooms;
