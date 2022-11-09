import React, { useCallback } from "react";
import "./Main.css";
// import Countdown from "react-countdown";
import Particles from "react-tsparticles";
import type { Container, Engine } from "tsparticles-engine";
import { loadFull } from "tsparticles";
import logo from "../../../assets/images/logo.png";
import sponser1 from "../../../assets/images/sponser1.png";
import sponser2 from "../../../assets/images/sponser2.png";
import sponser3 from "../../../assets/images/sponser3.png";
import SecurityFirst from "../../../assets/images/SecurityFirst.png";

const Main = () => {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback(
    async (container: Container | undefined) => {
    },
    []
  );

  return (
    <div className="MainLayout">
      <Particle
        particlesInit={particlesInit}
        particlesLoaded={particlesLoaded}
      />
      <div className="Logo"><img src={logo} /></div>
      <div className="Purpose">
        <h5>대회 목적</h5>
        <p>본 대회는 순천향대학교 학생들에게 인터넷 사이버 공간에서 벌어지는 해킹 및 방어를 실제 운영 및 경험하게 함으로써 정보보호기술의 중요성에 대한 의식 확산과 안전한 정보시스템 운영에 필요한 기술 습득의 기회를 제공하고자 한다.</p>
      </div>
      <div className="Rule">
        <h5>대회 규칙</h5>
        <p>본 대회는 개인전으로 진행되며 사전에 신청한 SW융합대학 재학생들만 참가할 수 있습니다.<br />
          개인전이므로 당연히 문제에 대한 정답, 풀이방법, 힌트 공유는 금지됩니다.<br />
          모든 플래그는 SCH{"{~}"} 형식으로 되어있으며, 문제를 정상적으로 풀이하여 성공하면 플래그를 얻을 수 있습니다.<br />
          동점자 발생 시, 먼저 점수를 획득한 사람이 더 높은 순위를 획득합니다.<br />
          SQLMap, Nessus 등과 같은 서버, 네트워크 상에서 동작하는 자동화툴은 모두 금지되어 있습니다. (문제에서 사용가능을 명시하는 경우 제외)<br />
          대회 진행중 Flag에 대한 brute - force attack은 금지합니다.<br />
          인가된 방법을 통한 문제 접근 외에 비정상적인 서버 접근이나 서버에 대한 공격행위는 허용되지 않습니다.<br />
          위 규칙들을 준수하지 않았거나 부정행위 적발 시 운영진의 판단과 권한으로 향후 대회참가 자격이 박탈될 수 있으며, 모든 민 / 형사상의 책임은 참가자 본인에게 있습니다.<br />
          대회와 관련된 추가 공지(문제 및 풀이보고서 등)는 디스코드에서 공지합니다.<br />
          대회와 관련된 공지, 규칙 등을 읽지 않았을 경우 발생하는 모든 상황에 대한 책임 또한 참가자 본인에게 있습니다.
        </p>
      </div>
      <div className="Price">
        <h5>상금</h5>
        🥇 300.000<br />
        🥈 200.000<br />
        🥉 100.000<br />
      </div>
      <div className="Subjectivity">
        <h5>주관</h5>
        <div className="Sponsor1"><img src={sponser1} /></div>
        <div className="Sponsor2"><img src={sponser2} /></div>
        <div className="Sponsor3"><img src={sponser3} /></div>
      </div>
      <div className="Host">
        <h5>주최</h5>
        <div className="Host"><img src={SecurityFirst} /></div>
      </div>
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
