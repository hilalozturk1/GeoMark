"use client";
import {
  Text,
  Box,
  Button,
  Input,
  Select,
  createListCollection,
  Portal,
} from "@chakra-ui/react";

import { COLOR_OPTIONS } from "../constants/colors";

const colors = createListCollection({ items: COLOR_OPTIONS });

type Props = {
  name: string;
  setName: (value: string) => void;
  color: string;
  setColor: (value: string) => void;
  coordinates: { lat: number | null; lng: number | null };
  editMode: boolean;
  handleAddLocation: () => void;
  handleUpdateLocation: () => void;
};

export default function LocationForm({
  name,
  setName,
  setColor,
  coordinates,
  editMode,
  handleAddLocation,
  handleUpdateLocation,
}: Props) {
  return (
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
  );
}
