import { Canvas } from "@react-three/fiber";
import { Perf } from 'r3f-perf';
import Experience from "./components/Experience";
import Overlay from "./components/Overlay";

const App = () => {
    return (
        <>
            <section className='w-full h-135vh relative'>
                <Overlay />
                <Canvas 
                    orthographic 
                    camera={{ position: [-60, 60, 60], zoom: 6 }} 
                >
                    <color attach="background" args={["#fae0e4"]} />
                    <Experience />
                    {/* <Perf /> */}
                </Canvas>
            </section>
        </>
    );
};

export default App;