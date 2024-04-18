import Head from "next/head";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Main from "../components/Main";

export default function Home() {
  return (
    <>
      <Head>
        <title>GLUONW</title>
      </Head>
      <ToastContainer />
      <main className={`bg-[#24222B] min-h-screen `}>
        <Main />
      </main>
    </>
  );
}
