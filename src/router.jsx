import { createHashRouter } from "react-router-dom";

import Welcome from "./views/Welcome";
import SignIn from "./views/Auth/SignIn";
import SignUp from "./views/Auth/SignUp";
import NotFound from "./views/NotFound";
import GuestLayout from "./layouts/GuestLayout";
import UserLayout from "./layouts/UserLayout";
import Dashboard from "./views/Admin/Dashboard";
import EngineerHome from "./views/Engineer/Home";
import Users from "./views/Admin/Users";
import Rooms from "./views/Admin/Rooms";
import EngineerRooms from "./views/Engineer/Rooms";
import Settings from "./views/Admin/Settings";
import AdminLayout from "./layouts/AdminLayout";
import RoomDetails from "./views/Admin/RoomDetails";
import RoomData from "./views/Admin/RoomData";
import About from "./views/About";

const router = createHashRouter([
  {
    path: "/",
    element: <Welcome />,
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/",
    element: <GuestLayout />,
    children: [
      {
        path: "/signin",
        element: <SignIn />,
      },
      {
        path: "/signup",
        element: <SignUp />,
      },
    ],
  },
  {
    path: "/",
    element: <AdminLayout />,
    children: [
      {
        path: "/admin",
        element: <Dashboard />,
      },
      {
        path: "/admin/users",
        element: <Users />,
      },
      {
        path: "/admin/rooms",
        element: <Rooms />,
      },
      {
        path: "/admin/data/:roomID",
        element: <RoomData />,
      },
      {
        path: "/admin/settings",
        element: <Settings />,
      },
      {
        path: "/admin/rooms/:id",
        element: <RoomDetails />,
      },
    ],
  },
  {
    path: "/",
    element: <UserLayout />,
    children: [
      {
        path: "/engineer",
        element: <EngineerHome />,
      },
      {
        path: "/engineer/rooms",
        element: <EngineerRooms />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
