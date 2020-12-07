//imports

const CalculateActions = {
    toRadians(degrees) {
        return (degrees * Math.PI) / 180;
    },
    toDegrees(radians) {
        return (radians * 180) / Math.PI;
    },
    distanceInMBetweenEarthCoordinates(lat1, lon1, lat2, lon2) {
        var earthRadiusKm = 6371;

        var dLat = this.toRadians(lat2 - lat1);
        var dLon = this.toRadians(lon2 - lon1);

        lat1 = this.toRadians(lat1);
        lat2 = this.toRadians(lat2);

        var a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2) *
            Math.cos(lat1) *
            Math.cos(lat2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return earthRadiusKm * c * 1000;
    },
    EarthRadiusInMeters(latitudeRadians) // latitude is geodetic, i.e. that reported by GPS
    {
        // http://en.wikipedia.org/wiki/Earth_radius
        var a = 6378137.0; // equatorial radius in meters
        var b = 6356752.3; // polar radius in meters
        var cos = Math.cos(latitudeRadians);
        var sin = Math.sin(latitudeRadians);
        var t1 = a * a * cos;
        var t2 = b * b * sin;
        var t3 = a * cos;
        var t4 = b * sin;
        return Math.sqrt((t1 * t1 + t2 * t2) / (t3 * t3 + t4 * t4));
    },
    GeocentricLatitude(lat) {
        // Convert geodetic latitude 'lat' to a geocentric latitude 'clat'.
        // Geodetic latitude is the latitude as given by GPS.
        // Geocentric latitude is the angle measured from center of Earth between a point and the equator.
        // https://en.wikipedia.org/wiki/Latitude#Geocentric_latitude
        var e2 = 0.00669437999014;
        var clat = Math.atan((1.0 - e2) * Math.tan(lat));
        return clat;
    },
    RotateGlobe(b, a, bradius, aradius, oblate) {
        // Get modified coordinates of 'b' by rotating the globe so that 'a' is at lat=0, lon=0.
        var br = {
            'lat': b.lat,
            'lon': (b.lon - a.lon),
            'elv': b.elv
        };
        var brp = this.LocationToPoint(br, oblate);

        // Rotate brp cartesian coordinates around the z-axis by a.lon degrees,
        // then around the y-axis by a.lat degrees.
        // Though we are decreasing by a.lat degrees, as seen above the y-axis,
        // this is a positive (counterclockwise) rotation (if B's longitude is east of A's).
        // However, from this point of view the x-axis is pointing left.
        // So we will look the other way making the x-axis pointing right, the z-axis
        // pointing up, and the rotation treated as negative.

        var alat = -a.lat * Math.PI / 180.0;
        if (oblate) {
            alat = this.GeocentricLatitude(alat);
        }
        var acos = Math.cos(alat);
        var asin = Math.sin(alat);

        var bx = (brp.x * acos) - (brp.z * asin);
        var by = brp.y;
        var bz = (brp.x * asin) + (brp.z * acos);

        return {
            'x': bx,
            'y': by,
            'z': bz,
            'radius': bradius
        };
    },
    LocationToPoint(c, oblate) {
        // Convert (lat, lon, elv) to (x, y, z).
        var lat = (c.lat * Math.PI) / 180.0;
        var lon = (c.lon * Math.PI) / 180.0;
        var radius = oblate ? this.EarthRadiusInMeters(lat) : 6371009;
        var clat = oblate ? this.GeocentricLatitude(lat) : lat;

        var cosLon = Math.cos(lon);
        var sinLon = Math.sin(lon);
        var cosLat = Math.cos(clat);
        var sinLat = Math.sin(clat);
        var x = radius * cosLon * cosLat;
        var y = radius * sinLon * cosLat;
        var z = radius * sinLat;

        // We used geocentric latitude to calculate (x,y,z) on the Earth's ellipsoid.
        // Now we use geodetic latitude to calculate normal vector from the surface, to correct for elevation.
        var cosGlat = Math.cos(lat);
        var sinGlat = Math.sin(lat);

        var nx = cosGlat * cosLon;
        var ny = cosGlat * sinLon;
        var nz = sinGlat;

        x += c.elv * nx;
        y += c.elv * ny;
        z += c.elv * nz;

        return {
            x: x,
            y: y,
            z: z,
            radius: radius,
            nx: nx,
            ny: ny,
            nz: nz
        };
    },
    bearing(startLat, startLng, destLat, destLng) {
        startLat = this.toRadians(startLat);
        startLng = this.toRadians(startLng);
        destLat = this.toRadians(destLat);
        destLng = this.toRadians(destLng);

        var y = Math.sin(destLng - startLng) * Math.cos(destLat);
        var x = Math.cos(startLat) * Math.sin(destLat) -
            Math.sin(startLat) * Math.cos(destLat) * Math.cos(destLng - startLng);
        var brng = Math.atan2(y, x);
        brng = this.toDegrees(brng);
        return (brng + 360) % 360;
    },
    cartesian_to_polar({
        x,
        y
    }) {
        return {
            r: Math.sqrt(x * x + y * y),
            theta: Math.atan2(y, x)
        };
    },
    polar_to_cartesian({
        r,
        theta
    }) {
        return {
            x: r * Math.cos(theta),
            y: r * Math.sin(theta)
        };
    },
    ComputeFormDir(lon, lat, heading, meter) {
        const R = this.EarthRadiusInMeters(lat) // Radius of the Earth
        const brng = this.toRadians(heading) // Bearing is 90 degrees converted to radians.
        const d = meter / 1000 // Distance to km

        const lat1 = this.toRadians(lat) //# Current lat point converted to radians
        const lon1 = this.toRadians(lon) //# Current long point converted to radians

        var lat2 = Math.asin(Math.sin(lat1) * Math.cos(d / R) +
            Math.cos(lat1) * Math.sin(d / R) * Math.cos(brng))

        var lon2 = lon1 + Math.atan2(Math.sin(brng) * Math.sin(d / R) * Math.cos(lat1),
            Math.cos(d / R) - Math.sin(lat1) * Math.sin(lat2))

        lat2 = this.toDegrees(lat2)
        lon2 = this.toDegrees(lon2)

        return [lat2, lon2];
    },
    add_distance(lat, lon, dx, dy) {
        dx = dx / 100;
        dy = dy / 100;
        const lat0 = this.toRadians(lat) //# Current lat point converted to radians
        const lon0 = this.toRadians(lon) //# Current long point converted to radians

        var lat1 = lat0 + (180 / Math.PI) * (dy / 6378137);
        var lon1 = lon0 + (180 / Math.PI) * (dx / 6378137) / Math.cos(lat0);

        lat1 = this.toDegrees(lat1)
        lon1 = this.toDegrees(lon1)

        return [lat1, lon1];
    },
    add_distance_2(pLatitude, pLongitude, disX, disY) {

        var latRadian = this.toRadians(pLatitude);

        var degLatKm = 110.574235;
        var degLongKm = 110.572833 * Math.cos(latRadian);
        var deltaLat = disX / 1000.0 / degLatKm;
        var deltaLong = disY / 1000.0 / degLongKm;

        var maxLat = pLatitude + deltaLat;
        var maxLong = pLongitude + deltaLong;

        return [maxLat, maxLong];
    },
    rotate(cx, cy, x, y, angle) {
        var radians = (Math.PI / 180) * angle,
            cos = Math.cos(radians),
            sin = Math.sin(radians),
            nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
            ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
        return [nx, ny];
    }
};

export default CalculateActions;