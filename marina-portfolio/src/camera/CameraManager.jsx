/* eslint-disable no-unused-vars */
import { useEffect, useRef } from 'react';
import { CameraControls } from '@react-three/drei';
import { useCameraStateStore } from './CameraStateStore';
import { gsap } from 'gsap';

const CameraManager = () => {
    const cameraControlsRef = useRef();

    // variables for state management 
    const cameraState = useCameraStateStore((state) => state.cameraState);
    const monitorMesh = useCameraStateStore((state) => state.monitorMesh);
    const floorMaterialRef = useCameraStateStore((state) => state.floorMaterialRef);
    const zoomedIn = useCameraStateStore((state) => state.zoomedIn);
    const enable = useCameraStateStore((state) => state.enable);

    // animate opacity of floor material (where chair is located)
    useEffect(() => {
        if (floorMaterialRef) {
            gsap.to(floorMaterialRef, {
                opacity: zoomedIn ? 0 : 1, // adjust opacity based on zoom state
                duration: 0.5, // smooth transition duration
                ease: 'power2.out', 
            });
        }
    }, [zoomedIn, floorMaterialRef]);

    useEffect(() => {
        if (cameraState === 'default') {
            cameraControlsRef.current.setLookAt(-60, 60, 60, 0, 0, 0, true);
        }
        else if (cameraState === 'desktopMonitor') {
            cameraControlsRef.current.fitToBox(monitorMesh, true, {
                paddingLeft: 0,
                paddingRight: 0,
                paddingBottom: 5,
                paddingTop: 1,
            });        
        }
    }, [cameraState]);

    // DEBUG
    // useEffect(() => {
    //     if (monitorMesh) {
    //         console.log("monitor mesh: ", monitorMesh);
    //     }
    // }, [monitorMesh]);

    return (
        <CameraControls
            ref={cameraControlsRef}
            makeDefault={true}
            enabled={enable}
        />
    )
};

export default CameraManager;