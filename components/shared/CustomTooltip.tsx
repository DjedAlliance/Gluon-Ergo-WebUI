import React, { ReactNode } from "react";

interface CustomTooltipProps {
  text: string;
  children: ReactNode;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ text, children }) => {
  return (
    <span className="relative group cursor-pointer ml-1">
      {children}
      <span className="hidden group-hover:block bg-gray-600 text-white py-1 px-2 rounded-md text-[12px] absolute bottom-[-80%] right-[-255px] w-[240px]">
        {text}
        <span
          className="absolute w-4 h-4 bg-gray-600 transform top-[32px] rotate-[151deg] left-[-10px] -mt-1"
          style={{
            clipPath: "polygon(50% 0%, 0 100%, 100% 100%)",
          }}
        />
      </span>
    </span>
  );
};

export default CustomTooltip;
