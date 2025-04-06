import { Link, Navigate, Outlet, useNavigate } from "react-router-dom";
import { useUserContext } from "../context/UserContextProvider";
import Logo from "../assets/21.svg";
import { useEffect } from "react";
import axiosClient from "../axiosClient";
import {
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    Button,
} from "@heroui/react";

function UserLayout() {
    const { token, setUser, setToken, user } = useUserContext();
    useEffect(() => {
        axiosClient.get("/user").then((res) => {
            // console.log(res);
            setUser(res.data);
        });
    }, []);
    const navigate = useNavigate();
    if (!token) {
        return <Navigate to="/signin" />;
    }
    const onLogout = (e) => {
        e.preventDefault();
        setToken(null);
        navigate("/signin");
    };

    return (
        <div className="flex">
            <aside className="min-w-72 h-screen flex flex-col gap-4 bg-slate-100">
                <img
                    src={Logo}
                    alt="University Logo"
                    className="w-52 mx-4 mt-4"
                />
                <Link
                    to="/engineer"
                    className="hover:bg-slate-200 p-4 text-start font-bold rounded-lg"
                >
                    Главная
                </Link>
                <Link
                    to="/engineer/rooms"
                    className="hover:bg-slate-200 p-4 text-start font-bold rounded-lg"
                >
                    Помещение/Устройства
                </Link>
            </aside>
            <div className="w-full">
                <Navbar className="bg-slate-100 border-b-2 border-slate-200">
                    <NavbarBrand>
                        <p className="text-xl font-bold">EnvMon</p>
                    </NavbarBrand>
                    <NavbarContent
                        className="hidden sm:flex gap-6 "
                        justify="end"
                    >
                        <NavbarItem className="flex flex-row gap-2 items-center ">
                            <div>{user.userName}</div>
                            <Button onClick={onLogout}>Выйти</Button>
                        </NavbarItem>
                    </NavbarContent>
                </Navbar>

                <main className="w-full h-full p-10">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default UserLayout;
