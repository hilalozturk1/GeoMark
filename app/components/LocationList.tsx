import { Box, Button, Text } from "@chakra-ui/react";
import { HiPencil } from "react-icons/hi";
import { Location } from "../types/location";
import { LocationListProps } from "../types/props";

export default function LocationList({ locations, handleEditLocation }: LocationListProps) {
  return (
    <Box mt={4}>
      {locations.map((location: Location) => (
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
            color={"teal.800"}
            backgroundColor={location.color}
            _hover={{ backgroundColor: "teal.100" }}
            _active={{ backgroundColor: "teal.100" }}
            _focus={{ boxShadow: "outline" }}
            variant="solid"
            borderRadius="md"
            opacity={0.5}
          >
            <HiPencil size={14} />
            Edit
          </Button>
        </Box>
      ))}
    </Box>
  );
}
