"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";

gsap.registerPlugin(ScrollTrigger);

const ScrollAnimation = () => {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Initialize Lenis for smooth scrolling
    lenisRef.current = new Lenis({
      duration: 1.2,
    //   easing: (t) => t, // linear
      smoothWheel: true,
    //   smoothTouch: true,
    });

    function raf(time: number) {
      lenisRef.current?.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // GSAP ScrollTrigger animation
    gsap.utils.toArray(".element").forEach((el: any) => {
      gsap.from(el, {
        opacity: 100,
        y: 90,
        scrollTrigger: {
          trigger: el,
          start: "top 0%",
          end: "top 0%",
          scrub: true,
        },
      });
    });

    // Cleanup
    return () => {
      lenisRef.current?.destroy();
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return (
    <>
      <div className="element h-auto w-full flex justify-center items-center flex-col">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="h-[40vh] w-2/3 bg-blue-400 flex justify-center items-center mb-4"
          >
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique,
            dolores impedit laudantium debitis mollitia natus ex quod libero
            harum eius.
          </div>
        ))}
      </div>

      <div className="element h-screen w-full bg-amber-200 flex justify-center items-center">
        Scroll-triggered Animation
      </div>
      <div className="element h-screen w-full bg-cyan-500 flex justify-center items-center">
        Scroll-triggered Animation
      </div>
      <div className="element h-screen w-full bg-fuchsia-400 flex justify-center items-center">
        Scroll-triggered Animation
      </div>
      <div className="element h-screen w-full bg-green-400 flex justify-center items-center">
        Scroll-triggered Animation
      </div>
    </>
  );
};

export default ScrollAnimation;
