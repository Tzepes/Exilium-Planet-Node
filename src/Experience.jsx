import { useEffect, useRef, useState, useContext } from 'react'
import * as THREE from 'three'
import { extend, useThree, useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { gsap } from 'gsap/gsap-core'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import planetGlowVertex from './shaders/planetGlowVertex.glsl'
import planetGlowFragment from './shaders/planetGlowFragment.glsl'
import loadingVertex from './shaders/loadingVertex.glsl'
import loadingFragment from './shaders/loadingFragment.glsl'

import {HomeIcon, SewingPinFilledIcon} from '@radix-ui/react-icons'

import axios from 'axios'
import {wallet} from './utils/metamaskConnect'
import { sphereCoords, getLatLng } from './utils/sphericalCoords.js'

import SurfaceIcon from './SurfaceIcon.jsx'
import { set } from 'mongoose'

extend({ OrbitControls: OrbitControls})

/**
 * TODO: fix orbit controls enableDamping
 * if mouse hovers above html UI, zooming doesnt work
 */

export default function Experience({ setClosestParcel }) {
    const [parcelMatrix, setParcelMatrix] = useState([]);
    const [onwedParcel, setOwnedParcel] = useState({lat: 0, lng: 0});

    const totalParcels = 99856;
    const parcelsPerSide = Math.sqrt(totalParcels);

    const latRange = 180; // from -90 to 90
    const lonRange = 360; // from -180 to 180

    const latStep = latRange / parcelsPerSide;
    const lonStep = lonRange / parcelsPerSide;

    useEffect(() => { // ramane aici
        const fetchData = async () => {
            try {
                const getParcels = await axios.get('http://localhost:3000/api/parcels');
                const getOwnedParcel = await axios.get(`http://localhost:3000/api/parcels/${wallet.accounts[0]}`);
                
                // Create a new matrix filled with null values
                const newMatrix = new Array(316).fill(null).map(() => new Array(316).fill(null));

                // Iterate over the parcels and set them in the matrix
                for (const parcel of getParcels.data) {
                    const [i, j] = parcel.id.split('-').map(Number);
                    newMatrix[i][j] = parcel;
                }

                setParcelMatrix(newMatrix);
                setOwnedParcel(getOwnedParcel.data[0]);
                
            } catch (error) {
                console.error(error);
            }
        }

        fetchData();
    }, []);

    function getClosestParcel(lat, lon) { // separa asta in alt fisier
        // Calculate the index of the parcel that should be closest to the given coordinates
        let i = Math.floor(lat / latStep);
        let j = Math.floor(lon / lonStep);
        let index = i * parcelsPerSide + j;

        // Flatten the parcelMatrix into a 1D array
        let flatParcelMatrix = parcelMatrix.flat();
        // setClosestParcel(flatParcelMatrix[index]);
        // console.log(closestParcel);
        // Return the parcel at the calculated index
        return flatParcelMatrix[index];
    }

    //Camera
    const {camera, gl, scene} = useThree()
    camera.position.x = -50
    camera.position.z = 2

    const controls = useRef()

    //Loading Manager
    const loadingOverlay = useRef();
    const htmlLoadingOverlay = useRef();
    const loadingBGSIcon = document.querySelector('.loadingContainer')
    let loaded = false;

    const loadingUniforms = {
        uAlpha: {value: 1} 
      };

    const baseLocUI = useRef()
    const loadingManager = new THREE.LoadingManager(
        //Loaded
        () =>{
            gsap.to(loadingUniforms.uAlpha, {duration: 1.5, value: 0})
            htmlLoadingOverlay.current.style.display = 'none';
            baseLocUI.current.style.display = 'inline';
            controls.enabled = true;
            
            loaded = true;
        },
        //Progress
        () => {
            //loadingBGSIcon.style.display = 'inline';
        }
    )
    
    //Planet
    const planetRef = useRef()
    const radius = 20; 
    const planetColorMap = new THREE.TextureLoader(loadingManager).load('/img/Marsv2.png')
    const planetNormalMap = new THREE.TextureLoader(loadingManager).load('/img/Mars v2_normalMap.png')
    const planetHeightMap = new THREE.TextureLoader(loadingManager).load('/img/Mars v2_heightMap.png')

    //Clouds
    const cloudsRef = useRef()
    const cloudsColorMap = new THREE.TextureLoader(loadingManager).load('/img/2k_earth_clouds.jpg')

    //Stars
    const count = 5000
    const positions = new Float32Array(count * 3)

    for(let i = 0; i < count * 3; i++){
        let x = (Math.random() - 0.5) * 2000 
        let y = (Math.random() - 0.5) * 2000 
        let z = -Math.random() * 3000 
    
        positions[i] = x * 2;
        positions[i+1] = y * 2;
        positions[i+2] = z * 2;
    }

    //BaseLocMesh
    let baseLat = 0; // apply onwedParcel.latitude
    let baseLng = 0;
    
    let playerBaseLocation = sphereCoords(baseLat, baseLng, radius);

    useEffect(() => {
        if(onwedParcel){
            baseLat = onwedParcel.latitude;
            baseLng = onwedParcel.longitude;
            playerBaseLocation = sphereCoords(baseLat, baseLng, radius);
        }
    }, [onwedParcel])

    //Events
    const clickedLocMesh = useRef()
    const clickedLocUI = useRef()
    const [clickedLoc, setClickedLoc] = useState({
        lat: 0,
        lng: 0
    });
    
    const planetClick = (event) => 
    {
        if(loaded){
            const vectLatLng = getLatLng(event.point.x, event.point.y, event.point.z)
            const vect3D = sphereCoords(vectLatLng.x, vectLatLng.y, radius+0.2);

            let closestParcel = getClosestParcel(vectLatLng.x, vectLatLng.y);
            setClosestParcel(closestParcel)

            setClickedLoc({ lat: vectLatLng.x, lng: vectLatLng.y });
    
            clickedLocUI.current.style.display = 'inline';
    
            clickedLocMesh.current.position.set(vect3D.x, vect3D.y, vect3D.z);
            OrientObjectOnSphere(clickedLocMesh, vect3D.x, vect3D.y, vect3D.z);
        }
    }

    window.addEventListener("wheel", (event) => {
        switch(event.deltaY){
            case -100:
                controls.current.zoomSpeed = (cameraDistToOrg() - 20) / 50 * 2; // slow down on zoom in
                break;
            case 100:
                controls.current.zoomSpeed = (cameraDistToOrg() - 20) / 50 * 5;
                break;
        }
        controls.current.rotateSpeed = (cameraDistToOrg() - 20) / 50;
    });

    function cameraDistToOrg() {
        return Math.sqrt(camera.position.x * camera.position.x + camera.position.y * camera.position.y + camera.position.z * camera.position.z)
    }

    function OrientObjectOnSphere(object, objX, objY, objZ){
        const normalVectors = new THREE.Vector3(objX, objY, objZ).normalize();
        object.current.lookAt(object.current.position.clone().add(normalVectors));
    }
    
    useFrame((state, delta) =>{
        planetRef.current.rotation.y += 0.01 * delta;
        cloudsRef.current.rotation.y += 0.02 * delta;
    })

    return<>
        <orbitControls ref={ controls } args={[camera, gl.domElement]} 
        enableDamping={true}
        dampingFactor={1}
        maxDistance={70}
        minDistance={20.3}
        enablePan={false}/>

        <directionalLight args={[0xffffff, 1, 400, 0]} position={[-50, 0, 50]}/>
        <ambientLight args={[0xffffff, 0.15]}/>

        {/* Stars */}
        <points>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={count}
                    array={positions}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial size={Math.random()}/>
        </points>

        {/* Planet */}
        <mesh ref={ planetRef } onClick={planetClick}> 
            <sphereGeometry args={[radius, 300, 300]}/>
            <meshStandardMaterial 
                map={planetColorMap} 
                normalMap={planetNormalMap}
                displacementMap={planetHeightMap}
                displacementScale={0.5}    
            />
        </mesh>

        {/* Clouds */}
        <mesh ref={cloudsRef}>
            <sphereGeometry args={[radius + 0.4, 32, 32]}/>
            <meshStandardMaterial
                map={cloudsColorMap}
                side={THREE.DoubleSide}
                transparent
                opacity={0.5}
                color={'#f0d4a8'}
            />
        </mesh>

        {/* Planet Glow */}
        <mesh>
            <sphereGeometry args={[radius+15, 30, 30]}/>
            <shaderMaterial
                vertexShader={ planetGlowVertex }
                fragmentShader={planetGlowFragment}
                blending={THREE.AdditiveBlending}
                side={THREE.BackSide}
            />
        </mesh>

        {/* Base Location */}
        <mesh position={[playerBaseLocation.x, playerBaseLocation.y, playerBaseLocation.z]} visible={false}>
            <sphereGeometry args={[0.5, 4, 4]}/>
            <meshBasicMaterial/>
            <Html ref={baseLocUI} wrapperClass="locationUI">
                <SurfaceIcon ownedParcel={onwedParcel} IconComponent={HomeIcon} parcelType={"Owned Parcel"}/>                       
            </Html>
        </mesh>

        {/* Clicked location */}
        <mesh ref={clickedLocMesh} visible={false}>
            <planeGeometry args={[1, 1, 2, 2]}/>
            <meshStandardMaterial/>
            <Html ref={clickedLocUI} wrapperClass="locationUI" occlude={false} style={{display: 'none'}}>
                <SurfaceIcon lat={clickedLoc.lat} lng={clickedLoc.lng} IconComponent={SewingPinFilledIcon} parcelType={"Clicked Parcel"}/>
            </Html>
        </mesh>

        {/* Loading Overlay */}
        <mesh ref={loadingOverlay}>
            <planeGeometry args={[2, 2, 1, 1]}/>
            <shaderMaterial 
                transparent='true'
                vertexShader={loadingVertex}
                fragmentShader={loadingFragment}
                uniforms={loadingUniforms}
            />
            <Html ref={htmlLoadingOverlay}>
                <div className="loadingContainer">
                    <img src="/img/BGSIconWhite.png" id="loadingIcon"/>
                </div>
            </Html>
        </mesh>

        {/* idea for loader: refrence the plane geometry for loading overlay as <mesh>, apply <Html> tag to it with BGS Icon */}
    </>
}
