import "react-toastify/dist/ReactToastify.css";

import AppPage from "@/components/pages/AppPage";
import TransmuteRsvToGold from "@/components/Reactor/TransumuteRsvToGold";

export default function Home() {
  return (
    <AppPage>
      <TransmuteRsvToGold />
    </AppPage>
  );
}
