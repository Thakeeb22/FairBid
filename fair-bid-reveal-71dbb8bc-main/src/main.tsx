import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { WalletProvider } from "@/context/WalletContext";
<WalletProvider>
  <App />
</WalletProvider>;
createRoot(document.getElementById("root")!).render(<App />);
