import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Tooltip,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Input,
  Select,
  Button,
} from "@heroui/react";
import PropTypes from "prop-types";
import { DeleteIcon, EditIcon, EyeIcon } from "../../../public/Icons/Icons";
import { useUserContext } from "../../context/UserContextProvider";
import { useRoomContext } from "../../context/RoomContextProvider";

const statusColorMap = {
  admin: "success",
  user: "primary",
};
const COLUMNS = [
  { name: "ФИО пользователя", uid: "userName" },
  { name: "Email", uid: "uEmail" },
  { name: "Роль", uid: "uRole" },
  { name: "Должность", uid: "uPosition" },
  { name: "Действия", uid: "actions" },
];

function UsersTable() {
  const { users } = useUserContext();
  const { rooms } = useRoomContext();
  const [selectedUser, setSelectedUser] = useState(null);
  const [users_, setUsers_] = useState([]);
  const [edittedUser, setEdittedUser] = useState(null);

  useEffect(() => {
    const updateUsers = users_.map((user) => {
      const matchedRooms = [];
      rooms.forEach((room) => {
        if (room.frPerson === user.userName) {
          matchedRooms.push({
            ...room,
            roomNumber: room.roomNumber,
          });
        }
      });
      return { ...user, room: matchedRooms }; // Add matched rooms to the user object
    });
    setUsers_(updateUsers); // Update the state
  }, []); // Only depend on `rooms`
  useEffect(() => {
    console.log("users_", users_);
  }, [users_]);
  const {
    isOpen: isViewOpen,
    onOpen: onViewOpen,
    onClose: onViewClose,
    onOpenChange: onViewOpenChange,
  } = useDisclosure();

  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
    onOpenChange: onEditOpenChange,
  } = useDisclosure();

  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
    onOpenChange: onDeleteOpenChange,
  } = useDisclosure();
  const renderCell = React.useCallback((user, columnKey) => {
    const cellValue = user[columnKey];
    switch (columnKey) {
      case "userName":
        return (
          <p className="font-bold text-small capitalize">{user.userName}</p>
        );
      case "uEmail":
        return <p className="text-small">{user.uEmail}</p>;
      case "uRole":
        return (
          <div className="flex flex-col">
            <Chip
              className="capitalize"
              color={statusColorMap[user.uRole]}
              size="sm"
              variant="flat"
            >
              {user.uRole}
            </Chip>
          </div>
        );
      case "actions":
        return (
          <div className="relative flex items-center gap-5 justify-end">
            <Tooltip content="Просмотр">
              <span
                className="text-lg text-default-400 cursor-pointer active:opacity-50"
                onClick={() => {
                  setSelectedUser(user);
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
                  setSelectedUser(user);
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
                  setSelectedUser(user);
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
  return (
    <>
      <div className="w-[80%] mx-auto mt-5">
        <Table aria-label="Учетные записи пользователей">
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
            items={users}
            emptyContent={"Справочник пользователей пустой"}
          >
            {(item) => (
              <TableRow key={item.user_id}>
                {(columnKey) => (
                  <TableCell>{renderCell(item, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Modal isOpen={isViewOpen} onOpenChange={onViewOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                <h1>Просмотр данных пользователя</h1>
              </ModalHeader>
              <ModalBody>
                <Input label="ФИО пользователя" value={selectedUser.userName} />
                <Input label="Email" value={selectedUser.uEmail} disabled />
                <Input label="Роль" value={selectedUser.uRole} disabled />
                <Input
                  label="Должность"
                  value={selectedUser.uPosition}
                  disabled
                />
                <Select
                  label="Помещение"
                  items={selectedUser.room}
                  itemKey="roomNumber"
                  itemValue="roomNumber"
                  disabled
                />
                <Button onPress={onViewClose}>Закрыть</Button>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

UsersTable.propTypes = {
  USERS: PropTypes.arrayOf(
    PropTypes.shape({
      user_id: PropTypes.string.isRequired,
      userName: PropTypes.string.isRequired,
      uEmail: PropTypes.string.isRequired,
      uRole: PropTypes.string.isRequired,
      uPosition: PropTypes.string.isRequired,
    })
  ),
};

export default UsersTable;
