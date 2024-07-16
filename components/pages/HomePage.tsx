import Head from "next/head";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "@/components/Footer";

import s from "@/styles/general.module.css";
import classNames from "classnames";
import { useRouter } from "next/router";
import HomepageHeader from "../Header/homepageHeader";

interface AppPageProps {
  children: React.ReactNode;
}

export default function HomePage({ children }: AppPageProps) {
  const router = useRouter();

  return (
    <div>
      <Head>
        <title>Gluon Gold</title>
        <link rel="shortcut icon" href="" />
      </Head>
      <ToastContainer />
      <main className={classNames("bg-[#24222C] pb-8", "mx-auto")}>
        <div className="">
          <HomepageHeader currentHref={router.pathname} />
        </div>
        <div className="flex flex-row px-8 md:space-x-8 lg:space-x-16 w-full md:w-3/4 m-auto justify-center md:pt-12">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
