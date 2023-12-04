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
      <main className={`bg-[#f5f5f5] min-h-screen `}>
        <Main />
      </main>
    </>
  );
}
