import { useEffect, useState } from "react";

export const useGeolocation = () => {
    const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((pos) => {
            setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        });
    }, []);

    return position;
};
