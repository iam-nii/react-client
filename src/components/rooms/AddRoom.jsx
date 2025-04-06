import {
  Alert,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Spinner,
  useDisclosure,
} from "@heroui/react";
import { useEffect, useState } from "react";
import axiosClient from "../../axiosClient";
import PropTypes from "prop-types";
import RoomsTable from "../../components/Tables/RoomsTable";
import { useDeviceContext } from "../../context/DeviceContexProvider";

function AddRoom({ setError, setSuccess, isLoading, error, success }) {
  const [roomPayload, setRoomPayload] = useState({
    roomNumber: "",
    frPerson: "",
    location: "",
    height: "",
    width: "",
    length: "",
    area: "",
  });
  const { devices, setDevices } = useDeviceContext();
  const [freeDevices, setFreeDevices] = useState(null);
  const [devicePayload, setDevicePayload] = useState({
    deviceID: "null",
    deviceName: "",
    zoneNum: "0",
    status: "0",
    roomID: "0",
  });
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  useEffect(() => {
    if (devices && devices.length > 0) {
      setFreeDevices(devices.filter((device) => device.roomID === null));
    }
    console.log(devices);
  }, [devices]);
  useEffect(() => {
    setRoomPayload((prev) => ({
      ...prev,
      area: roomPayload.height * roomPayload.width * roomPayload.length,
    }));
  }, [roomPayload.height, roomPayload.width, roomPayload.length]);

  const handleAddRoom = () => {
    setError(null);
    const newPayload = {
      ...roomPayload,
      area: roomPayload.area,
    };
    console.log(devicePayload.deviceID);

    axiosClient
      // .post("/api/rooms/", newPayload)
      .post("/api/rooms/", newPayload)
      .then(({ data }) => {
        console.log(data);
        setDevicePayload((prev) => ({
          ...prev,
          roomID: data.roomID,
        }));
        setError(null);
        setSuccess(data.message);
        setTimeout(() => {
          setSuccess(null);
        }, 3000);

        const updatedDevices = devices.map((device) =>
          devicePayload.deviceID.includes(device.deviceID)
            ? { ...device, roomID: data.room.roomID }
            : device
        );
        setDevices(updatedDevices);
        if (devicePayload.deviceID !== "null") {
          axiosClient
            .patch(
              // `/pdn1/api/devices/?id=${devicePayload.deviceID}`,
              `/api/devices/?id=${devicePayload.deviceID}`,
              updatedDevices.find(
                (device) => device.deviceID === devicePayload.deviceID
              )
            )
            .then(({ data }) => {
              console.log(data);
              setError(null);
              setSuccess("Помещение и устройство добавлены");
              setTimeout(() => {
                setSuccess(null);
              }, 3000);
            })
            .catch((error) => {
              console.log(error);
              setError("Ошибка при добавлении устройства");
              setSuccess(null);
              setTimeout(() => {
                setError(null);
              }, 3000);
            });
        } else {
          // setError("Укажите устройство");
          // setTimeout(() => {
          //   setError(null);
          // }, 3000);
        }
      })
      .catch((error) => {
        const errorMessage = error;
        console.log(errorMessage);
        const errorError = error.response.data.error;

        if (errorError.includes("Duplicate entry")) {
          // Extract the room number from the error message
          const duplicateRoomNumber = errorError.match(/'([^']+)'/)[1];
          setError(`Номер помещения ${duplicateRoomNumber} уже существует.`);
          setTimeout(() => {
            setError(null);
          }, 3000);
          return;
        } else {
          setError("Ошибка добавления помещения.");
          setTimeout(() => {
            setError(null);
          }, 3000);
          return;
        }
      });
  };
  return (
    <div>
      <div className="flex justify-center items-center">
        <Button onPress={onOpen} color="primary" className="text-lg w-[90%]">
          Добавить помещение
        </Button>
      </div>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Добавить помещение</ModalHeader>
              <ModalBody>
                <Input
                  label="Номер помещения"
                  variant="bordered"
                  type="number"
                  value={roomPayload.roomNumber}
                  onChange={(e) => {
                    setRoomPayload((prev) => ({
                      ...prev,
                      roomNumber: e.target.value,
                    }));
                  }}
                />
                <Input
                  label="ФИО ответственного лица"
                  variant="bordered"
                  value={roomPayload.frPerson}
                  onChange={(e) => {
                    setRoomPayload((prev) => ({
                      ...prev,
                      frPerson: e.target.value,
                    }));
                  }}
                />
                <Input
                  label="Местоположение"
                  variant="bordered"
                  value={roomPayload.location}
                  onChange={(e) => {
                    setRoomPayload((prev) => ({
                      ...prev,
                      location: e.target.value,
                    }));
                  }}
                />
                <div className="flex flex-row gap-2">
                  <Input
                    label="Площадь"
                    disabled
                    variant="bordered"
                    value={roomPayload.area}
                  />
                  <Input
                    label="Высота"
                    type="number"
                    variant="bordered"
                    value={roomPayload.height}
                    onChange={(e) => {
                      setRoomPayload((prev) => ({
                        ...prev,
                        height: e.target.value,
                      }));
                    }}
                  />
                </div>
                <div className="flex flex-row gap-2">
                  <Input
                    label="Ширина"
                    type="number"
                    variant="bordered"
                    value={roomPayload.width}
                    onChange={(e) => {
                      setRoomPayload((prev) => ({
                        ...prev,
                        width: e.target.value,
                      }));
                    }}
                  />
                  <Input
                    label="Длина"
                    type="number"
                    variant="bordered"
                    value={roomPayload.length}
                    onChange={(e) => {
                      setRoomPayload((prev) => ({
                        ...prev,
                        length: e.target.value,
                      }));
                    }}
                  />
                </div>
                <Select
                  label="Выберите устройство"
                  selectionMode="multiple"
                  onChange={(e) => {
                    setDevicePayload((prev) => ({
                      ...prev,
                      deviceID: e.target.value,
                    }));
                  }}
                >
                  {freeDevices.map((device) => (
                    <SelectItem key={device.deviceID} value={device.deviceID}>
                      {device.deviceName}
                    </SelectItem>
                  ))}
                </Select>
                {error && (
                  <Alert
                    color={"danger"}
                    title={"Ошибка добавления помещения"}
                    description={error}
                  />
                )}
                {success && <Alert color={"success"} title={success} />}
              </ModalBody>
              <ModalFooter>
                <Button color="success" onPress={handleAddRoom}>
                  Добавить
                </Button>
                <Button color="primary" onPress={onClose}>
                  Отменить
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <Spinner size="lg" />
        </div>
      ) : (
        <RoomsTable isAdmin={true} />
      )}
    </div>
  );
}

AddRoom.propTypes = {
  setError: PropTypes.func.isRequired,
  setSuccess: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  error: PropTypes.string,
  success: PropTypes.string,
  setSelected: PropTypes.func.isRequired,
};

export default AddRoom;
