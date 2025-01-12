/* eslint-disable react/display-name */
import { memo, useRef, useMemo } from 'react';
import { Html } from '@react-three/drei';
import { useCameraStateStore } from '../camera/CameraStateStore';

const DesktopiFrame = memo(() => {
    const iframeRef = useRef(null);
    const cameraState = useCameraStateStore((state) => state.cameraState);

    const isDesktop = useMemo(() => cameraState === 'desktopMonitor', [cameraState]);

    return (
        <group>
            {isDesktop && (
                <Html
                    transform
                    wrapperClass='desktop-monitor'
                    // position={[-24.5, 25.5, -39.76]}
                    // distanceFactor={1.75}
                    // scale={[3, 2.40, 0.077]}
                    position={[0, 0, -1]}
                    distanceFactor={1.75}
                    scale={[-0.39,-0.55, 1]}
                    zIndexRange={[2, 1]}
                >
                    <iframe
                        src="http://127.0.0.1:5500/html-os/index.html"
                        ref={iframeRef}
                    />
                </Html>
            )}
        </group>
    );
});

export default DesktopiFrame;