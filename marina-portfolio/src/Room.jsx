import { Suspense, useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useHelper } from "@react-three/drei";
import RoomModel from './models/RoomModel.jsx';
import { Perf } from 'r3f-perf';
import { useControls } from 'leva'
import { DirectionalLightHelper, CameraHelper } from "three";

const DirectionalLightWithHelper = ({ position, intensity, near, far }) => {
    const directionalLightRef = useRef(null);
    const shadowCameraHelperRef = useRef(null);

    useHelper(directionalLightRef, DirectionalLightHelper, 5, "pink");
    
    useEffect(() => {
        if (directionalLightRef.current) {
            const shadowCamera = directionalLightRef.current.shadow.camera;
            shadowCameraHelperRef.current = new CameraHelper(shadowCamera);
            directionalLightRef.current.parent.add(shadowCameraHelperRef.current);
        }

        return () => {
            if (shadowCameraHelperRef.current) {
                directionalLightRef.current.parent.remove(shadowCameraHelperRef.current);
            }
        };
    }, [directionalLightRef]);

    return (
        <directionalLight
            position={position}
            intensity={intensity}
            ref={directionalLightRef}
            shadow-camera-left={-65}
            shadow-camera-right={55}
            shadow-camera-top={100}
            shadow-camera-bottom={-50}
            shadow-camera-near={50}
            shadow-camera-far={108} 
            shadow-bias={-0.06}
            color="#F2F2F2"
            castShadow
        />
    );
};

const Room = () => {
    const { position, intensity } = useControls('directional light', {
        position: { value: [-46, 53, 4], step: 1 }, 
        intensity: { value: 3, max: 50, min: 0, step: 1 }
    });

    return (
        <Canvas orthographic camera={{ position: [-60, 60, 60], zoom: 6 }} shadows>
            <DirectionalLightWithHelper position={position} intensity={intensity} />
            <ambientLight intensity={1} />
            <OrbitControls />
            <Suspense fallback={null}>
                <RoomModel />
            </Suspense>
        </Canvas>
    );
};

export default Room;