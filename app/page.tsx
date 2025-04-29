"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Text, Box, Button, Input, Select, createListCollection, Portal, Flex, Icon } from "@chakra-ui/react";
import { HiPencil } from "react-icons/hi";
import { useLocationStore } from "./state/locationStore";

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
  const [editingLocation, setEditingLocation] = useState<any>(null);

  const locations = useLocationStore((state: any) => state.locations);
  const [coordinates, setCoordinates] = useState({ lat: null, lng: null });
  const addLocation = useLocationStore((state: any) => state.addLocation);
  const updateLocation = useLocationStore((state: any) => state.updateLocation);

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

  const handleEditLocation = (location: any) => {
    setEditMode(true);
    setEditingLocation(location);
    setName(location.name);
  };

  const handleUpdateLocation = () => {
    if (editingLocation) {
      updateLocation(editingLocation.id, { name, color, latitude: coordinates.lat, longitude: coordinates.lng });
      setEditMode(false);
      setEditingLocation(null);
      setName("");
    }
  };

  return (
    <Box p={4}>
      <Map onClick={(coords) => setCoordinates(coords)} locations={locations} />
      <Flex display={"flex"} mt={4} justify={"space-around"}>

        <Flex display={"block"} justify="flex-start" alignItems={"center"}>
          <Input
            placeholder={editMode ? "Update Location Name" : "Location name"}
            value={name}
            onChange={(e) => setName(e.target.value)}
            mt={4}
            size={"sm"}
            width="320px"
          />

          <Select.Root collection={colors} size="sm" width="320px" mt={4}>
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
        </Flex>


        <Flex wrap={"wrap"} display={"flex"} justify="flex-end" gap={4} mt={4}>
          {locations.map((location: any) => (
            <Box
              key={location.id}
              p={1}
              borderRadius="xs"
              borderWidth={1}
              borderColor={location.color}
              backgroundColor="slate.100"
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              width="auto"
              maxHeight={"50px"}
              minWidth="40px"
            >
              <Text color="black">{location.name}</Text>

              <Button
                onClick={() => handleEditLocation(location)}
                ml={2}
                display="flex"
                alignItems="center"
                size="xs"
                colorScheme="teal"
                color={"teal.600"}
                backgroundColor="teal.50"
                _hover={{ backgroundColor: "teal.100" }}
                _active={{ backgroundColor: "teal.100" }}
                _focus={{ boxShadow: "outline" }}
                variant="solid"
                borderRadius="md"
              >
                <Icon as={HiPencil} boxSize={4} mr={1} />
                Edit
              </Button>
            </Box>
          ))}
        </Flex>
      </Flex>
    </Box>
  );
}
