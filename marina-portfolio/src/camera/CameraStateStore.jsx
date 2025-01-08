import { create } from 'zustand';

export const useCameraStateStore = create((set) => ({
    cameraState: 'default', 
    monitorMesh: null,  
    floorMaterialRef: null,
    enable: true,
    zoomedIn: false,

    // function to set the monitor mesh
    setMonitorMesh: (mesh) => {
        set({ monitorMesh: mesh });
    },

    // function to set the floor material reference
    setFloorMaterialRef: (ref) => {
        set({ floorMaterialRef: ref });
    },

    // switch to the default state
    default: () => {
        set((state) => ({
            cameraState: (state.cameraState = 'default'),
            zoomedIn: (state.zoomedIn = false) // reset zoom state 
        }));
    },
    // switch to desktop monitor state
    desktopMonitor: () => {
        set((state) => ({
            cameraState: (state.cameraState = 'desktopMonitor'),
            zoomedIn: (state.zoomedIn = true) // set zoomed-in state
        }));
    },
}));