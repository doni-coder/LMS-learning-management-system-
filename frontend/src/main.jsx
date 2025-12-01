import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { store } from "./reduxStore/store";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { SocketProvider } from "./context/SocketProvider";

createRoot(document.getElementById("root")).render(
  <SocketProvider>
    <Provider store={store}>
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <App />
      </BrowserRouter>
    </Provider>
  </SocketProvider>
);
