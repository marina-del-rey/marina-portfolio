/* eslint-disable react/display-name */
/* eslint-disable no-unused-vars */
import { memo, useEffect, useRef, useState } from 'react';
import { useGLTF, useTexture } from '@react-three/drei';
import { useCameraStateStore } from '../camera/CameraStateStore';
import { useSpring, animated } from '@react-spring/three';
import DesktopMonitor from './DesktopMonitor';

const RoomModel = memo(() => {
  const { nodes } = useGLTF('models/output.glb');

  // textures
  const roomTexture = useTexture('textures/resized-RoomBake.png');
  roomTexture.flipY = false;
  const floorTexture = useTexture('textures/resized-FloorBake.png');
  floorTexture.flipY = false;
  const deskTexture = useTexture('textures/resized-DeskBake.png');
  deskTexture.flipY = false;
  const wallDecorTexture = useTexture('textures/resized-WallBake.png');
  wallDecorTexture.flipY = false;
  const shelfTexture = useTexture('textures/resized-ShelfBake.png');
  shelfTexture.flipY = false;

  // local ref for the floor material
  const materialRef = useRef();
  const setFloorMaterialRef = useCameraStateStore((state) => state.setFloorMaterialRef);

  useEffect(() => {
    if (materialRef.current) {
      setFloorMaterialRef(materialRef.current);
    }
  }, [materialRef, setFloorMaterialRef]);

  // camera states
  const cameraState = useCameraStateStore((state) => state.cameraState);
  const defaultState = useCameraStateStore((state) => state.default);

  // zoom in animation
  const [visible, setVisible] = useState(false);
  const { scale } = useSpring({
    scale: visible ? 1 : 0, 
    config: { mass: 1, tension: 50, friction: 20 },
  });

  useEffect(() => {
    setVisible(true); 
  }, []);

  return (
    <animated.group
      scale={scale} 
      position={[0, 0, 0]}
      onClick={
        cameraState === 'default' ? undefined : defaultState
      }
    >
        <mesh
          geometry={nodes.room.geometry}  
          position={nodes.room.position}
          rotation={nodes.room.rotation}
        >
          <meshStandardMaterial map={roomTexture} mipmaps />  
        </mesh>
        <mesh
          geometry={nodes.floor.geometry}  
          position={nodes.floor.position}
          rotation={nodes.floor.rotation}
        >
          <meshStandardMaterial 
            ref={materialRef}
            map={floorTexture} 
            transparent={true}
            opacity={1}
            mipmaps
          />  
        </mesh>
        <mesh
          geometry={nodes.desk.geometry}  
          position={nodes.desk.position}
          rotation={nodes.desk.rotation}
        >
          <meshStandardMaterial map={deskTexture} mipmaps />  
        </mesh>
        <mesh
          geometry={nodes.walldecor.geometry}  
          position={nodes.walldecor.position}
          rotation={nodes.walldecor.rotation}
        >
          <meshStandardMaterial map={wallDecorTexture} mipmaps />  
        </mesh>
        <mesh
          geometry={nodes.shelf.geometry}  
          position={nodes.shelf.position}
          rotation={nodes.shelf.rotation}
        >
          <meshStandardMaterial map={shelfTexture} mipmaps />  
        </mesh>
        <DesktopMonitor node={nodes.desktopscreen} />
    </animated.group>
  )
});

useGLTF.preload('models/output.glb');
useTexture.preload('textures/resized-RoomBake.png')
useTexture.preload('textures/resized-FloorBake.png');
useTexture.preload('textures/resized-DeskBake.png');
useTexture.preload('textures/resized-WallBake.png');
useTexture.preload('textures/resized-ShelfBake.png');
export default RoomModel;
