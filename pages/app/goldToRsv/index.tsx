import "react-toastify/dist/ReactToastify.css";

import AppPage from "@/components/pages/AppPage";
import TransmuteGoldToRsv from "@/components/TransumuteGoldToRsv";

export default function Home() {
  return (
    <AppPage>
      <TransmuteGoldToRsv />
    </AppPage>
  );
}
