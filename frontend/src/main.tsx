import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, MemoryRouter } from "react-router-dom";
import App from "./app/App";
import { initScaleInvariantUnit } from "./utils/scaleUnit";
import { initPaletteTheme } from "./features/studio/paletteThemes";
import "./styles/global.css";

initScaleInvariantUnit();
initPaletteTheme();

const useBrowserHistory =
  typeof window !== "undefined" &&
  (window.location.protocol === "http:" ||
    window.location.protocol === "https:") &&
  window.location.origin !== "null";

const Router = useBrowserHistory ? BrowserRouter : MemoryRouter;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>,
);
