/* eslint-disable react/display-name */
/* eslint-disable no-unused-vars */
import { memo, useEffect, useRef } from 'react';
import { useGLTF, useTexture } from '@react-three/drei';
import { useCameraStateStore } from '../camera/CameraStateStore';
import DesktopMonitor from './DesktopMonitor';

const RoomModel = memo(() => {
  const { nodes } = useGLTF('models/room_final_Export.glb');
  console.log(nodes); // DEBUG

  // textures
  const roomTexture = useTexture('textures/RoomBake.png');
  roomTexture.flipY = false;
  const floorTexture = useTexture('textures/FloorBake.png');
  floorTexture.flipY = false;
  const deskTexture = useTexture('textures/DeskBake.png');
  deskTexture.flipY = false;
  const wallDecorTexture = useTexture('textures/WallBake.png');
  wallDecorTexture.flipY = false;
  const shelfTexture = useTexture('textures/ShelfBake.png');
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

  return (
    <group
      onClick={
        cameraState === 'default' ? undefined : defaultState
      }
    >
        <mesh
          geometry={nodes.room.geometry}  
          position={nodes.room.position}
          rotation={nodes.room.rotation}
        >
          <meshStandardMaterial map={roomTexture} />  
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
          />  
        </mesh>
        <mesh
          geometry={nodes.desk.geometry}  
          position={nodes.desk.position}
          rotation={nodes.desk.rotation}
        >
          <meshStandardMaterial map={deskTexture} />  
        </mesh>
        <mesh
          geometry={nodes.walldecor.geometry}  
          position={nodes.walldecor.position}
          rotation={nodes.walldecor.rotation}
        >
          <meshStandardMaterial map={wallDecorTexture} />  
        </mesh>
        <mesh
          geometry={nodes.shelf.geometry}  
          position={nodes.shelf.position}
          rotation={nodes.shelf.rotation}
        >
          <meshStandardMaterial map={shelfTexture} />  
        </mesh>
        <DesktopMonitor node={nodes.desktopscreen} />
    </group>
  )
});

export default RoomModel;
useGLTF.preload('models/room_final_Export.glb');
useTexture.preload('textures/RoomBake.png')
useTexture.preload('textures/FloorBake.png');
useTexture.preload('textures/DeskBake.png');
useTexture.preload('textures/WallBake.png');
useTexture.preload('textures/ShelfBake.png');