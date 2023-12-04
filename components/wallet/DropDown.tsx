import React, { useEffect, useState } from "react";
import { DownOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Button, Dropdown, Space } from "antd";
import ErgoIcon from "../Common/ErgoIcon";
import ErgoIconModal from "../Common/ErgoIconModal";

const items: MenuProps["items"] = [
  {
    title: "Ergo",
    label: "Select Network",
    key: "1",
    style: {
      width: 150,
      // color: 'white',
      fontFamily: `'Space Grotesk', sans-serif`,
    },
  },
  {
    title: "Ergo",
    label: "Ergo",
    key: "2",
    icon: <ErgoIconModal />,
    style: {
      width: 150,
      // color: 'white',
      fontFamily: `'Space Grotesk', sans-serif`,
    },
  },

  {
    title: "Ergo Testnet",
    label: "Ergo Testnet",
    key: "3",
    icon: <ErgoIconModal />,
    style: {
      width: 150,
      // color: 'white',
      fontFamily: `'Space Grotesk', sans-serif`,
    },
  },
];

const DropDown: React.FC = () => {
  const [value, setValue] = useState<string>("Ergo");
  const [icon, setIcon] = useState<any>();

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    // @ts-ignore
    const selectedTitle = e.item?.props?.title;

    if (!selectedTitle || selectedTitle === "Ergo") {
      localStorage.setItem("IsMainnet", "true");
    } else {
      localStorage.setItem("IsMainnet", "false");
    }

    setValue(selectedTitle);
    localStorage.removeItem("walletConfig");
    window.location.reload();
  };

  useEffect(() => {
    const isMainnet = localStorage.getItem("IsMainnet");

    if (!isMainnet || isMainnet === "true") {
      setValue("Ergo");
    } else {
      setValue("Ergo Testnet");
    }
  }, []);

  const menuProps = {
    items,
    onClick: handleMenuClick,
  };
  return (
    <Space wrap>
      <Dropdown menu={menuProps}>
        <Button
          type="primary"
          ghost
          size="large"
          className="!px-2.5 sm:!px-4"
          style={{
            color: "white",
            border: "none",
            backgroundImage:
              "linear-gradient( to right, rgba(208, 0, 0, 1), rgba(255, 122, 0, 1) )",
            fontFamily: `'Space Grotesk', sans-serif`,
          }}
        >
          <Space
            style={{
              display: "flex",
              alignItems: "center",
              fontFamily: `'Space Grotesk', sans-serif`,
            }}
          >
            <ErgoIcon />
            {value}
            <div style={{ marginTop: "-5px" }}>
              <DownOutlined color="white" />
            </div>
          </Space>
        </Button>
      </Dropdown>
    </Space>
  );
};

export default DropDown;
