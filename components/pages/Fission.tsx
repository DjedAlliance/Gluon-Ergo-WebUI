import React, { useEffect, useState } from "react";
import { Fission } from "../Fission";

interface PageProps {
  activeTab: string;
  setActiveTab: (activeTab: string) => void;
}

const FissionPage = ({ activeTab, setActiveTab }: PageProps) => {
  return <Fission />;
};

export default FissionPage;
