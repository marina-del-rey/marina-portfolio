import { useEffect, useState } from "react";
import { useProgress } from "@react-three/drei";
import keppyLoading from "../assets/images/keppy-enter.png";
import keppyLoaded from "../assets/images/keppy-loading.png";

const LoadingScreen = (props) => {
    const { started, setStarted } = props;
    const { progress } = useProgress();

    const [showButton, setShowButton] = useState(false);
    const [fadeIn, setFadeIn] = useState(false);

    useEffect(() => {
      if (progress === 100) {
        setTimeout(() => {
          setShowButton(true);
          setTimeout(() => setFadeIn(true), 50); 
        }, 500);
      }
    }, [progress])

      return (
        <div
          className={`fixed top-0 left-0 w-full h-full z-50 transition-opacity duration-500
            pointer-events-none flex items-center justify-center ${started ? "opacity-0" : "opacity-100"}`}
        >
          <div className="relative w-1/3 flex flex-col items-center justify-center"> 
            {!showButton && (
            <>
              <h1 className="font-extrabold font-nunito text-xl mb-3 z-10 leading-snug select-none">Loading portfolio...</h1> 
              <div className="w-full h-2 bg-indigo-900 bg-opacity-40 rounded-md overflow-hidden mt-1"> 
                <div
                  className="h-full bg-indigo-900 transition-all duration-500 rounded-md"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </>
            )}
            {showButton && (
              <>
                <div
                    className={`flex flex-col items-center transition-opacity duration-1000 mt-[-110px] ${
                      fadeIn ? "opacity-100" : "opacity-0"
                    }`}
                >                  
                  <img
                    src={keppyLoaded}
                    alt="keppy-loaded"
                    className="select-none mr-2 scale-[0.8] block"
                  />
                  <button
                    className="mt-[-40px] font-nunito bg-indigo-900 text-white text-lg font-bold py-3 px-5 rounded-xl pointer-events-auto
                      active:translate-y-2 active:[box-shadow:0_0px_0_0_#ab99bd]
                      hover:translate-y-2 hover:[box-shadow:0_0px_0_0_#ab99bd]
                      transition-all duration-500 [box-shadow:0_8px_0_0_#ab99bd]"
                    onClick={() => {
                      setTimeout(() => {
                        setStarted(true);
                      }, 500); 
                    }}
                  >
                    Enter room »
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      );
};

export default LoadingScreen;