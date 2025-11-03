import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

const PageTransition = ({ children }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;

        gsap.fromTo(
      el,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
    );

        return () => {
      gsap.to(el, { opacity: 0, y: -20, duration: 0.4, ease: "power2.in" });
    };
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen">
      {children}
    </div>
  );
};

export default PageTransition;
