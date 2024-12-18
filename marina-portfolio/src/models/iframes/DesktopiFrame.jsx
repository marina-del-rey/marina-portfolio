import React, { useMemo, useRef } from 'react';
import { Html } from '@react-three/drei';
import { useControls } from 'leva'

const DesktopiFrame = React.memo(() => {
    const { position, intensity } = useControls('iframe', {
        position: { value: [2.125, 3.03, 3.69], step: 1 }, 
    });

    const iframeRef = useRef(null);

    return (
    <group>
        <Html
            rotation-y={Math.PI}
            wrapperClass="htmlScreen"
            distanceFactor={0.50}
            position={[2.125, 3.03, 3.69]}
            zIndexRange={[2, 1]}
        >
            <iframe
                width={200}
                height={100}
                title="embed"
                src="https://www.google.com/webhp?igu=1"
                style={{ border: 'none' }}
                ref={iframeRef}
            />
        </Html>
    </group>
    );
});

DesktopiFrame.displayName = 'DesktopiFrame';

export default DesktopiFrame;