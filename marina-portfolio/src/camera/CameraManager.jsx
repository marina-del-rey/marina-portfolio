/* eslint-disable no-unused-vars */
import { useEffect, useRef } from 'react';
import { CameraControls } from '@react-three/drei';
import { useCameraStateStore } from './CameraStateStore';

const CameraManager = () => {
    const cameraControlsRef = useRef();

    // camera states
    const cameraState = useCameraStateStore((state) => state.cameraState);
    const enable = useCameraStateStore((state) => state.enable);

    useEffect(() => {
        if (cameraState === 'default') {
            cameraControlsRef.current.setLookAt(-60, 60, 60, 0, 0, 0, true);
        }
        else if (cameraState === 'desktopMonitor') {
            cameraControlsRef.current.setLookAt(-24.5, 20.3, 25.5, 0, 0, 0, true);
            console.log(cameraControlsRef.current);
        }
    });

    return (
        <CameraControls
            ref={cameraControlsRef}
            makeDefault={true}
            enabled={enable}
        />
    )


};

export default CameraManager;