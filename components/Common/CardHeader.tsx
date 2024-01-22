import React from "react";
// import "./CardHeader.css";

interface CardHeaderProps {
  title?: string;
}

const CardHeader: React.FC<CardHeaderProps> = ({ title }) => {
  return <div className="card-header">{title && <h2>{title}</h2>}</div>;
};

export default CardHeader;
