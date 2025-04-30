"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import {
  Text,
  Box,
  Button,
  Input,
  Select,
  createListCollection,
  Portal,
  Flex,
  Icon,
} from "@chakra-ui/react";
import { HiPencil } from "react-icons/hi";
import { useLocationStore } from "./state/locationStore";

import LocationList from "./components/LocationList";
import type { Location } from "./types/location";

const Map = dynamic(() => import("./components/Map"), { ssr: false });

const colors = createListCollection({
  items: [
    { label: "Red", value: "#FF0000" },
    { label: "Green", value: "#00FF00" },
    { label: "Blue", value: "#0000FF" },
  ],
});

export default function HomePage() {
  const [name, setName] = useState<string>("");
  const [color, setColor] = useState<string>("#FF0000");
  const [editMode, setEditMode] = useState<boolean>(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null); 
  const [coordinates, setCoordinates] = useState<{ lat: number | null; lng: number | null }>({
    lat: null,
    lng: null,
  });
  const [currentPosition, setCurrentPosition] = useState<{ lat: number; lng: number } | null>(null);

  const locations = useLocationStore((state: { locations: Location[] }) => state.locations); 
  const addLocation = useLocationStore((state: { addLocation: (location: Location) => void }) => state.addLocation);
  const updateLocation = useLocationStore((state: { updateLocation: (id: string, location: Location) => void }) => state.updateLocation);
  const [totalDistance, setTotalDistance] = useState<number | null>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setCurrentPosition({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    });
  }, []);

  const handleAddLocation = () => {
    if (!name || !coordinates.lat || !coordinates.lng) {
      alert("Please provide a name and select a location on the map.");
      return;
    }
    addLocation({
      id: Date.now().toString(),
      name,
      latitude: coordinates.lat,
      longitude: coordinates.lng,
      color,
    });
    setName("");
  };

  const handleEditLocation = (location: Location) => {
    setEditMode(true);
    setEditingLocation(location);
    setName(location.name);
    setCoordinates({ lat: location.latitude, lng: location.longitude });
  };

  const handleUpdateLocation = () => {
    if (editingLocation && coordinates.lat !== null && coordinates.lng !== null) {
      updateLocation(editingLocation.id, {
        id: editingLocation.id,
        name,
        color,
        latitude: coordinates.lat,
        longitude: coordinates.lng,
      });
      setEditMode(false);
      setEditingLocation(null);
      setName("");
    } else {
      alert("Please provide valid coordinates.");
    }
  };


  return (
    <Box p={4}>
      <Map
        onClick={(coords) => setCoordinates(coords)}
        locations={locations}
        userLocation={currentPosition}
        onDistanceCalculated={(km) => setTotalDistance(km)}
      />

      <Flex mt={4} justify={"space-around"} alignItems={"center"} display={"flex"}>
        <Flex display={"block"} justify="flex-start" alignItems={"center"}>
          <Box>
            <Input
              placeholder={editMode ? "Update Location Name" : "Location name"}
              value={name}
              onChange={(e) => setName(e.target.value)}
              mt={4}
              size={"sm"}
              width="300px"
            />

            <Select.Root collection={colors} size="sm" width="300px" mt={4}>
              <Select.HiddenSelect />
              <Select.Label>Select Color</Select.Label>
              <Select.Control>
                <Select.Trigger>
                  <Select.ValueText placeholder="Select Color" />
                </Select.Trigger>
                <Select.IndicatorGroup>
                  <Select.Indicator />
                </Select.IndicatorGroup>
              </Select.Control>
              <Portal>
                <Select.Positioner>
                  <Select.Content>
                    {colors.items.map((colorOption) => (
                      <Select.Item
                        key={colorOption.value}
                        item={colorOption}
                        onClick={() => setColor(colorOption.value)}
                      >
                        {colorOption.label}
                        <Select.ItemIndicator />
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Positioner>
              </Portal>
            </Select.Root>

            <Button onClick={editMode ? handleUpdateLocation : handleAddLocation} mt={4}>
              {editMode ? "Update Location" : "Add Location"}
            </Button>

            {coordinates.lat && coordinates.lng && (
              <Box mt={2}>
                <Text fontWeight={"bold"}>Clicked Coordinates</Text>
                <Text fontSize={"sm"}>Lat: {coordinates.lat}</Text>
                <Text fontSize={"sm"}>Lng: {coordinates.lng}</Text>
              </Box>
            )}
          </Box>
        </Flex>

        <Flex wrap={"wrap"} display={"flex"} justify="flex-start" gap={4} mt={4}>
          <LocationList locations={locations} handleEditLocation={handleEditLocation} />
        </Flex>
      </Flex>

      {totalDistance !== null && (
        <Box mt={4}>
          <Text fontWeight="bold">Total Distance: {totalDistance.toFixed(2)} km</Text>
        </Box>
      )}
    </Box>
  );
}
