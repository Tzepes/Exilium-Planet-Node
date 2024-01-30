import * as THREE from 'three';

const totalParcels = 99856;
const parcelsPerSide = Math.sqrt(totalParcels);

const latRange = 180; // from -90 to 90
const lonRange = 360; // from -180 to 180

const latStep = latRange / parcelsPerSide;
const lonStep = lonRange / parcelsPerSide;

export function sphereCoords (lat, lng, r) {
    let theta = lat * Math.PI/180;
    let phi = lng * Math.PI/180;

    let x = (r * Math.sin(theta) * Math.cos(phi));
    let y = (r * Math.sin(theta) * Math.sin(phi));
    let z = (r * Math.cos(theta));

    return new THREE.Vector3(x, y, z);
}

export function getLatLng(x, y, z) {
    let theta = Math.acos(z/Math.sqrt(x*x + y*y + z*z));
    let phi = CalculatePhi(x, y);
    
    let lat = 180/Math.PI * theta;
    let lng = 180/Math.PI * phi;
    
    return new THREE.Vector2(lat, lng)
}

function CalculatePhi(x, y) {
    let phi = 0;
    if(x>0){
        phi = Math.atan(y/x);
    } else if(x < 0 && y >= 0){
        phi = Math.atan(y/x) + Math.PI;
    } else if(x < 0 && y < 0){
        phi = Math.atan(y/x) - Math.PI;
    } else if(x == 0 && y > 0){
        phi = Math.PI/2
    } else if(x == 0 && y < 0){
        phi = -Math.PI/2
    }
    return phi;
}

export function OrientObjectOnSphere(object, objX, objY, objZ){
    const normalVectors = new THREE.Vector3(objX, objY, objZ).normalize();
    object.current.lookAt(object.current.position.clone().add(normalVectors));
}

export function getClosestParcel(lat, lon, parcelMatrix) {
    // Calculate the index of the parcel that should be closest to the given coordinates
    let i = Math.floor(lat / latStep);
    let j = Math.floor(lon / lonStep);
    let index = i * parcelsPerSide + j;

    // Flatten the parcelMatrix into a 1D array
    let flatParcelMatrix = parcelMatrix.flat();
    // Return the parcel at the calculated index
    return flatParcelMatrix[index];
}