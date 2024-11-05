import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import './App.css';

const CameraController = ({ setOrbitEnabled, isFocused, cubeRef, setCameraTarget, savedCameraState, setSavedCameraState }) => { 
  const { camera } = useThree();

  const focusOnFrontFace = () => {
    // save the current camera position and target before moving it
    setSavedCameraState({
      position: camera.position.clone(),
      target: new THREE.Vector3(0, 0, 0)
    });

    // set the new camera target and disable OrbitControls
    setCameraTarget({
      position: new THREE.Vector3(0, 0, 5),
      target: new THREE.Vector3(0, 0, 0)
    });
    setOrbitEnabled(false);
  };

  const resetCamera = () => {
    const { position, target } = savedCameraState;

    // set the camera's position and orientation
    camera.position.copy(position);
    camera.lookAt(target);
    camera.updateProjectionMatrix();
  
    setCameraTarget(savedCameraState); 
    setOrbitEnabled(true); 
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!isFocused) return;

      // raycaster to check if the click was on the cube
      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1
      );

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObject(cubeRef.current);

      // if the click did not intersect with the cube, reset the camera
      if (intersects.length === 0) {
        resetCamera();
      }
    };

    window.addEventListener("mousedown", handleOutsideClick);

    return () => {
      window.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isFocused, camera, cubeRef]);

  return (
    <Html position={[0, 0, 0]}>
      <button
        onClick={focusOnFrontFace}
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          zIndex: 1,
          height: '50px',
          width: '100px',
          background: 'rgba(255, 255, 255, 0.8)',
          border: 'none',
          cursor: 'pointer',
          borderRadius: '4px' 
        }}
      >
        Zoom in
      </button>
    </Html>
  );
};

const CameraAnimator = ({ cameraTarget, orbitEnabled }) => {
  const { camera } = useThree();

  useFrame(() => {
    if (orbitEnabled) return;

    const { position, target } = cameraTarget;
    //console.log(cameraTarget); // DEBUG
    camera.position.lerp(position, 0.1);
    camera.lookAt(
      THREE.MathUtils.lerp(camera.position.x, target.x, 0.1),
      THREE.MathUtils.lerp(camera.position.y, target.y, 0.1),
      THREE.MathUtils.lerp(camera.position.z, target.z, 0.1)
    );
    camera.updateProjectionMatrix();
  });

  return null;
};

const App = () => {
  const [orbitEnabled, setOrbitEnabled] = useState(true);
  const [cameraTarget, setCameraTarget] = useState({
    position: new THREE.Vector3(0, 2, 15),
    target: new THREE.Vector3(0, 0, 0),
  });
  const [savedCameraState, setSavedCameraState] = useState({
    position: new THREE.Vector3(0, 2, 15),
    target: new THREE.Vector3(0, 0, 0),
  });
  const cubeRef = useRef();

  return (
    <Canvas dpr={[1, 1.5]} camera={{ fov: 80, position: [0, 2, 15] }}>
      <CameraController 
        setOrbitEnabled={setOrbitEnabled} 
        isFocused={!orbitEnabled} 
        cubeRef={cubeRef} 
        setCameraTarget={setCameraTarget}
        savedCameraState={savedCameraState}
        setSavedCameraState={setSavedCameraState} 
      />
      <CameraAnimator 
        cameraTarget={cameraTarget} 
        orbitEnabled={orbitEnabled}  
      />
      <mesh ref={cubeRef} position={[0, 0, 0]}>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color={"pink"} />
      </mesh>
      <directionalLight position={[0, 0, 2]} />
      <OrbitControls enabled={orbitEnabled} />
    </Canvas>
  );
};

export default App;