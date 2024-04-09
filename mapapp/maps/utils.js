const keyExists = (key, obj) => {
    if (obj) {
      return (key in obj);
    } else {
      return false;
    }
}

const checkScore = (a, b, c, d) => {
    if ((a || a===0) && b==c) {
      return true;
    } else if (keyExists(b, d)) {
      if (d[b]?.length) {
        return true
      }
    }
    return false;
}

const avgScore = (arr, float=false) => {
    if (arr.length === 0) {
      return 0;
    }
    if (float) {
      const avg = (arr.reduce((acc, curr) => acc + parseFloat(curr.score), 0))/arr.length;
      return avg.toFixed(2)
    } else {
      return (arr.reduce((acc, curr) => acc + curr.score, 0))/arr.length;
    }
}

function calculateDistance(lat1, lon1, lat2, lon2, unit) {
    if ((lat1 == lat2) && (lon1 == lon2)) {
        return 0;
    }
    else {
        var radlat1 = Math.PI * lat1/180;
        var radlat2 = Math.PI * lat2/180;
        var theta = lon1-lon2;
        var radtheta = Math.PI * theta/180;
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        if (dist > 1) {
            dist = 1;
        }
        dist = Math.acos(dist);
        dist = dist * 180/Math.PI;
        dist = dist * 60 * 1.1515;
        if (unit=="K") { dist = dist * 1.609344 }
        if (unit=="N") { dist = dist * 0.8684 }
        return parseFloat(dist)
    }
}

function calculateDestinationCoordinates(lat1, lon1, distance, bearing) {
    const R = 6371; // Earth's radius in kilometers

    // Convert latitude and longitude from degrees to radians
    lat1 = lat1 * Math.PI / 180;
    lon1 = lon1 * Math.PI / 180;
    bearing = bearing * Math.PI / 180;

    const lat2 = Math.asin(Math.sin(lat1) * Math.cos(distance / R) +
        Math.cos(lat1) * Math.sin(distance / R) * Math.cos(bearing));
    
    const lon2 = lon1 + Math.atan2(Math.sin(bearing) * Math.sin(distance / R) * Math.cos(lat1),
        Math.cos(distance / R) - Math.sin(lat1) * Math.sin(lat2));
    
    // Convert latitude and longitude back to degrees
    const destinationLat = lat2 * 180 / Math.PI;
    const destinationLon = lon2 * 180 / Math.PI;

    return { lat: destinationLat, lng: destinationLon };
}

function calculateScore(settings, distance) {
    const maxScore = settings.scores[1];
    const minScore = settings.scores[0];
    const minDist = settings.distances[1];
    const maxDist = settings.distances[0];
    const value = (((maxScore-minScore)*distance)/(minDist-maxDist))+(((maxScore*maxDist)-minScore)/(maxDist-minDist));
    return value<0 ? 0 : value.toFixed(2);
}


export {
    keyExists,
    checkScore,
    avgScore,
    calculateDistance,
    calculateDestinationCoordinates,
    calculateScore
}

/* Example usage:
const startingLat = 40.7128; // Starting latitude (New York City)
const startingLon = -74.0060; // Starting longitude (New York City)
const distanceKm = 100; // Distance in kilometers
const bearingDeg = 45; // Bearing in degrees (northeast)

const destinationCoordinates = calculateDestinationCoordinates(startingLat, startingLon, distanceKm, bearingDeg);
console.log(destinationCoordinates);*/