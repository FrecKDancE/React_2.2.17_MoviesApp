import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Offline, Online } from "react-detect-offline";

import App from "./components/App/App";
import NoInternet from "./components/UI/NoInternet/NoInternet";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Online>
      <App />
    </Online>
    <Offline>
      <NoInternet />
    </Offline>
  </StrictMode>,
);
