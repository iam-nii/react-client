import {
    Alert,
    Autocomplete,
    Button,
    TextField,
    Typography,
} from "@mui/material";
import { indigo } from "@mui/material/colors";
import "@fontsource/roboto/300.css";
import { Link, useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import { useUserContext } from "../context/UserContextProvider";
import axiosClient from "../axiosClient";
import { v4 as uuidv4 } from "uuid";

function SignUp() {
    const roles = ["Администратор", "Инженер по охране труда"];
    const { setUser, setToken } = useUserContext();
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const loginRef = useRef(null);
    const emailRef = useRef(null);
    const roleRef = useRef(null);
    const positionRef = useRef(null);
    const passwordRef = useRef(null);
    const passwordConfirmationRef = useRef(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError(null);
        if (roleRef.current.value === "Администратор") {
            roleRef.current.value = "admin";
        } else {
            roleRef.current.value = "user";
        }
        const payload = {
            user_id: uuidv4(),
            userName: loginRef.current.value,
            uEmail: emailRef.current.value,
            uPosition: positionRef.current.value,
            uRole: roleRef.current.value,
            uPassword: passwordRef.current.value,
            uPassword_confirmation: passwordConfirmationRef.current.value,
        };
        console.log(payload);
        axiosClient
            .post("/signup", payload)
            .then(({ data }) => {
                setUser(data.user);
                setToken(data.token);
                navigate("/signin");
            })
            .catch((err) => {
                const response = err.response;
                if (response && response.status === 422) {
                    console.log(response.data.errors);
                    setError(response.data.errors);
                }
            });
        console.log(payload);
    };
    return (
        <div>
            {error && (
                <div>
                    {typeof error === "object" && !Array.isArray(error) ? (
                        Object.keys(error).map((key) => (
                            <Alert key={key} severity="error">
                                {error[key]}
                            </Alert>
                        ))
                    ) : (
                        <Alert severity="error">{error}</Alert>
                    )}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <h1 className="font-medium text-center mb-5 text-3xl">
                    Регистрация
                </h1>
                <div className="mb-6">
                    <Typography variant="h6" className="mb-3" fontSize={18}>
                        ФИО пользователя
                    </Typography>
                    <TextField
                        id="login"
                        variant="outlined"
                        type="text"
                        name="login"
                        placeholder="Иванов Иван Иванович"
                        required
                        fullWidth
                        size="small"
                        className="bg-slate-50 item-rounded"
                        inputRef={loginRef}
                    />
                </div>
                <div className="mb-6">
                    <Typography variant="h6" className="mb-3" fontSize={18}>
                        Почта
                    </Typography>
                    <TextField
                        id="email"
                        variant="outlined"
                        type="email"
                        name="email"
                        placeholder="me@example.com"
                        required
                        fullWidth
                        size="small"
                        className="bg-slate-50 item-rounded"
                        inputRef={emailRef}
                    />
                </div>
                <div className="mb-6">
                    <Typography variant="h6" className="mb-3" fontSize={18}>
                        Должность
                    </Typography>
                    <TextField
                        id="occupation"
                        variant="outlined"
                        type="text"
                        name="occupation"
                        required
                        fullWidth
                        size="small"
                        className="bg-slate-50 item-rounded"
                        inputRef={positionRef}
                    />
                </div>
                <div className="mb-6">
                    <Autocomplete
                        disablePortal
                        options={roles}
                        fullWidth
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Роль"
                                inputRef={roleRef}
                            />
                        )}
                        name="role"
                    />
                </div>
                <div className="mb-6">
                    <Typography variant="h6" className="mb-3" fontSize={18}>
                        Пароль
                    </Typography>
                    <TextField
                        id="password"
                        variant="outlined"
                        type="password"
                        name="password"
                        required
                        placeholder="********"
                        fullWidth
                        size="small"
                        className="bg-slate-50"
                        inputRef={passwordRef}
                    />
                </div>
                <div>
                    <Typography variant="h6" className="mb-3" fontSize={18}>
                        Подтверждение пароля
                    </Typography>
                    <TextField
                        id="password_confirmation"
                        variant="outlined"
                        type="password"
                        name="password_confirmation"
                        required
                        placeholder="********"
                        fullWidth
                        size="small"
                        className="bg-slate-50"
                        inputRef={passwordConfirmationRef}
                    />
                    <div className="w-full mt-6">
                        <Button
                            variant="contained"
                            fullWidth
                            sx={{
                                borderRadius: "5px",
                                backgroundColor: indigo[900],
                            }}
                            type="submit"
                        >
                            Зарегистрироваться
                        </Button>
                    </div>
                </div>
                <div className="mt-5">
                    <Typography
                        sx={{
                            fontSize: 15,
                            marginLeft: 3,
                        }}
                        className="text-right text-blue-500"
                    >
                        <Link to="/signin">
                            <span className="font-light mr-1">
                                Вход в систему
                            </span>
                        </Link>
                    </Typography>
                </div>
            </form>
        </div>
    );
}

export default SignUp;
