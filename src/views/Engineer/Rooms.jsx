import { HeroUIProvider, Spinner } from "@heroui/react";
import { useEffect, useState } from "react";

import axiosClient from "../../axiosClient";
import RoomsTable from "../../components/Tables/RoomsTable";

//get all rooms on page load
function Rooms() {
    const [rooms, setRooms] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        axiosClient
            .get("/rooms")
            .then(({ data }) => {
                setRooms(data);
                setIsLoading(false);
            })
            .catch((error) => {
                console.log(error.response.data.message);
                setIsLoading(false);
            });
    }, []);

    return (
        <HeroUIProvider>
            {isLoading ? (
                <div className="flex justify-center items-center h-screen">
                    <Spinner size="lg" />
                </div>
            ) : (
                <>
                    <h1 className="text-2xl font-bold text-center">
                        Справочник помещений
                    </h1>
                    <RoomsTable ROOMS={rooms} isAdmin={false} />
                </>
            )}
        </HeroUIProvider>
    );
}

export default Rooms;
