import "react-toastify/dist/ReactToastify.css";

import { Fission } from "@/components/Reactor/Fission";
import AppPage from "@/components/pages/AppPage";

export default function Home() {
  return (
    <AppPage>
      <Fission />
    </AppPage>
  );
}
