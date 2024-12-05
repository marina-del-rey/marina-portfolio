/*
  Auto-generated by: https://github.com/pmndrs/gltfjsx
*/
import { useGLTF } from '@react-three/drei';

const RoomModel = (props) => {
  const { nodes, materials } = useGLTF('models/room-transformed.glb');
  return (
    <group {...props} dispose={null}>
      <mesh 
        castShadow
        receiveShadow
        geometry={nodes.Cube002.geometry} 
        material={materials.PaletteMaterial001} 
        position={[23, 8.336, 27.5]}  
        rotation={[0, Math.PI / 2, 0]}
      />
    </group>
  )
};

export default RoomModel;
useGLTF.preload('models/room-transformed.glb');
