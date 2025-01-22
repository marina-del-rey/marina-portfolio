import { useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Perf } from 'r3f-perf';
import Experience from "./components/Experience";
import LoadingScreen from "./components/LoadingScreen";
import Navbar from "./components/Navbar";
import Overlay from "./components/Overlay";

const App = () => {
    const [started, setStarted] = useState(false);

    return (
        <>
            <section className='w-full h-138vh relative'>
                {started && 
                    <>
                        <Overlay />
                        <Navbar />
                    </>
                }
                <Canvas 
                    orthographic 
                    camera={{ position: [-60, 60, 60], zoom: 6 }} 
                >
                    <color attach="background" args={["#fae0e4"]} />
                    <Suspense>
                        {started && (
                            <Experience />
                        )}
                    </Suspense>
                    {/* <Perf /> */}
                </Canvas>
                <LoadingScreen started={started} setStarted={setStarted} />
            </section>
        </>
    );
};

export default App;