import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./app/App";
import { initScaleInvariantUnit } from "./utils/scaleUnit";
import { initPaletteTheme } from "./features/studio/paletteThemes";
import "./styles/global.css";

initScaleInvariantUnit();
initPaletteTheme();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
