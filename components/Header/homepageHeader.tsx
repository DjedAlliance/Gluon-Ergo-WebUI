import React from "react";
import GoldLogoIcon from "@/public/icons/gold-logo.svg";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import classNames from "classnames";
import NetworkPicker from "../wallet/NetworkPicker";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/20/solid";
import { grayButtonsBg, whiteTextsButtons } from "./genericClassNames";
import { Dialog, DialogPanel } from "@headlessui/react";
import { applicationConfig } from "../SocialIcons";

interface IProps {
  currentHref: string;
}

const HomepageHeader = (props: IProps) => {
  const router = useRouter();

  return (
    <header className="grid grid-cols-6 items-center mx-3 py-4">
      <div className="col-span-3 items-center space-x-4 content-center text-lg flex">
        {/* Top Left Section */}
        <Link className="ml-3 mr-2" href={"/"}>
          <Image src={GoldLogoIcon} alt="logo" width="120" height="32" />
        </Link>
        <div className="hidden md:block flex flex-row space-x-5 pl-2">
          <Link
            href={applicationConfig.social.docs}
            className={classNames(
              router.pathname === "/docs"
                ? "text-gluongold font-medium"
                : "font-thin text-gray-400",
              "text-sm"
            )}
          >
            Docs
          </Link>
          <Link
            href={applicationConfig.social.github}
            className={classNames(
              router.pathname === "/docs"
                ? "text-gluongold font-medium"
                : "font-thin text-gray-400",
              "text-sm"
            )}
          >
            Github
          </Link>
          <Link
            href={applicationConfig.social.discord}
            className={classNames(
              router.pathname === "/docs"
                ? "text-gluongold font-medium"
                : "font-thin text-gray-400",
              "text-sm"
            )}
          >
            Discord
          </Link>
        </div>
      </div>
      <div className="flex items-center col-span-3 flex-row space-x-4 justify-end">
        {/* Top Right Section */}
        <Link
          href="/app/fission"
          className={classNames(
            "px-6 bg-gluongold text-sm rounded-md text-purplemist font-medium py-2"
          )}
        >
          Launch App
        </Link>
      </div>
    </header>
  );
};

export default HomepageHeader;
