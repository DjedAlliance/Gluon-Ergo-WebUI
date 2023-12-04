import React from "react";
import HeaderCards from "./HeaderCards";
import MintingHodlERG from "./MintingHodlERG";
import BurningHoldERG from "./BurningHoldERG";

interface IProps {
  ergdata: any;
}
const Hodlerg = (props: IProps) => {
  const { ergdata } = props;

  return (
    <>
      <div className="min-h-[70vh]">
        <div className="container mx-auto px-2 sm:px-3 lg:px-5 my-10 sm:flex items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4 xl:space-x-10">
          <HeaderCards
            title="Current price"
            text={`${ergdata.currentPrice} ERG`}
          />
          <HeaderCards
            title="Emission amount"
            text={`${ergdata.circulatingSupply} hodlERG`}
          />
          <HeaderCards title="TVL" text={`${ergdata.tvl} ERG`} />
        </div>
        <div className="lg:flex items-start px-2 sm:px-3 my-10 lg:my-20">
          <MintingHodlERG />
          <BurningHoldERG />
        </div>
      </div>
    </>
  );
};

export default Hodlerg;
