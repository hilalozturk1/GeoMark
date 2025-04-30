export const haversine = (
    a: { latitude: number; longitude: number },
    b: { latitude: number; longitude: number }
  ): number => {
    const toRad = (v: number) => (v * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(b.latitude - a.latitude);
    const dLng = toRad(b.longitude - a.longitude);
    const aa =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(a.latitude)) *
        Math.cos(toRad(b.latitude)) *
        Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(aa), Math.sqrt(1 - aa));
  };
  