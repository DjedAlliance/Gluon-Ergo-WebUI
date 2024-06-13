import Head from "next/head";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Main from "../components/Main";
import { Footer } from "antd/es/layout/layout";

export default function Home() {
  return (
    <>
      <Head>
        <title>Gluon Gold</title>
      </Head>
      <ToastContainer />
      <main className={`bg-[#24222B] min-h-screen `}>
        <Main />
      </main>
      <Footer />

    </>
  );
}
