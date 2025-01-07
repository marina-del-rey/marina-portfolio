import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Perf } from 'r3f-perf';
import { useControls } from 'leva'
import CameraManager from "./camera/CameraManager.jsx";
import RoomModel from './models/RoomModel.jsx';

const Room = () => {
    // const { position, intensity } = useControls('directional light', {
    //     position: { value: [-46, 53, 4], step: 1 }, 
    //     intensity: { value: 3, max: 50, min: 0, step: 1 }
    // });

    return (
        <Canvas 
            orthographic 
            camera={{ position: [-60, 60, 60], zoom: 6 }} 
        >
            {/* <Perf /> */}
            <ambientLight intensity={3.5} />
            <OrbitControls />
            <Suspense fallback={null}>
                <RoomModel />
                <CameraManager />
            </Suspense>
        </Canvas>
    );
};

export default Room;