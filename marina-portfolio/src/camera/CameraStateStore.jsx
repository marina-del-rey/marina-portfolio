import { create } from 'zustand';

export const useCameraStateStore = create((set) => ({
    cameraState: 'default',

    default: () => {
        set((state) => ({
            cameraState: (state.cameraState = 'default')
        }));
    },
    desktopMonitor: () => {
        set((state) => ({
            cameraState: (state.cameraState = 'desktopMonitor')
        }));
    },

    // camera properties
    enable: true,
}));