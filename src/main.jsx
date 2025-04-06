import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
// import "@heroui/react/styles.css";
import { RouterProvider } from "react-router-dom";
import router from "./router";
import { UserContextProvider } from "./context/UserContextProvider";
import { DeviceContextProvider } from "./context/DeviceContexProvider";
import { createTheme, ThemeProvider } from "@mui/material";
import { RoomContextProvider } from "./context/RoomContextProvider";
import { HeroUIProvider } from "@heroui/react";
const theme = createTheme({
  // typography: {
  //     fontFamily: ['"roboto"', '"Open Sans"', "sans-serif"].join(","),
  // },
});
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserContextProvider>
      <DeviceContextProvider>
        <RoomContextProvider>
          <ThemeProvider theme={theme}>
            <HeroUIProvider>
              <RouterProvider router={router} />
            </HeroUIProvider>
          </ThemeProvider>
        </RoomContextProvider>
      </DeviceContextProvider>
    </UserContextProvider>
  </StrictMode>
);
