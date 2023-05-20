import App from "./components/App";
import React from "react";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import ReactModal from "react-modal";
import { RecoilRoot } from "recoil";

ReactModal.setAppElement("#app");

import { createRoot } from "react-dom/client";
const container = document.getElementById("app");
const root = createRoot(container!);
root.render(
  <RecoilRoot>
    <App />
  </RecoilRoot>
);
