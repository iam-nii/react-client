import { Alert, Button, TextField, Typography } from "@mui/material";
import "@fontsource/roboto/400.css";
import "../index.css";
import { indigo } from "@mui/material/colors";
import { Link, useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import axiosClient from "../axiosClient";
import { useUserContext } from "../context/UserContextProvider";
import { Spinner } from "@nextui-org/react";

function SignIn() {
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const { setUser, setToken } = useUserContext();
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);
        const payload = {
            uEmail: emailRef.current.value,
            uPassword: passwordRef.current.value,
        };
        console.log(payload);

        axiosClient
            .post("/signin", payload)
            .then(({ data }) => {
                console.log(data);
                setUser(data.user);
                setToken(data.token);
                if (data.user.uRole === "admin") {
                    navigate("/admin");
                } else if (data.user.uRole === "user") {
                    navigate("/engineer");
                }
            })
            .catch((err) => {
                const response = err.response;
                if (
                    (response && response.status === 422) ||
                    response.status === 401
                ) {
                    console.log(response.data.message);
                    if (
                        response.data.message ===
                        "The selected u email is invalid."
                    ) {
                        setError(
                            "Данные не верные. Попробуйте еще раз или зарегистрируйтесь"
                        );
                    }
                }
            })
            .finally(() => {
                setIsLoading(false);
            });
        navigate("/admin");
    };
    return (
        <div>
            {isLoading ? (
                <div className="flex w-full h-screen justify-center items-center bg-slate-50">
                    <p className="text-2xl font-bold">Вход в систему...</p>
                    <Spinner size="lg" color="success" />
                </div>
            ) : (
                <>
                    {error && (
                        <div>
                            {typeof error === "object" &&
                            !Array.isArray(error) ? (
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
                            Вход в систему
                        </h1>
                        <div className="mb-6">
                            <Typography variant="h6" className="mb-3">
                                Почта
                            </Typography>
                            <TextField
                                id="email"
                                name="email"
                                type="email"
                                placeholder="me@example.com"
                                required
                                fullWidth
                                size="small"
                                className="bg-slate-50 item-rounded"
                                inputRef={emailRef}
                            />
                        </div>
                        <div>
                            <Typography variant="h6" className="mb-3">
                                Пароль
                            </Typography>
                            <TextField
                                id="password"
                                name="password"
                                type="password"
                                required
                                placeholder="********"
                                fullWidth
                                size="small"
                                className="bg-slate-50"
                                inputRef={passwordRef}
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
                                    Войти
                                </Button>
                            </div>
                        </div>
                        <div className="mt-5">
                            <Typography
                                sx={{ fontSize: 15 }}
                                className="text-right text-gray-500"
                            >
                                Нет аккаунта?
                                <Link to="/signup">
                                    <span className="text-blue-500 text-sm font-light mr-1">
                                        {" "}
                                        Зарегистрироваться
                                    </span>
                                </Link>
                            </Typography>
                        </div>
                    </form>
                </>
            )}
        </div>
    );
}

export default SignIn;
