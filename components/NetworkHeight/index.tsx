import React, { useEffect, useState } from "react";
import FlipNumbers from "react-flip-numbers";
import { Tooltip as ReactTooltip } from "react-tooltip";
import axios from "axios";

export const BlockIcon = () => {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-4 h-4"
    >
      <path
        d="M0.502 2.999L6 0L11.495 3.03L6.0025 5.96L0.502 2.999V2.999ZM6.5 6.8365V12L11.5 9.319V4.156L6.5 6.8365V6.8365ZM5.5 6.8365L0.5 4.131V9.319L5.5 12V6.8365Z"
        fill="currentColor"
      />
    </svg>
  );
};

const ergoBlockUrl = "https://explorer.ergoplatform.com/en/latest-blocks";
const blockApi = "https://api.ergoplatform.com/api/v1/blocks";
const MINUTE_MS = 60000;

export default function NetworkHeight() {
  const [currentBlock, setCurrentBlock] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    axios.get(blockApi).then((res) => setCurrentBlock(res.data.total));
    const interval = setInterval(() => {
      axios.get(blockApi).then((res) => setCurrentBlock(res.data.total));
    }, MINUTE_MS);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="m-4">
      <a data-tip="Latest Ergo Block" data-for="block" href={ergoBlockUrl}>
        <div className="px-1 flex self-center">
          <div className="text-indigo-100 mr-2.5 self-center">
            <BlockIcon />
          </div>
          <FlipNumbers
            numbers={currentBlock.toLocaleString()}
            play
            perspective={100}
            height={12}
            width={10}
            background={"transparent"}
            color={"white"}
          />
        </div>
      </a>
      {isMounted && <ReactTooltip id="block" place="left" />}
    </div>
  );
}
