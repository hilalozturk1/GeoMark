

type LatLng = {
  lat: number;
  lng: number;
};

export async function getDirections(
  origin: LatLng,
  destination: LatLng,
  waypoints: google.maps.DirectionsWaypoint[]
): Promise<google.maps.DirectionsResult | null> {
  return new Promise((resolve, reject) => {
    const service = new google.maps.DirectionsService();

    service.route(
      {
        origin,
        destination,
        waypoints,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          resolve(result);
        } else {
          console.error("Directions request failed", status);
          reject(null);
        }
      }
    );
  });
}
