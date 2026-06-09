import { useEffect, Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

const HomePage = lazy(() => import("../features/home/HomePage"));
const ConceptComparePage = lazy(
  () => import("../features/home/ConceptComparePage")
);

function RouteLoading() {
  return (
    <div className="route-loading" role="status" aria-live="polite">
      <div className="route-loading__spinner" aria-hidden="true" />
      <div className="route-loading__copy">
        <span className="route-loading__eyebrow">Loading</span>
        <strong>Calibrating the city map...</strong>
        <p>Preparing the analytics view and navigation.</p>
      </div>
    </div>
  );
}

function App() {
  useEffect(() => {
    if (!("scrollRestoration" in window.history)) {
      return;
    }

    const previousScrollRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";

    return () => {
      window.history.scrollRestoration = previousScrollRestoration;
    };
  }, []);

  return (
    <Suspense fallback={<RouteLoading />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/concepts" element={<ConceptComparePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

export default App;
