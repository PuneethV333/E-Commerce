import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";

const RouteTransitionOverlay = React.forwardRef((props, ref) => {
  const overlayRef = ref || useRef(null);
  const leftPlug = useRef(null);
  const rightPlug = useRef(null);
  const spark = useRef(null);

  useEffect(() => {
    
    gsap.set([leftPlug.current, rightPlug.current, spark.current], { opacity: 0 });
  }, []);

  return (
    <div
      id="route-overlay"
      ref={overlayRef}
      className="fixed inset-0 bg-white z-[9998] translate-y-full flex items-center justify-center"
    >
      <div className="relative flex items-center justify-center">
        {/* Left Plug */}
        <div
          ref={leftPlug}
          className="w-16 h-8 bg-gray-300 rounded-l-full flex items-center justify-end pr-2 shadow-md"
          style={{ transform: "translateX(-150px)" }}
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
          style={{ transform: "translateX(150px)" }}
        >
          <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
        </div>
      </div>
    </div>
  );
});

export default RouteTransitionOverlay;
