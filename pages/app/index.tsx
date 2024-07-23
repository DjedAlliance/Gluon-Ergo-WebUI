import PricePage from "@/components/pages/PricePage";
import "react-toastify/dist/ReactToastify.css";

export default function Price() {
  const renderPriceComponent = (title: string, price: number) => {
    return (
      <div className="p-8 bg-neutraldark">
        <div>{title}</div>
        <div>
          <div>Current Price</div>
          {/* <div>82.807479562 ERG</div> */}
          <div>{price} ERG</div>
        </div>
      </div>
    );
  };
  return (
    <PricePage>
      <div className="flex flex-col md:flex-row md:space-x-8 space-y-8 md:space-y-0">
        {renderPriceComponent("GAU Stable coin", 82.807479562)}
        {renderPriceComponent("GAUC Reserve coin", 397.449430016)}
      </div>
    </PricePage>
  );
}
