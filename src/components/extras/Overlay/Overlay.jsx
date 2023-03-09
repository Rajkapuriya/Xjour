import { useEffect } from "react";
import { Oval } from "react-loader-spinner";

import "./Overlay.css";

const Overlay = (props) => {
  const {
    bgColor = "rgba(255,255,255,0.8)",
    spinnerHeight = 40,
    spinnerWidth = 40,
  } = props;

  useEffect(() => {
    const overlay = document.querySelector(".overlay");
    overlay.style.display = "flex";

    setTimeout(() => {
      overlay.style.opacity = "1";
    }, 0);
  }, []);

  return (
    <div
      className="overlay"
      style={{
        backgroundColor: bgColor,
      }}
    >
      <div className="loading-container">
        <Oval color="#00BFFF" height={spinnerHeight} width={spinnerWidth} />
      </div>
    </div>
  );
};

export default Overlay;
