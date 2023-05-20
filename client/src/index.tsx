import App from "./components/App";
import React from "react";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import { AuthProvider } from "./context/AuthProvider";
import ReactModal from "react-modal";

ReactModal.setAppElement("#app");

import { createRoot } from "react-dom/client";
const container = document.getElementById("app");
const root = createRoot(container!);
root.render(
  <AuthProvider>
    <App />
  </AuthProvider>
);
