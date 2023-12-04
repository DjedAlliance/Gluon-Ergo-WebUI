import React from "react";

interface IProps {
  title: string;
  text: string;
}

const HeaderCards = (props: IProps) => {
  const { title, text } = props;
  return (
    <>
      <article className="text-center w-full bg-gray-200 p-4 shadow-lg font-inter">
        <span className="text-black text-sm font-light">{title}</span>
        <p className="font-bold text-xl xl:text-2xl text-black">{text}</p>
      </article>
    </>
  );
};

export default HeaderCards;
