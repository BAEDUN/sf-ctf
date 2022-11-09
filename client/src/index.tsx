import ReactDOM from "react-dom";
import App from "./components/App";
import React from "react";
import 'mdb-react-ui-kit/dist/css/mdb.min.css'
import { AuthProvider } from "./context/AuthProvider";
import ReactModal from "react-modal";

ReactModal.setAppElement('#app');

ReactDOM.render(
    <AuthProvider>
        <App />
    </AuthProvider >
    , document.getElementById("app"));
