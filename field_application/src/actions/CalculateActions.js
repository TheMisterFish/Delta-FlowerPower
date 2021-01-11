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
    destVincenty(lat1, lon1, brng, dist) {
        var a = 6378137,
            b = 6356752.3142,
            f = 1 / 298.257223563, // WGS-84 ellipsiod
            s = dist,
            alpha1 = this.toRadians(brng),
            sinAlpha1 = Math.sin(alpha1),
            cosAlpha1 = Math.cos(alpha1),
            tanU1 = (1 - f) * Math.tan(this.toRadians(lat1)),
            cosU1 = 1 / Math.sqrt((1 + tanU1 * tanU1)),
            sinU1 = tanU1 * cosU1,
            sigma1 = Math.atan2(tanU1, cosAlpha1),
            sinAlpha = cosU1 * sinAlpha1,
            cosSqAlpha = 1 - sinAlpha * sinAlpha,
            uSq = cosSqAlpha * (a * a - b * b) / (b * b),
            A = 1 + uSq / 16384 * (4096 + uSq * (-768 + uSq * (320 - 175 * uSq))),
            B = uSq / 1024 * (256 + uSq * (-128 + uSq * (74 - 47 * uSq))),
            sigma = s / (b * A),
            sigmaP = 2 * Math.PI;
        while (Math.abs(sigma - sigmaP) > 1e-12) {
            var cos2SigmaM = Math.cos(2 * sigma1 + sigma),
                sinSigma = Math.sin(sigma),
                cosSigma = Math.cos(sigma),
                deltaSigma = B * sinSigma * (cos2SigmaM + B / 4 * (cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM) - B / 6 * cos2SigmaM * (-3 + 4 * sinSigma * sinSigma) * (-3 + 4 * cos2SigmaM * cos2SigmaM)));
            sigmaP = sigma;
            sigma = s / (b * A) + deltaSigma;
        }
        var tmp = sinU1 * sinSigma - cosU1 * cosSigma * cosAlpha1,
            lat2 = Math.atan2(sinU1 * cosSigma + cosU1 * sinSigma * cosAlpha1, (1 - f) * Math.sqrt(sinAlpha * sinAlpha + tmp * tmp)),
            lambda = Math.atan2(sinSigma * sinAlpha1, cosU1 * cosSigma - sinU1 * sinSigma * cosAlpha1),
            C = f / 16 * cosSqAlpha * (4 + f * (4 - 3 * cosSqAlpha)),
            L = lambda - (1 - C) * f * sinAlpha * (sigma + C * sinSigma * (cos2SigmaM + C * cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM))),
            revAz = Math.atan2(sinAlpha, -tmp); // final bearing
        return [this.toDegrees(lat2), lon1 + this.toDegrees(L)];
    },
    calculateGpsCords(my_pos_1, my_pos_2, my_pos_3, my_pos_4, image_size_width, image_size_height) {
        const start_pos = my_pos_1;
        const pos_1 = [my_pos_2[0], my_pos_2[1]];
        const pos_2 = [my_pos_3[0], my_pos_3[1]];
        const pos_3 = [my_pos_4[0], my_pos_4[1]];

        // Get longest side
        const length_1 = CalculateActions.distanceInMBetweenEarthCoordinates(
            start_pos[0],
            start_pos[1],
            pos_1[0],
            pos_1[1]
        );
        const length_2 = CalculateActions.distanceInMBetweenEarthCoordinates(
            start_pos[0],
            start_pos[1],
            pos_2[0],
            pos_2[1]
        );

        var width, height;
        var images_taken_width, images_taken_height;
        var heading_width, heading_height;

        if (length_1 > length_2) {
            //van links naar rechts
            images_taken_width = Math.ceil(length_1 / image_size_width);
            images_taken_height = Math.ceil(length_2 / image_size_height);
            width = length_1;
            height = length_2;
            heading_width = CalculateActions.bearing(
                start_pos[0],
                start_pos[1],
                pos_1[0],
                pos_1[1]
            );
            heading_height = CalculateActions.bearing(
                start_pos[0],
                start_pos[1],
                pos_2[0],
                pos_2[1]
            );
        } else {
            // van boven naar onder
            images_taken_width = Math.ceil(length_2 / image_size_width);
            images_taken_height = Math.ceil(length_1 / image_size_height);
            width = length_2;
            height = length_1;
            heading_width = CalculateActions.bearing(
                start_pos[0],
                start_pos[1],
                pos_2[0],
                pos_2[1]
            );
            heading_height = CalculateActions.bearing(
                start_pos[0],
                start_pos[1],
                pos_1[0],
                pos_1[1]
            );
        }

        // Get total images we will take
        const total_images = Math.ceil(
            images_taken_width * images_taken_height
        );
        // Get offsets in meters
        const width_offset =
            (images_taken_width * image_size_width - width) / 2;
        const height_offset =
            (images_taken_height * image_size_height - height) / 2;

        // Get real startpos (with image offset)
        var real_start_pos = CalculateActions.destVincenty(
            start_pos[0],
            start_pos[1],
            heading_width,
            width_offset * -1
        );
        
        real_start_pos = CalculateActions.destVincenty(
            real_start_pos[0],
            real_start_pos[1],
            heading_height,
            height_offset * -1
        );

        var gps_cords = [];
        var point;

        for (let i = 0; i < images_taken_height; i++) {
            const height_offset =
                i * image_size_height + image_size_height / 2;
            point = CalculateActions.destVincenty(
                real_start_pos[0],
                real_start_pos[1],
                heading_height,
                height_offset
            );
            for (let i = 0; i < images_taken_width; i++) {
                const width_offset =
                    i * image_size_width + image_size_width / 2;
                let new_point = CalculateActions.destVincenty(
                    point[0],
                    point[1],
                    heading_width,
                    width_offset
                );
                gps_cords.push(new_point);
            }
        }
        return {
            points: gps_cords,
            width: images_taken_width,
            height: images_taken_height,
            heading: heading_height
        }
    },
};

export default CalculateActions;