import React, { useCallback } from "react";
import "./Main.css";
// import Countdown from "react-countdown";
import Particles from "react-tsparticles";
import type { Container, Engine } from "tsparticles-engine";
import { loadFull } from "tsparticles";

const Main = () => {
  const particlesInit = useCallback(async (engine: Engine) => {
    console.log(engine);

    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback(
    async (container: Container | undefined) => {
      await console.log(container);
    },
    []
  );

  return (
    <div className="MainLayout">
      <Particle
        particlesInit={particlesInit}
        particlesLoaded={particlesLoaded}
      />
      <div className="Logo">대회 이름sex 자리</div>
      <div className="Logo">대회 이름 자리</div>
    </div>
  );
};

const Particle = (props: {
  particlesInit: (engine: Engine) => Promise<void>;
  particlesLoaded: (container: Container | undefined) => Promise<void>;
}) => (
  <Particles
    id="tsparticles"
    init={props.particlesInit}
    loaded={props.particlesLoaded}
    options={{
      fps_limit: 120,
      //   background: {
      //     color: "#212529",
      //     position: "absolute"
      //   },
      interactivity: {
        events: {
          onclick: { enable: true, mode: "push" },
          onhover: {
            enable: true,
            mode: "attract",
            parallax: { enable: false, force: 60, smooth: 10 },
          },
          resize: true,
        },
        modes: {
          push: { quantity: 4 },
          attract: { distance: 200, duration: 0.4, factor: 5 },
        },
      },
      particles: {
        color: { value: "#ffffff" },
        line_linked: {
          color: "#ffffff",
          distance: 150,
          enable: true,
          opacity: 0.4,
          width: 1,
        },
        move: {
          attract: { enable: false, rotateX: 600, rotateY: 1200 },
          bounce: false,
          direction: "none",
          enable: true,
          out_mode: "out",
          random: false,
          speed: 2,
          straight: false,
        },
        number: { density: { enable: true, value_area: 800 }, value: 80 },
        opacity: {
          anim: { enable: false, opacity_min: 0.1, speed: 1, sync: false },
          random: false,
          value: 0.5,
        },
        shape: {
          character: {
            fill: false,
            font: "Verdana",
            style: "",
            value: "*",
            weight: "400",
          },
          polygon: { nb_sides: 5 },
          stroke: { color: "#000000", width: 0 },
          type: "circle",
        },
        size: {
          anim: { enable: false, size_min: 0.1, speed: 40, sync: false },
          random: true,
          value: 5,
        },
      },
      polygon: {
        draw: { enable: false, lineColor: "#ffffff", lineWidth: 0.5 },
        move: { radius: 10 },
        scale: 1,
        type: "none",
        url: "",
      },
      retina_detect: true,
    }}
  />
);

export default Main;
