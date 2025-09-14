import * as React from "react";
import ReactDOM from "react-dom/client";
import * as Redux from "react-redux";
import { store } from "./app/store";

import "./reset.css";
import "./global.css";

import { App } from "./app/app";
import { WebSocketProvider } from "./features/ws";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Redux.Provider store={store}>
      <WebSocketProvider>
        <App />
      </WebSocketProvider>
    </Redux.Provider>
  </React.StrictMode>,
);
