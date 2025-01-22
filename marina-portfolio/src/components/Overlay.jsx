import { useEffect, useState } from "react";
import { useCameraStateStore } from '../camera/CameraStateStore';
import { motion, AnimatePresence } from "framer-motion";

const Overlay = () => {
    const [isVisible, setIsVisible] = useState(false);
    const zoomedIn = useCameraStateStore((state) => state.zoomedIn);

    useEffect(() => {
        if (zoomedIn) {
            setIsVisible(false); // fade out when zooming in
        } else {
            setTimeout(() => {
                setIsVisible(true); // fade in when zooming out
            }, 500); 
        }
    }, [zoomedIn]);

    const containerVariants = {
        hidden: { opacity: 0, x: -75 },  
        visible: { 
            opacity: 1, 
            x: 0,  
            transition: { duration: 0.75 }
        }
    };

    return (
        <>
            <div 
                className={`fixed z-10 pointer-events-none transition-opacity duration-100 ${isVisible ? "" : "opacity-0"}`}
            >
                <AnimatePresence>
                    {isVisible && (
                        <motion.section
                            className="h-screen w-screen max-w-screen-2xl mx-auto relative"
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            variants={containerVariants}
                        >
                            <div className="absolute left-[55px] top-[85%] transform -translate-y-1/2 p-2">
                                <h1 className="text-7xl font-extrabold m-0 leading-snug font-nunito">
                                    Marina
                                </h1>
                                <h1 className="text-7xl ml-1 font-extrabold -mt-6 leading-snug font-nunito">
                                    V. Novaes
                                </h1>
                                <p className="text-lg ml-2 -mt-4 text-gray-600 font-nunito">
                                    Web Developer | Lisbon, Portugal
                                </p>
                            </div>
                        </motion.section>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
};

export default Overlay;
