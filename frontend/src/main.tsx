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

const routerBase =
  import.meta.env.BASE_URL.replace(/\/+$/, "") || "/";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {useBrowserHistory ? (
      <BrowserRouter basename={routerBase}>
        <App />
      </BrowserRouter>
    ) : (
      <MemoryRouter>
        <App />
      </MemoryRouter>
    )}
  </React.StrictMode>,
);
