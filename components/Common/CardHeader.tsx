import React from "react";

interface CardHeaderProps {
  title?: string;
}

const CardHeader: React.FC<CardHeaderProps> = ({ title }) => {
  return <div className="card-header">{title && <h2>{title}</h2>}</div>;
};

export default CardHeader;
