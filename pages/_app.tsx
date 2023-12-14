import "../styles/globals.css";
import "../styles/style.css";
import "../styles/TokenInfo.css";
import "../styles/CardHeader.css";
import "../styles/CardContainer.css";
import "../styles/TokenPurchaseForm.css";
import "../styles/TokenContainer.css";

import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div>
      <Component {...pageProps} />
    </div>
  );
}
