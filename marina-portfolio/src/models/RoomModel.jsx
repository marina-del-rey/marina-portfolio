import { useGLTF, useTexture } from '@react-three/drei';

const RoomModel = (props) => {
  const { nodes } = useGLTF('models/room-test.glb');

  // textures
  const roomTexture = useTexture('textures/RoomBake.jpg');
  roomTexture.flipY = false;
  const floorTexture = useTexture('textures/FloorBake.jpg');
  floorTexture.flipY = false;
  const deskTexture = useTexture('textures/DeskBake.jpg');
  deskTexture.flipY = false;
  const wallDecorTexture = useTexture('textures/WallBake.jpg');
  wallDecorTexture.flipY = false;
  const shelfTexture = useTexture('textures/ShelfBake.jpg');
  shelfTexture.flipY = false;

  return (
    <group {...props} dispose={null}>
        <mesh
          geometry={nodes.room.geometry}  
          position={nodes.room.position}
          rotation={nodes.room.rotation}
          scale={10}
        >
          <meshStandardMaterial map={roomTexture} />  
        </mesh>
        <mesh
          geometry={nodes.floor.geometry}  
          position={nodes.floor.position}
          rotation={nodes.floor.rotation}
          scale={10}
        >
          <meshStandardMaterial map={floorTexture} />  
        </mesh>
        <mesh
          geometry={nodes.desk.geometry}  
          position={nodes.desk.position}
          rotation={nodes.desk.rotation}
          scale={5}
        >
          <meshStandardMaterial map={deskTexture} />  
        </mesh>
        <mesh
          geometry={nodes.walldecor.geometry}  
          position={nodes.walldecor.position}
          rotation={nodes.walldecor.rotation}
          scale={10}
        >
          <meshStandardMaterial map={wallDecorTexture} />  
        </mesh>
        <mesh
          geometry={nodes.shelf.geometry}  
          position={nodes.shelf.position}
          rotation={nodes.shelf.rotation}
          scale={4.5}
        >
          <meshStandardMaterial map={shelfTexture} />  
        </mesh>
    </group>
  )
};

export default RoomModel;
useGLTF.preload('models/room-test.glb');
useTexture.preload('textures/RoomBake.jpg')
useTexture.preload('textures/FloorBake.jpg');
useTexture.preload('textures/DeskBake.jpg');
useTexture.preload('textures/WallBake.jpg');
useTexture.preload('textures/ShelfBake.jpg');