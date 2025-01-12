/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { memo, useState, useEffect } from 'react';
import { Select } from '@react-three/postprocessing';
import { useCameraStateStore } from '../camera/CameraStateStore';
import DesktopiFrame from '../iframes/DesktopiFrame';

const DesktopMonitor = memo(({ node }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isMonitorHovered, setIsMonitorHovered] = useState(null);

    // update monitor mesh
    const setMonitorMesh = useCameraStateStore((state) => state.setMonitorMesh);
    useEffect(() => {
        setMonitorMesh(node);
    }, [node, setMonitorMesh]);

    // camera states
    const cameraState = useCameraStateStore((state) => state.cameraState);
    const defaultState = useCameraStateStore((state) => state.default);
    const desktopMonitorState = useCameraStateStore((state) => state.desktopMonitor);

    // console.log(node.position);
    // console.log(cameraState);
    
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
                <DesktopiFrame />            
                <meshStandardMaterial color={"#000000"} />  
            </mesh>
        </>
    );
});

export default DesktopMonitor;