import { Outlet } from "react-router-dom";
import { useUserContext } from "../context/UserContextProvider";
// import { Typography } from "@mui/material";
import TransitionWrapper from "../TransitionWrapper";

function GuestLayout() {
    const { token } = useUserContext();
    // console.log(token);
    // if (!token) {
    //     return <Navigate to="/signin" />;
    // }

    return (
        <div className="bg-blue-50">
            <TransitionWrapper>
                <div className="bg-blue-50 h-screen w-full flex justify-center items-center">
                    <div className="bg-white w-[30rem] shadow-2xl rounded-xl p-10">
                        <Outlet />
                    </div>
                </div>
            </TransitionWrapper>
        </div>
    );
}

export default GuestLayout;
