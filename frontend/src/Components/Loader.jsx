
import React, { useEffect, useRef, useContext, useState } from "react";
import { gsap } from "gsap";
import { AuthContext } from "../Context/AuthProvider";

const Loader = () => {
  const { loading } = useContext(AuthContext); 
  const [animationDone, setAnimationDone] = useState(false);

  const loaderWrapper = useRef(null);
  const leftPlug = useRef(null);
  const rightPlug = useRef(null);
  const spark = useRef(null);

  useEffect(() => {

    const tl = gsap.timeline({
      onComplete: () => setAnimationDone(true), 
    });

    
    tl.fromTo(
      leftPlug.current,
      { x: "-150px", opacity: 0 },
      { x: "0px", opacity: 1, duration: 1, ease: "power3.out" }
    )
      
      .fromTo(
        rightPlug.current,
        { x: "150px", opacity: 0 },
        { x: "0px", opacity: 1, duration: 1, ease: "power3.out" },
        "<"
      )
      
      .to(
        spark.current,
        { scale: 1.6, opacity: 1, duration: 0.3, yoyo: true, repeat: 2, ease: "power2.inOut" },
        "+=0.2"
      );

    return () => tl.kill(); 
  }, []);

  
  useEffect(() => {
    if (animationDone && !loading) {
      gsap.to(loaderWrapper.current, {
        opacity: 0,
        duration: 0.8,
        onComplete: () => {
          loaderWrapper.current.style.display = "none";
        },
      });
    }
  }, [animationDone, loading]);

  return (
    <div
      ref={loaderWrapper}
      className="fixed inset-0 bg-white flex items-center justify-center z-[.9999]"
    >
      <div className="relative flex items-center justify-center">
        {/* Left Plug */}
        <div
          ref={leftPlug}
          className="w-16 h-8 bg-gray-300 rounded-l-full flex items-center justify-end pr-2 shadow-md"
        >
          <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
        </div>

        {/* Spark */}
        <div
          ref={spark}
          className="absolute w-4 h-4 bg-yellow-400 rounded-full opacity-0 shadow-[0_0_15px_#facc15]"
        ></div>

        {/* Right Plug */}
        <div
          ref={rightPlug}
          className="w-16 h-8 bg-gray-300 rounded-r-full flex items-center justify-start pl-2 shadow-md"
        >
          <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
