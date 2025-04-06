import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Input,
    Select,
    SelectItem,
    useDisclosure,
    Switch,
} from "@heroui/react";
import { useUserContext } from "../../context/UserContextProvider";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import axiosClient from "../../axiosClient";

function EditRegulations() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const { user } = useUserContext();
    const [parameters, setParameters] = useState(null);
    const [userData, setUserData] = useState(null);
    const [payload, setPayload] = useState({
        userID: "",
        paramID: "",
        send_msg: false,
        minValue: "",
        maxValue: "",
        deviceID: "",
    });
    useEffect(() => {
        setUserData(user);
    }, [user]);
    useEffect(() => {
        axiosClient.get("/parameters").then(({ data }) => {
            setParameters(data);
        });
    }, []);
    const handleParamSelection = (keys) => {
        const selectedParamID = Array.from(keys)[0];
        console.log(selectedParamID);
        setPayload((prev) => ({ ...prev, paramID: selectedParamID }));
        const selectedParam = parameters.find(
            (param) => param.paramID === selectedParamID
        );
        if (selectedParam) {
            console.log(selectedParam);
            setPayload((prev) => ({
                ...prev,
                minValue: selectedParam.minValue || "",
                maxValue: selectedParam.maxValue || "",
            }));
        }
    };

    const handleSubmit = () => {
        setPayload((prev) => ({
            ...prev,
            userID: userData.user_id,
        }));
        console.log(payload);
    };
    return (
        <div className="w-[70%] mx-auto flex flex-col gap-2">
            <Button onPress={onOpen} className="text-lg font-bold">
                Редактировать регламент
            </Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onclose) => (
                        <>
                            <ModalHeader>Настройки регламента</ModalHeader>
                            <ModalBody>
                                <div>
                                    <Input
                                        label="ID пользователя"
                                        variant="bordered"
                                        isDisabled
                                        value={userData.user_id}
                                    />
                                </div>
                                <div>
                                    <Select
                                        label="Параметр"
                                        onSelectionChange={handleParamSelection}
                                    >
                                        {parameters.map((parameter) => (
                                            <SelectItem
                                                key={parameter.paramID}
                                                value={parameter.paramID}
                                            >
                                                {parameter.parameter_name}
                                            </SelectItem>
                                        ))}
                                    </Select>
                                </div>
                                <div className="flex flex-row gap-2">
                                    <Input
                                        label="Минимальное значение"
                                        type="number"
                                        value={payload.minValue}
                                        onChange={(e) => {
                                            setPayload((prev) => ({
                                                ...prev,
                                                minValue: e.target.value,
                                            }));
                                        }}
                                    />
                                    <Input
                                        label="Максимальное значение"
                                        type="number"
                                        value={payload.maxValue}
                                        onChange={(e) => {
                                            setPayload((prev) => ({
                                                ...prev,
                                                maxValue: e.target.value,
                                            }));
                                        }}
                                    />
                                </div>
                                <div>
                                    <Select
                                        label="ID устройства"
                                        onSelectionChange={(keys) => {
                                            setPayload((prev) => ({
                                                ...prev,
                                                deviceID: Array.from(keys)[0],
                                            }));
                                        }}
                                    >
                                        <SelectItem value="1">1</SelectItem>
                                        <SelectItem value="2">2</SelectItem>
                                        <SelectItem value="3">3</SelectItem>
                                    </Select>
                                </div>
                                <div>
                                    <Switch
                                        isSelected={payload.send_msg}
                                        value={payload.send_msg}
                                        onValueChange={(value) => {
                                            setPayload((prev) => ({
                                                ...prev,
                                                send_msg: value,
                                            }));
                                        }}
                                    >
                                        <p className="text-sm">
                                            Отправлять сообщение
                                        </p>
                                    </Switch>
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="success" onPress={handleSubmit}>
                                    Сохранить
                                </Button>
                                <Button color="primary" onPress={onclose}>
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

EditRegulations.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onOpenChange: PropTypes.func.isRequired,
};

export default EditRegulations;
