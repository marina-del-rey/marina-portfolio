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

    </group>
    );
});

DesktopiFrame.displayName = 'DesktopiFrame';

export default DesktopiFrame;