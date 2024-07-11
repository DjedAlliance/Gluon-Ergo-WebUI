import Head from "next/head";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Main from "../components/Main";
import Footer from "@/components/Footer";

import s from '@/styles/general.module.css'

export default function Home() {
  return (
    <div className={s.mainWrapper}>
      <Head>
        <title>Gluon Gold</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ToastContainer />
      <main className={`bg-[#24222C] ${s.main}`}>
        <Main />
      </main>
      <Footer />
    </div>
  );
}
