import ReactDOM from "react-dom";
import App from "./components/App";
import React from "react";
import 'mdb-react-ui-kit/dist/css/mdb.min.css'
import { AuthProvider } from "./context/AuthProvider";

ReactDOM.render(
    <AuthProvider>
        <App />
    </AuthProvider >
    , document.getElementById("app"));
