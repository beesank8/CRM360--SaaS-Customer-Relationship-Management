import React from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast";

import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={12}
        toastOptions={{
          duration: 3000,
          style: {
            background: "#ffffff",
            color: "#111827",
            borderRadius: "12px",
            padding: "14px 18px",
            fontSize: "14px",
            fontWeight: "500",
            boxShadow: "0 10px 25px rgba(0,0,0,0.12)",
          },
          success: {
            iconTheme: {
              primary: "#2563EB",
              secondary: "#ffffff",
            },
          },
          error: {
            iconTheme: {
              primary: "#EF4444",
              secondary: "#ffffff",
            },
          },
        }}
      />

      <App />
    </>
  </React.StrictMode>
);