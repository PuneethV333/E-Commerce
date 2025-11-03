
import React from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";

const AnimatedLink = ({ to, children }) => {
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    const overlay = document.getElementById("route-overlay");

    gsap.to(overlay, {
      y: 0,
      duration: 0.4,
      ease: "power2.inOut",
      onComplete: () => {
        gsap.to(overlay, {
          y: 0,
          duration: 0.2,
          repeat: 1,
          yoyo: true, 
          onComplete: () => {
            navigate(to);

            
            gsap.to(overlay, { y: "-100%", duration: 0.4, ease: "power2.inOut" });
          },
        });
      },
    });
  };

  return (
    <a href={to} onClick={handleClick}>
      {children}
    </a>
  );
};

export default AnimatedLink;
