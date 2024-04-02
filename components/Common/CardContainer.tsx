import React from "react";
// import "./CardContainer.css"; // Your CSS file to style the components

interface CardContainerProps {
  children: React.ReactNode;
}

const CardContainer: React.FC<CardContainerProps> = ({ children }) => {
  return <div className="card-container">{children}</div>
}

export default CardContainer;
