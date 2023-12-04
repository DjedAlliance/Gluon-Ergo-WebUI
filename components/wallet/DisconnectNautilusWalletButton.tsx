import React from "react";
import { Button } from "antd";

const DisconnectNautilusWalletButton = ({
  disconnectWallet,
  setIsNautilusOpen,
}: any) => {
  const handleDisconnect = () => {
    disconnectWallet();
    setIsNautilusOpen(false);
  };
  return (
    <div>
      <Button
        size="large"
        block
        className="font-VelaSansRegular"
        style={{
          color: "black",
          marginTop: 15,
        }}
        onClick={handleDisconnect}
      >
        Disconnect wallet
      </Button>
    </div>
  );
};

export default DisconnectNautilusWalletButton;
