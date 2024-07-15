import classNames from "classnames";
import {
  callOutDesc,
  callOutTitle,
  infoDescGAU,
  infoDescGAUC,
  infoTitleGAU,
  infoTitleGAUC,
  mechanicsBetaDecayMinusDesc,
  mechanicsBetaDecayMinusTitle,
  mechanicsBetaDecayPlusDesc,
  mechanicsBetaDecayPlusTitle,
  mechanicsDesc,
  mechanicsFissionDesc,
  mechanicsFissionTitle,
  mechanicsFusionDesc,
  mechanicsFusionTitle,
  mechanicsTitle,
} from "./content";
import {
  BetaDecayMinusGraphic,
  BetaDecayPlusGraphic,
  CalloutGraphic,
  FissionGraphic,
  FusionGraphic,
  GAUCTokenGraphic,
  GAUTokenGraphic,
} from "./homepageSvg";
import Link from "next/link";
import { applicationConfig } from "../SocialIcons";
export default function HomePageContent() {
  const renderCallOut = () => {
    return (
      <div className="flex flex-row items-center space-x-20">
        <div className="space-y-10">
          <div className="space-y-2">
            <h1 className="text-4xl font-medium">{callOutTitle}</h1>
            <div>{callOutDesc}</div>
          </div>
          <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
            <Link
              href="/app/fission"
              className={classNames(
                "px-6 bg-gluongold text-sm rounded-md text-purplemist font-medium py-3 text-center"
              )}
            >
              Launch App
            </Link>
            <Link
              href={applicationConfig.social.docs}
              className={classNames(
                "px-6 bg-transparent text-sm text-white rounded-md text-purplemist border font-medium py-3 text-center"
              )}
            >
              Read Docs
            </Link>
          </div>
        </div>
        <div>
          <CalloutGraphic />
        </div>
      </div>
    );
  };

  const renderInfo = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-8">
        <div className="space-y-4 items-center flex flex-col text-center md:items-start md:text-left">
          <GAUTokenGraphic />
          <div className="space-y-1">
            <div className="text-lg">{infoTitleGAU}</div>
            <div className="text-sm">{infoDescGAU}</div>
          </div>
        </div>
        <div>
          <div className="space-y-4 items-center flex flex-col text-center md:items-start md:text-left">
            <GAUCTokenGraphic />
            <div className="space-y-1">
              <div className="text-lg">{infoTitleGAUC}</div>
              <div className="text-sm">{infoDescGAUC}</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderMechanics = () => {
    return (
      <div className="flex flex-col items-center space-y-10">
        <div className="flex flex-col items-center w-1/2 space-y-2">
          <div className="text-2xl">{mechanicsTitle}</div>
          <div className="text-sm font-thin">{mechanicsDesc}</div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
          <div className="border border-slate-800 bg-gray-700 bg-opacity-10 rounded-lg p-4 flex flex-col items-center space-y-2">
            <FissionGraphic />
            <div className="flex flex-col space-y-1 items-center w-3/4">
              <div className="">{mechanicsFissionTitle}</div>
              <div className="font-thin text-sm text-center">
                {mechanicsFissionDesc}
              </div>
            </div>
          </div>
          <div className="border border-slate-800 bg-gray-700 bg-opacity-10 rounded-lg p-4 flex flex-col items-center space-y-2">
            <FusionGraphic />
            <div className="flex flex-col space-y-1 items-center w-3/4">
              <div className="">{mechanicsFusionTitle}</div>
              <div className="font-thin text-sm text-center">
                {mechanicsFusionDesc}
              </div>
            </div>
          </div>
          <div className="border border-slate-800 bg-gray-700 bg-opacity-10 rounded-lg p-4 flex flex-col items-center space-y-2">
            <BetaDecayPlusGraphic />
            <div className="flex flex-col space-y-1 items-center w-3/4">
              <div className="">{mechanicsBetaDecayPlusTitle}</div>
              <div className="font-thin text-sm text-center">
                {mechanicsBetaDecayPlusDesc}
              </div>
            </div>
          </div>
          <div className="border border-slate-800 bg-gray-700 bg-opacity-10 rounded-lg p-4 flex flex-col items-center space-y-2">
            <BetaDecayMinusGraphic />
            <div className="flex flex-col space-y-1 items-center w-3/4">
              <div className="">{mechanicsBetaDecayMinusTitle}</div>
              <div className="font-thin text-sm text-center">
                {mechanicsBetaDecayMinusDesc}
              </div>
            </div>
          </div>
        </div>

        <Link
          href="/app/fission"
          className={classNames(
            "px-6 bg-gluongold text-sm rounded-md text-purplemist font-medium py-3 text-center"
          )}
        >
          Launch App
        </Link>
      </div>
    );
  };

  return (
    <div className="space-y-24 md:space-y-48 md:pb-48 pb-24 w-full">
      {renderCallOut()}
      {renderInfo()}
      {renderMechanics()}
    </div>
  );
}
