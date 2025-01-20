import { Suspense } from "react";
import { EffectComposer, Outline, Selection } from '@react-three/postprocessing';
import CameraManager from "../camera/CameraManager.jsx";
import RoomModel from '../models/RoomModel.jsx';

const Experience = () => {
    return (
        <>
            <ambientLight intensity={3.5} />
            <Suspense fallback={null}>
                <Selection>
                    <EffectComposer autoClear={false}>
                        <Outline
                            blur
                            visibleEdgeColor="white"
                            hiddenEdgeColor="grey"
                            edgeStrength={2.5}
                        />
                    </EffectComposer>
                    <RoomModel />
                    <CameraManager />
                </Selection>
            </Suspense>
        </>
    );
};

export default Experience;