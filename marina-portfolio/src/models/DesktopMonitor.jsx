/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { memo, useState, useEffect, useCallback } from 'react';
import { useTexture } from '@react-three/drei';
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
    // change cursor style based on hover state
    useEffect(() => {
        document.body.style.cursor = isHovered ? 'pointer' : 'auto';
    }, [isHovered]);

    // callbacks for hover events
    const onPointerOver = useCallback(() => setIsHovered(true), []);
    const onPointerOut = useCallback(() => setIsHovered(false), []);
    
    // video texture
    const desktopWallpaper = useTexture('textures/Presentation.gif');

    return (
        <>
            <Select enabled={isMonitorHovered}>
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
                onPointerOver={
                    cameraState === 'default'
                        ? () => {
                            onPointerOver();
                            setIsMonitorHovered(true);
                          }
                        : undefined
                }
                onPointerOut={
                    cameraState === 'default'
                        ? () => {
                            onPointerOut();
                            setIsMonitorHovered(false);
                          }
                        : undefined
                }
            >
                <DesktopiFrame />            
                <meshStandardMaterial color={"#000000"} />  
                {/* <meshBasicMaterial
                    map={desktopWallpaper}
                    toneMapped={false}
                /> */}
            </mesh>
            </Select>
        </>
    );
});

export default DesktopMonitor;