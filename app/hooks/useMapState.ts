import { useState } from "react";
import type { Location } from "../types/location";

export const useMapState = () => {
    const [name, setName] = useState<string>("");
    const [color, setColor] = useState<string>("#FF0000");
    const [editMode, setEditMode] = useState<boolean>(false);
    const [editingLocation, setEditingLocation] = useState<Location | null>(null);
    const [coordinates, setCoordinates] = useState<{ lat: number | null; lng: number | null }>({ lat: null, lng: null });

    const resetForm = () => {
        setName("");
        setColor("#FF0000");
        setCoordinates({ lat: null, lng: null });
        setEditMode(false);
        setEditingLocation(null);
    };

    return {
        name, setName,
        color, setColor,
        editMode, setEditMode,
        editingLocation, setEditingLocation,
        coordinates, setCoordinates,
        resetForm
    };
};
