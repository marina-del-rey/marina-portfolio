/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { memo, useState} from 'react';
import { Select } from '@react-three/postprocessing';
import { useCameraStateStore } from '../camera/CameraStateStore';

const DesktopMonitor = memo(({ node }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isMonitorHovered, setIsMonitorHovered] = useState(null);

    // camera states
    const cameraState = useCameraStateStore((state) => state.cameraState);
    const defaultState = useCameraStateStore((state) => state.default);
    const desktopMonitorState = useCameraStateStore((state) => state.desktopMonitor);

    return (
        <>
            <mesh
                geometry={node.geometry}  
                position={node.position}
                rotation={node.rotation}
                scale={[-7.61, -4.783, -0.077]}
                onClick={
                    cameraState === 'default'
                    ? () => {
                        desktopMonitorState();
                        setIsMonitorHovered(false);
                    }
                    : undefined
                }
            >
                <meshStandardMaterial color={"#ffffff"} />  
            </mesh>
        </>
    );
});

export default DesktopMonitor;