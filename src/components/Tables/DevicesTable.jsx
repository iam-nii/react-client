import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
  Button,
  useDisclosure,
  ModalFooter,
  ModalBody,
  ModalHeader,
  ModalContent,
  Modal,
  Input,
  Alert,
} from "@heroui/react";
// import PropTypes from "prop-types";
import { DeleteIcon, EditIcon, EyeIcon } from "../../../public/Icons/Icons";
import { useDeviceContext } from "../../context/DeviceContexProvider";
import axiosClient from "../../axiosClient";
import { useRoomContext } from "../../context/RoomContextProvider";

const COLUMNS = [
  { name: "Идентификатор", uid: "deviceID" },
  { name: "Название", uid: "deviceName" },
  { name: "Зона", uid: "zoneNum" },
  { name: "Статус", uid: "status" },
  { name: "Интервал опроса, с", uid: "reqInterval" },
  { name: "Номер помещения", uid: "roomID" },
  { name: "Действия", uid: "actions" },
];

function DevicesTable() {
  // Modals
  // View Modal
  const {
    isOpen: isViewOpen,
    onOpen: onViewOpen,
    onOpenChange: onViewOpenChange,
  } = useDisclosure();
  //Edit Modal
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onOpenChange: onEditOpenChange,
    onClose: onEditClose,
  } = useDisclosure();
  // Delete Modal
  const {
    onOpen: onDeleteOpen,
    isOpen: isDeleteOpen,
    onOpenChange: onDeleteOpenChange,
    onClose: onDeleteClose,
  } = useDisclosure();

  const [selectedDevice, setSelectedDevice] = useState(null);
  const { devices, setDevices } = useDeviceContext();
  const [devicesWithRoomNumber, setDevicesWithRoomNumber] = useState(devices);
  const { rooms } = useRoomContext();
  const [editDevice, setEditDevice] = useState({
    deviceID: "",
    deviceName: "",
    zoneNum: "",
    status: "",
    roomID: "",
    reqInterval: "",
  });
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // get the room numbers given the device room id
    setDevicesWithRoomNumber(
      devices.map((device) => {
        const room = rooms.find((room) => room.roomID === device.roomID);
        return { ...device, roomID: room ? room.roomNumber : "" };
      })
    );
  }, [devices, rooms]);

  const renderCell = React.useCallback((device, columnKey) => {
    const cellValue = device[columnKey];
    switch (columnKey) {
      case "deviceID":
        return (
          <p className="font-bold text-small capitalize">{device.deviceID}</p>
        );
      case "deviceName":
        return <p className="text-small">{device.deviceName}</p>;
      case "zoneNum":
        return <p className="text-small">{device.zoneNum}</p>;
      case "status":
        return <p className="text-small">{device.status}</p>;
      case "reqInterval":
        return <p className="text-small">{device.reqInterval}</p>;
      case "roomID":
        return <p className="text-small">{device.roomID || ""}</p>;
      case "actions":
        return (
          <div className="relative flex items-center gap-5 justify-end">
            <Tooltip content="Просмотр">
              <span
                className="text-lg text-default-400 cursor-pointer active:opacity-50"
                onClick={() => {
                  setSelectedDevice(device);
                  onViewOpen();
                }}
              >
                <EyeIcon />
              </span>
            </Tooltip>
            <Tooltip content="Редактировать">
              <span
                className="text-lg text-default-400 cursor-pointer active:opacity-50"
                onClick={() => {
                  setSelectedDevice(device);
                  setEditDevice({
                    deviceID: device.deviceID,
                    deviceName: device.deviceName,
                    zoneNum: device.zoneNum,
                    status: device.status,
                    roomID: device.roomID,
                  });
                  onEditOpen();
                }}
              >
                <EditIcon />
              </span>
            </Tooltip>
            <Tooltip color="danger" content="Удалить">
              <span
                className="text-lg text-danger cursor-pointer active:opacity-50"
                onClick={() => {
                  setSelectedDevice(device);
                  onDeleteOpen();
                }}
              >
                <DeleteIcon />
              </span>
            </Tooltip>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  const handleEditDevice = () => {
    axiosClient
      // .patch(`/api/devices/?id=${selectedDevice.deviceID}`, editDevice)
      .patch(`/api/devices/?id=${selectedDevice.deviceID}`, editDevice)
      .then(({ data }) => {
        console.log(data);
        const index = devices.findIndex(
          (device) => device.deviceID === selectedDevice.deviceID
        );
        devices[index] = data.device;
        setDevices(devices);
        onEditClose();
        setError(null);
        setSuccess(data.message);
        setTimeout(() => {
          setSuccess(null);
        }, 3000);
      })
      .catch((error) => {
        console.log(error);
        setError(error.message);
        setSuccess(null);
        setTimeout(() => {
          setError(null);
        }, 3000);
      });
  };

  const handleDeleteDevice = () => {
    axiosClient
      // .delete(`/api/devices/?id=${selectedDevice.deviceID}`)
      .delete(`/api/devices/?id=${selectedDevice.deviceID}`)
      .then(({ data }) => {
        console.log(data);
        setDevices((devices) =>
          devices.filter(
            (device) => device.deviceID !== selectedDevice.deviceID
          )
        );
        setSuccess(data.message);
        onDeleteClose();
        setTimeout(() => {
          setSuccess(null);
        }, 3000);
      })
      .catch((error) => {
        console.log(error);
        setError(error.message);
        setTimeout(() => {
          setError(null);
        }, 3000);
      });
  };
  return (
    <div className="w-[80%] mx-auto mt-10">
      {success && <Alert color="success">{success}</Alert>}
      <Table
        aria-label="Учетные записи пользователей"
        selectionMode="single"
        className="mt-5"
      >
        <TableHeader columns={COLUMNS}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "end" : "start"}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          items={devicesWithRoomNumber}
          emptyContent={"Справочник устройств пустой"}
        >
          {(item) => (
            <TableRow key={item.deviceID}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      {/* Modal for Editing */}
      <Modal isOpen={isEditOpen} onOpenChange={onEditOpenChange}>
        <ModalContent>
          {(onEditClose) => (
            <>
              <ModalHeader>Редактировать устройство</ModalHeader>
              <ModalBody>
                {selectedDevice && (
                  <>
                    <Input
                      label="идентификатор устройства"
                      value={editDevice.deviceID}
                      onChange={(e) =>
                        setEditDevice({
                          ...editDevice,
                          deviceID: e.target.value,
                        })
                      }
                    />
                    <Input
                      label="Название"
                      value={editDevice.deviceName}
                      onChange={(e) =>
                        setEditDevice({
                          ...editDevice,
                          deviceName: e.target.value,
                        })
                      }
                    />
                    <Input
                      label="Зона"
                      value={editDevice.zoneNum}
                      onChange={(e) =>
                        setEditDevice({
                          ...editDevice,
                          zoneNum: e.target.value,
                        })
                      }
                    />
                    <Input
                      label="Статус"
                      value={editDevice.status}
                      type="number"
                      max={1}
                      min={0}
                      onChange={(e) =>
                        setEditDevice({
                          ...editDevice,
                          status: e.target.value,
                        })
                      }
                    />
                    <Input
                      label="Интервал опроса"
                      value={editDevice.reqInterval}
                      type="number"
                      max={1}
                      min={0}
                      onChange={(e) =>
                        setEditDevice({
                          ...editDevice,
                          reqInterval: e.target.value,
                        })
                      }
                    />
                    <Input
                      label="Помещение"
                      value={editDevice.roomID}
                      disabled
                    />
                    {error && <Alert color="danger">{error}</Alert>}
                  </>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onPress={onEditClose}>
                  Закрыть
                </Button>
                <Button color="success" onPress={handleEditDevice}>
                  Сохранить изменения
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      {/* Modal for Viewing */}
      <Modal isOpen={isViewOpen} onOpenChange={onViewOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Просмотр устройства</ModalHeader>
              <ModalBody>
                {selectedDevice && (
                  <>
                    <Input
                      label="идентификатор устройства"
                      value={selectedDevice.deviceID}
                      disabled
                    />
                    <Input
                      label="Название"
                      value={selectedDevice.deviceName}
                      disabled
                    />
                    <Input
                      label="Зона"
                      value={selectedDevice.zoneNum}
                      disabled
                    />
                    <Input
                      label="Статус"
                      value={selectedDevice.status}
                      disabled
                    />
                    <Input
                      label="Помещение"
                      value={selectedDevice.roomID}
                      disabled
                    />
                  </>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onPress={onClose}>
                  Закрыть
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      {/* Modal for deleting */}
      <Modal isOpen={isDeleteOpen} onOpenChange={onDeleteOpenChange}>
        <ModalContent>
          {(onDeleteClose) => (
            <>
              <ModalHeader>Удалить устройство</ModalHeader>
              <ModalBody>
                {selectedDevice && (
                  <>
                    <Input
                      label="идентификатор устройства"
                      value={selectedDevice.deviceID}
                      disabled
                    />
                    <Input
                      label="Название"
                      value={selectedDevice.deviceName}
                      disabled
                    />
                    <Input
                      label="Зона"
                      value={selectedDevice.zoneNum}
                      disabled
                    />
                    <Input
                      label="Статус"
                      value={selectedDevice.status}
                      disabled
                    />
                    <Input
                      label="Помещение"
                      value={selectedDevice.roomID}
                      disabled
                    />
                    <Alert color="warning">
                      Вы действительно хотите удалить это устройство?
                    </Alert>
                  </>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" onPress={handleDeleteDevice}>
                  Удалить
                </Button>
                <Button onPress={onDeleteClose} color="success">
                  Закрыть
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

export default DevicesTable;
