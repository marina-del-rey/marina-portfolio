import { useEffect, useState } from "react";
import { useCameraStateStore } from '../camera/CameraStateStore';

const Overlay = () => {
    const [isVisible, setIsVisible] = useState(false);
    const zoomedIn = useCameraStateStore((state) => state.zoomedIn);

    useEffect(() => {
        // update visibility based on zoom state
        if (zoomedIn) {
            setIsVisible(false); // fade out when zooming in
        } else {
          setTimeout(() => {
            setIsVisible(true); // fade in when zooming out
          }, 500); 
        }
      }, [zoomedIn]);

    return (
        <>
            <div 
                className={`fixed z-10 pointer-events-none ${isVisible ? "" : "opacity-0"} transition-opacity duration-100`}
            >
                <section className="h-screen w-screen max-w-screen-2xl mx-auto relative">
                    <div className="absolute left-[75px] top-[84%] transform -translate-y-1/2 p-2">
                        <h1 className="text-7xl font-extrabold m-0 leading-snug font-nunito">
                            Marina
                        </h1>
                        <h1 className="text-7xl ml-1 font-extrabold -mt-6 leading-snug font-nunito">
                            V. Novaes
                        </h1>
                        <p className="text-lg ml-2 -mt-2 text-gray-600 font-nunito">
                            Web Developer | Lisbon, Portugal
                        </p>
                    </div>
                </section>
            </div>
        </>
    );
};

export default Overlay;