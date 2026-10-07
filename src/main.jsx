import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "@fontsource-variable/newsreader/wght-italic.css";
import "./styles.css";
import "./portfolio.css";

const app = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);

const root = document.getElementById("root");
if (root.dataset.prerendered) hydrateRoot(root, app);
else createRoot(root).render(app);
