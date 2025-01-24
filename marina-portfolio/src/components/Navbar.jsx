import { useEffect, useState } from "react";
import { useCameraStateStore } from '../camera/CameraStateStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsRotate } from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import logoImg from "../assets/images/keppy-loading.png";

const Navbar = () => {
    const [isVisible, setIsVisible] = useState(false);
    const zoomedIn = useCameraStateStore((state) => state.zoomedIn);
    const resetCamera = useCameraStateStore((state) => state.resetCameraState);

    useEffect(() => {
        if (zoomedIn) {
            setIsVisible(false); // fade out when zooming in
        } else {
            setTimeout(() => {
                setIsVisible(true); // fade in when zooming out
            }, 500); 
        }
    }, [zoomedIn]);

    return (
        <header 
            className={`header fixed z-10 w-full p-3 pointer-events-none 
                transition-opacity duration-100 ${isVisible ? "" : "opacity-0"}`}
        >
            <div className="flex justify-between items-center w-full">  
                {/* <h1 className="ml-4 p-2">logo</h1> */}
                <img 
                    src={logoImg} 
                    className="w-[78px] h-[66px] hover:drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)]
                        hover:scale-x-[-1] transition-transform duration-500 pointer-events-auto" 
                />
                <nav className="flex text-lg gap-4 mt-10 lg:mt-7 mr-2 font-medium">
                    {/* reset camera button */}
                    <button
                        className="mt-[-40px] font-nunito bg-indigo-900 text-white text-lg font-bold py-1 px-3 rounded-xl pointer-events-auto
                            active:translate-y-2 active:[box-shadow:0_0px_0_0_#ab99bd]
                            hover:translate-y-2 hover:[box-shadow:0_0px_0_0_#ab99bd]
                            transition-all duration-500 [box-shadow:0_8px_0_0_#ab99bd]
                            group"
                        onClick={() => {
                            resetCamera(); 
                        }}
                    >
                        <FontAwesomeIcon icon={faArrowsRotate} className="group-hover:animate-spin" />
                    </button>
                    {/* github button */}
                    <button
                        className="mt-[-40px] font-nunito bg-indigo-900 text-white text-lg font-bold py-1 px-3 rounded-xl pointer-events-auto
                            active:translate-y-2 active:[box-shadow:0_0px_0_0_#ab99bd]
                            hover:translate-y-2 hover:[box-shadow:0_0px_0_0_#ab99bd]
                            transition-all duration-500 [box-shadow:0_8px_0_0_#ab99bd]"
                        onClick={() => window.open('https://github.com/marina-del-rey/marina-portfolio', '_blank', 'noopener,noreferrer')}
                    >
                        <FontAwesomeIcon icon={faGithub} />
                    </button>
                </nav>
            </div>
        </header>
    );
};

export default Navbar;