import { useState } from "react";
import axiosClient from "../../axiosClient";
import UsersTable from "../../components/Tables/UsersTable.jsx";
import { v4 as uuidv4 } from "uuid";
import { EyeIcon, EyeSlashFilledIcon } from "../../../public/Icons/Icons.jsx";
import {
  Alert,
  Autocomplete,
  AutocompleteItem,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  HeroUIProvider,
  useDisclosure,
} from "@heroui/react";
import { Spinner } from "@heroui/spinner";
import { useUserContext } from "../../context/UserContextProvider.jsx";

const ROLES = [
  { label: "Администратор", key: "admin" },
  { label: "Инженер по охране труда", key: "it" },
];

//get all users on page load
function Users() {
  const { users, setUsers, isLoading, setIsLoading } = useUserContext();
  const { onOpenChange, onClose, isOpen, onOpen } = useDisclosure();
  const [error, setError] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [success, setSuccess] = useState("");
  const [userData, setUserData] = useState({
    user_id: uuidv4(),
    userName: "",
    uEmail: "",
    uRole: "",
    uPosition: "",
    uPassword: "",
    uPassword_confirmation: "",
  });

  const handleAddUser = () => {
    console.log(userData);
    if (userData.uRole === "Администратор") {
      userData.uRole = "admin";
    } else {
      userData.uRole = "user";
    }
    setIsLoading(true);
    axiosClient
      .post("/api/auth/signup/", userData)
      .then(({ data }) => {
        setUsers([...users, data.user]);
        setError(null);

        //show the success message for 3 seconds
        setSuccess("Пользователь добавлен");
        setTimeout(() => {
          setSuccess("");
        }, 3000);
        onClose();
        setIsLoading(false);
      })
      .catch((error) => {
        if (
          error.response.data.message ===
          "The u password field must be at least 8 characters."
        ) {
          setError("Пароль должен быть не менее 8 символов");
        } else if (
          error.response.data.message ===
          "The u password field confirmation does not match."
        ) {
          setError("Пароли не совпадают");
        } else {
          setError("Ошибка добавления пользователя");
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  const toggleVisibility = () => setPasswordVisible(!passwordVisible);
  return (
    <HeroUIProvider>
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <Spinner size="lg" />
        </div>
      ) : (
        <>
          <div className="h-screen">
            <h1 className="text-2xl text-center font-bold">
              Справочник пользователей
            </h1>
            <div className="w-[90%] mt-5 flex justify-end">
              <Button onPress={onOpen} color="primary">
                Добавить пользователя
              </Button>
            </div>
            <UsersTable USERS={users} />
            {success && (
              <div className="flex justify-center items-center mt-5 w-[80%] mx-auto">
                <Alert color={"success"} title={success} />
              </div>
            )}
          </div>
          <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader>Добавить пользователя</ModalHeader>
                  <ModalBody>
                    <Input
                      label="ФИО пользователя"
                      isRequired
                      variant="bordered"
                      value={userData.userName}
                      onChange={(e) => {
                        setUserData((prev) => ({
                          ...prev,
                          userName: e.target.value,
                        }));
                      }}
                    />
                    <Input
                      label="Почта"
                      isRequired
                      variant="bordered"
                      type="email"
                      value={userData.uEmail}
                      onChange={(e) => {
                        setUserData((prev) => ({
                          ...prev,
                          uEmail: e.target.value,
                        }));
                      }}
                    />
                    <div className="">
                      <Autocomplete
                        className="w-full"
                        label="Роль"
                        value={userData.uRole}
                        isRequired
                        onSelectionChange={(e) => {
                          setUserData((prev) => ({
                            ...prev,
                            uRole: e,
                          }));
                        }}
                      >
                        {ROLES.map((role) => (
                          <AutocompleteItem key={role.key} value={role.key}>
                            {role.label}
                          </AutocompleteItem>
                        ))}
                      </Autocomplete>
                    </div>
                    <Input
                      label="Должность"
                      variant="bordered"
                      isRequired
                      maxLength={16}
                      value={userData.uPosition}
                      onChange={(e) => {
                        setUserData((prev) => ({
                          ...prev,
                          uPosition: e.target.value,
                        }));
                      }}
                    />
                    {/* Add toggle password visibility */}
                    <Input
                      label="Пароль"
                      variant="bordered"
                      type={passwordVisible ? "text" : "password"}
                      isRequired
                      value={userData.uPassword}
                      onChange={(e) => {
                        setUserData((prev) => ({
                          ...prev,
                          uPassword: e.target.value,
                        }));
                      }}
                      endContent={
                        <button
                          aria-label="toggle password visibility"
                          className="focus:outline-none"
                          type="button"
                          onClick={toggleVisibility}
                        >
                          {passwordVisible ? (
                            <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                          ) : (
                            <EyeIcon className="text-2xl text-default-400 pointer-events-none" />
                          )}
                        </button>
                      }
                    />
                    <Input
                      label="Подтвердить пароль"
                      variant="bordered"
                      type={passwordVisible ? "text" : "password"}
                      isRequired
                      value={userData.uPassword_confirmation}
                      onChange={(e) => {
                        setUserData((prev) => ({
                          ...prev,
                          uPassword_confirmation: e.target.value,
                        }));
                      }}
                      endContent={
                        <button
                          aria-label="toggle password visibility"
                          className="focus:outline-none"
                          type="button"
                          onClick={toggleVisibility}
                        >
                          {passwordVisible ? (
                            <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                          ) : (
                            <EyeIcon className="text-2xl text-default-400 pointer-events-none" />
                          )}
                        </button>
                      }
                    />
                    {error && (
                      <Alert
                        color={"danger"}
                        title={"Ошибка добавления пользователя"}
                        description={error}
                      />
                    )}
                  </ModalBody>
                  <ModalFooter>
                    <Button color="success" onPress={handleAddUser}>
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
        </>
      )}
    </HeroUIProvider>
  );
}

export default Users;
