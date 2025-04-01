// File to keep my geometrical functions

export function haversineDistance(coord1, coord2) {
  const toRadians = (degrees) => degrees * (Math.PI / 180);

  const R = 6371000;

  const lat1 = toRadians(coord1.latitude);
  const lon1 = toRadians(coord1.longitude);
  const lat2 = toRadians(coord2.latitude);
  const lon2 = toRadians(coord2.longitude);

  const dLat = lat2 - lat1;
  const dLon = lon2 - lon1;

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}
 // Calculates the zoom factor per se
export function calculateDelta(coord1, coord2) {

  const holeDist = haversineDistance(coord1, coord2);

  // Distance factor is adjusted based on distance
  // Shorter holes, we need to zoom out more
  const distanceFactor = (holeDist < 200 ? 75.0 : 90.0)

  const delta = 0.0007 * holeDist / distanceFactor

  return delta;
}

// Calculating the bearing from tee to green for orientation
export function calculateBearing(teeLat, teeLng, greenLat, greenLng) {
  const startLat = teeLat * Math.PI / 180
  const startLng = teeLng * Math.PI / 180
  const destLat = greenLat * Math.PI / 180
  const destLng = greenLng * Math.PI / 180

  const y = Math.sin(destLng - startLng) * Math.cos(destLat)
  const x = Math.cos(startLat) * Math.sin(destLat) -
    Math.sin(startLat) * Math.cos(destLat) * Math.cos(destLng - startLng)
  let bearing = Math.atan2(y, x) * 180 / Math.PI

  // Converting to degrees
  bearing = (bearing + 360) % 360

  return bearing
}