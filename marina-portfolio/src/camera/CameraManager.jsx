/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from 'react';
import { useThree } from '@react-three/fiber';
import { CameraControls } from '@react-three/drei';
import { useCameraStateStore } from './CameraStateStore';
import { gsap } from 'gsap';
import * as THREE from 'three';

const CameraManager = () => {
    const cameraControlsRef = useRef();
    // const boundingBoxRef = useRef();
    // const { scene } = useThree();

    // variables for state management 
    const cameraState = useCameraStateStore((state) => state.cameraState);
    const monitorMesh = useCameraStateStore((state) => state.monitorMesh);
    const floorMaterialRef = useCameraStateStore((state) => state.floorMaterialRef);
    const zoomedIn = useCameraStateStore((state) => state.zoomedIn);
    const enable = useCameraStateStore((state) => state.enable);
    const minZoom = useCameraStateStore((state) => state.minZoom);
    const maxZoom = useCameraStateStore ((state) => state.maxZoom);

    const [screenSize, setScreenSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    // handle window resize
    useEffect(() => {
        const handleResize = () => {
            setScreenSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // get zoom settings based on screen size
    const getZoomSettings = () => {
        if (screenSize.width <= 320) {
            return { minZoom: 1, maxZoom: 4, zoom: 2 }; // mobile S
        } else if (screenSize.width <= 375) {
            return { minZoom: 1.5, maxZoom: 5, zoom: 2.5 }; // mobile M
        } else if (screenSize.width <= 425) {
            return { minZoom: 2, maxZoom: 6, zoom: 3 }; // mobile L
        } else if (screenSize.width <= 768) {
            return { minZoom: 3, maxZoom: 7, zoom: 5 }; // tablet
        } else {
            return { minZoom: 5, maxZoom: 12, zoom: 6 }; // default
        }
    };

    // apply zoom settings
    useEffect(() => {
        if (cameraControlsRef.current) {
            const { minZoom, maxZoom } = getZoomSettings();
            cameraControlsRef.current.minZoom = minZoom;
            cameraControlsRef.current.maxZoom = maxZoom;
        }
    }, [screenSize, zoomedIn]);

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
        switch (cameraState) {
            case 'default': {
                const { zoom } = getZoomSettings();
                const defaultPos = {
                    x: screenSize.width < 768 ? -40 : -60, 
                    y: screenSize.width < 768 ? 40 : 60, 
                    z: screenSize.width < 768 ? 40 : 60, 
                };

                cameraControlsRef.current.setLookAt(defaultPos.x, defaultPos.y, defaultPos.z, 0, 0, 0, true);
                cameraControlsRef.current.zoomTo(zoom, true);
                cameraControlsRef.current.setFocalOffset(0, 0, 0, true);
                break;
            }
            case 'desktopMonitor': {
                const camera = cameraControlsRef.current._camera;
                const { x, y, z } = camera.position;
                const r = Math.sqrt(x * x + y * y + z * z);
                
                const theta = Math.atan2(z, x);
                const phi = Math.asin(y / r)
                const targetTheta = Math.PI /2;
                const targetPhi = 0;
    
                const shortestAngularDistance = (current, target) => {
                    let delta = ((current - target + Math.PI) % (2 * Math.PI)) - Math.PI;
                    return delta;
                };
                const deltaTheta = shortestAngularDistance(theta, targetTheta);
                const deltaPhi = shortestAngularDistance(phi, targetPhi);
    
                cameraControlsRef.current.rotate(deltaTheta, deltaPhi, true);
                // =========================================================================== //
                // compute bounding box
                const aabb = new THREE.Box3().setFromObject(monitorMesh);
                aabb.expandByScalar(1);
                
                const padding = { left: 0, right: 0, bottom: 5.5, top: 1 };
                aabb.min.x -= padding.left;
                aabb.min.y -= padding.bottom;
                aabb.max.x += padding.right;
                aabb.max.y += padding.top;
    
                const size = aabb.getSize(new THREE.Vector3());
                const center = aabb.getCenter(new THREE.Vector3());
    
                const width = camera.right - camera.left;
                const height = camera.top - camera.bottom;
                const zoom = Math.min(width / size.x, height / size.y);   

                cameraControlsRef.current.minZoom = screenSize.width < 768 ? 20 : 30; 
                cameraControlsRef.current.maxZoom = Infinity;

                cameraControlsRef.current.moveTo(center.x, center.y, center.z, true);
                cameraControlsRef.current.zoom(zoom, true);
                cameraControlsRef.current.setFocalOffset(0, 0, 0, true);
                
                // helper for vizualization 
                // if (boundingBoxRef.current) {
                //     scene.remove(boundingBoxRef.current);
                //     boundingBoxRef.current = null;
                // } // DEBUG
                // boundingBoxRef.current = new THREE.Box3Helper(aabb, 0xff0000); // DEBUG
                // scene.add(boundingBoxRef.current); // DEBUG
                break;
            }
            case 'reset': {
                const { zoom } = getZoomSettings();
                const defaultPos = {
                    x: screenSize.width < 768 ? -40 : -60, 
                    y: screenSize.width < 768 ? 40 : 60, 
                    z: screenSize.width < 768 ? 40 : 60, 
                };

                cameraControlsRef.current.setLookAt(defaultPos.x, defaultPos.y, defaultPos.z, 0, 0, 0, true);
                cameraControlsRef.current.zoomTo(zoom, true);
                cameraControlsRef.current.setFocalOffset(0, 0, 0, true);
                break;
            }
            default: {
                console.log('unknown camera state:', cameraState);
                break;
            }
        }
    }, [cameraState]);

    return (
        <CameraControls
            ref={cameraControlsRef}
            makeDefault={true}
            enabled={enable}
            mouseButtons={{
                left: 1,
                middle: 0,
                right: 0,
                wheel: 16
            }}
            touches={{
                one: 32,
                two: 512
            }}
        />
    )
};

export default CameraManager;