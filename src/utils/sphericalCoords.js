import * as THREE from 'three';

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
