import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import DemoPage from "./pages/DemoPage";
import { useHashRoute } from "./router";
import "./styles.css";

function Root() {
  const route = useHashRoute();
  if (route.startsWith("/demo")) {
    const theme = route.startsWith("/demo/3d") ? "depth" : route.startsWith("/demo/pixel") ? "pixel" : "dreamy";
    return <DemoPage theme={theme} />;
  }
  return <App />;
}

createRoot(document.getElementById("root")!).render(<Root />);
