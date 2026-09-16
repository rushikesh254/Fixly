import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import { AuthProvider } from "./context/AuthContext.jsx";
import { SavedProvider } from "./context/savedContext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <SavedProvider>
        <App />
      </SavedProvider>
    </AuthProvider>
  </BrowserRouter>,
);
