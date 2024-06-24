import "../styles/globals.css";
import "../styles/style.css";
import "../styles/TokenInfo.css";
import "../styles/CardHeader.css";
import "../styles/CardContainer.css";
import "../styles/TokenPurchaseForm.css";
import "../styles/TokenContainer.css";
import "../styles/Navbar.css";
import "../styles/Reactor.css";

import type { AppProps } from "next/app";
import AppProvider from "@/context/AppProvider";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div>
      <AppProvider>
        <Component {...pageProps} />
      </AppProvider>
    </div>
  );
}
