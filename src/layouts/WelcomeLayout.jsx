import {
    Link,
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
} from "@heroui/react";
import { Navigate, Outlet } from "react-router-dom";
import { LoginButton } from "../components/LoginButton";
import logo from "../../public/Icons/proto-2-light-short.svg";

function WelcomeLayout() {
    return (
        <div>
            <Navbar isBordered className="bg-[#dfe9ed]">
                <NavbarBrand>
                    <Link href="/">
                        <img
                            src={logo}
                            alt="website logo"
                            width={150}
                            height={150}
                        />
                    </Link>
                </NavbarBrand>
                <NavbarContent className="hidden sm:flex gap-80">
                    <NavbarItem>
                        <Link
                            href="/about"
                            className="text-black font-semibold hover:text-slate-700 hover:text-lg transition-all duration-300"
                        >
                            О проекте
                        </Link>
                    </NavbarItem>
                    <NavbarItem>
                        <LoginButton onClick={() => navigate("/signin")}>
                            Войти
                        </LoginButton>
                    </NavbarItem>
                </NavbarContent>
            </Navbar>
        </div>
    );
}

export default WelcomeLayout;
