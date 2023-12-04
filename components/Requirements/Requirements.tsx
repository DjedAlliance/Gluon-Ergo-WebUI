import React, { Fragment, useEffect, useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import wallet_black from '../../public/wallet_logo_dark.png';
import wallet_white from '../../public/wallet_logo_light.png';
import WalletHover from '../WalletHover/WalletHover';
import NautilusLogo from '../../public/NautilusLogo.png';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ergoPayLogo from '../../public/ergo-icon.png';
import Image from 'next/image';
import commonStyle from '../../styles/common.module.css';
import { MouseEventHandler } from 'react';

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ');
}

const NANOERG_TO_ERG = 1000000000;
const TOKENID_SIGRSV =
  '003bd19d0187117f130b62e1bcab0939929ff5c7709f843c5c4dd158949285d0';
const TOKENID_SIGUSD =
  '03faf2cb329f2e90d6d23b58d91bbb6c046aa143261cc21f52fbe2824bfcbf04';
const TOKENID_NETA =
  '472c3d4ecaa08fb7392ff041ee2e6af75f4a558810a74b28600549d5392810e8';
const TOKENID_ERGOPAD =
  'd71693c49a84fbbecd4908c94813b46514b18b67a99952dc1e6e4791556de413';
const TOKENID_PAIDEIA =
  '1fd6e032e8476c4aa54c18c1a308dce83940e8f4a28f576440513ed7326ad489';

export const ErgoDappConnector = (props: any) => {
  const color = props.color;
  const [open, setOpen] = useState(true);
  const [ergoWallet, setErgoWallet] = useState<any>();
  const [ergoPay, setErgoPay] = props.ergopayProps;

  const [ergBalance, setErgBalance] = useState(0);
  const [sigUSDBalance, setSigUSDBalance] = useState(0);
  const [sigRSVBalance, setSigRSVBalance] = useState(0);
  const [ergopadBalance, setErgopadBalance] = useState(0);
  const [netaBalance, setNetaBalance] = useState(0);
  const [paideiaBalance, setPaideiaBalance] = useState(0);

  const [walletConnected, setWalletConnected] = useState(false);
  const [showSelector, setShowSelector] = useState(false);
  const [walletHover, setWalletHover] = useState(false);
  const [defaultAddress, setDefaultAddress] = useState<any>();

  const noti_option_close: any = {
    position: 'top-right',
    toastId: 'wallet -not-found',
    autoClose: false,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: false,
    theme: 'dark',

    onClick: (props: any) =>
      window.open(
        `https://chrome.google.com/webstore/detail/nautilus-wallet/gjlmehlldlphhljhpnlddaodbjjcchai/`,
        '_blank',
      ),
  };

  useEffect(() => {
    window.addEventListener('ergo_wallet_disconnected', () => {
      disconnectWallet();
    });
  }, []);

  useEffect(() => {
    const checkWallet = localStorage.getItem('walletConnected');
    if (checkWallet === 'true') {
      const whichWallet = localStorage.getItem('walletUsed');
      console.log(whichWallet);
      if (whichWallet === 'nautilus') {
        setDefaultAddress('');
        (window as any).ergoConnector.nautilus
          .connect()
          .then((access_granted: any) => {
            if (access_granted) {
              setWalletConnected(true);
              (window as any).ergoConnector.nautilus
                .getContext()
                .then((context: any) => {
                  setErgoWallet(context);
                });
            } else {
              setWalletConnected(false);
            }
          });
        setDefaultAddress(localStorage.getItem('walletAddress'));
        setWalletConnected(true);
      } else {
        setErgoPay(true);
        setWalletConnected(true);
        localStorage.setItem('walletUsed', 'ergopay');
        console.log('ergoPay!!');
        localStorage.setItem('walletAddress', 'ErgoPay');
        setDefaultAddress('ErgoPay');
        localStorage.setItem('walletConnected', 'true');
      }
    }
  }, []);

  useEffect(() => {
    if (typeof ergoWallet !== 'undefined') {
      // get ERG balance
      ergoWallet?.get_balance().then(function (balance: any) {
        setErgBalance(balance / NANOERG_TO_ERG);
      });
      // get SigUSD balance
      ergoWallet?.get_balance(TOKENID_SIGUSD).then(function (balance: any) {
        setSigUSDBalance(balance / 100);
      });

      // get SigRSV balance
      ergoWallet?.get_balance(TOKENID_SIGRSV).then(function (balance: any) {
        setSigRSVBalance(balance);
      });

      // get Ergopad balance
      ergoWallet?.get_balance(TOKENID_ERGOPAD).then(function (balance: any) {
        setErgopadBalance(balance / 100);
      });

      // get Neta balance
      ergoWallet?.get_balance(TOKENID_NETA).then(function (balance: any) {
        setNetaBalance(balance / 1000000);
      });

      // get Paideia balance
      ergoWallet?.get_balance(TOKENID_PAIDEIA).then(function (balance: any) {
        setPaideiaBalance(balance / 10000);
      });

      //get Address
      ergoWallet?.get_change_address().then(function (address: any) {
        localStorage.setItem('walletAddress', address);
        setDefaultAddress(truncate(address, 14, '...'));
        localStorage.setItem('walletConnected', 'true');
      });
    }
    if (ergoPay) {
      console.log('ergoPay!!');
      localStorage.setItem('walletAddress', 'ErgoPay');
      setDefaultAddress('ErgoPay');
      localStorage.setItem('walletConnected', 'true');
    }
  }, [ergoWallet]);

  const colorStylingArray: any = {
    orange: ['#ff5e18', 'black'],
    white: ['white', 'black'],
    black: ['black', 'white'],
    green: ['#00b300', 'white'],
    purple: ['#8c00ff', 'white'],
    blue: ['#00b3ff', 'white'],
    red: ['#ff0000', 'white'],
    yellow: ['#ffd800', 'black'],
    brown: ['#964B00', 'white'],
    pink: ['#ff00ff', 'white'],
    teal: ['#00b3b3', 'white'],
    cyan: ['#00b3ff', 'white'],
    coral: ['#FF6F61', 'white'],
    cherokee: ['#FBD38D', 'black'],
    emerald: ['#009B77', 'white'],
    darkred: ['#9B2335', 'white'],
    inkwell: ['#363945', 'white'],
    darkgreen: ['#006400', 'white'],
    darkblue: ['#00008B', 'white'],
    darkpurple: ['#301934', 'white'],
    darkorange: ['#ff8c00', 'white'],
    lightPink: ['#E041E7', 'white'],
  };

  const truncate = (str: any, len: any, sep: any) => {
    if (str.length < len) {
      return str;
    } else {
      return (
        str.substring(0, parseInt(String(len / 2))) +
        sep +
        str.substring(str.length - parseInt(String(len / 2)), str.length)
      );
    }
  };

  function disconnectWallet() {
    if (localStorage.getItem('walletUsed') == 'ergopay') {
      setErgoPay(false);
      localStorage.removeItem('walletConnected');
      localStorage.removeItem('walletUsed');
      localStorage.removeItem('walletAddress');
      setWalletConnected(false);
      setErgoWallet(null);
      setDefaultAddress('');
    }
    if (typeof (window as any).ergo_request_read_access === 'undefined') {
    } else {
      if (walletConnected) {
        setWalletConnected(false);
        setErgoWallet(null);
        setDefaultAddress('');
        localStorage.removeItem('walletAddress');
        localStorage.removeItem('walletConnected');
        localStorage.removeItem('walletUsed');
        (window as any).ergoConnector.nautilus.disconnect();
      }
    }
  }

  const toggleSelector = () => {
    if (!walletConnected) setShowSelector(!showSelector);
  };

  const handleWalletTrue = () => {
    if (walletConnected) setWalletHover((prev) => !prev);
    else {
      setShowSelector((prev) => !prev);
    }
  };

  const connectNautilus: MouseEventHandler<HTMLButtonElement> = () => {
    disconnectWallet();
    if (!(window as any).ergoConnector) {
      toast.warn('Click me to get nautilus!', noti_option_close);
      return;
    }
    (window as any).ergoConnector.nautilus
      .isConnected()
      .then((connected: any) => {
        if (!walletConnected) {
          (window as any).ergoConnector.nautilus
            .connect()
            .then((access_granted: any) => {
              if (access_granted) {
                setWalletConnected(true);
                (window as any).ergoConnector.nautilus
                  .getContext()
                  .then((context: any) => {
                    localStorage.setItem('walletUsed', 'nautilus');
                    setErgoWallet(context);
                  });
              } else {
                setWalletConnected(false);
              }
            });
          toggleSelector();
        } else {
          // Already connected
          toggleSelector();
          return;
        }
      });
  };

  const connectErgoPay: MouseEventHandler<HTMLButtonElement> = () => {
    disconnectWallet();
    setErgoPay(true);
    setWalletConnected(true);
    localStorage.setItem('walletUsed', 'ergopay');
    console.log('ergoPay!!');
    localStorage.setItem('walletAddress', 'ErgoPay');
    setDefaultAddress('ErgoPay');
    localStorage.setItem('walletConnected', 'true');
    toggleSelector();
  };

  return (
    <div className={commonStyle.packageContainer}>
      {showSelector && (
        <Menu as="div" className={commonStyle.mainDiv}>
          <Transition
            show={open}
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className={commonStyle.mainMenuItem}>
              <div className={commonStyle.mainMenuDiv}>
                {/* <Menu.Item onClick={connectNautilus}>*/}
                <Menu.Item>
                  {({ active }) => (
                    <a
                      href="#"
                      className={classNames(
                        active ? commonStyle.item1 : commonStyle.item2,
                        commonStyle.item3,
                      )}
                      style={{
                        fontFamily: `'Inter', sans-serif`,
                      }}
                    >
                      <span
                        style={{
                          marginRight: '8px',
                        }}
                      ></span>
                      <Image
                        alt="img"
                        src={NautilusLogo}
                        width="30"
                        height="30"
                      />
                      <span className={commonStyle.NautilusLogoStyle}></span>
                      Nautilus
                    </a>
                  )}
                </Menu.Item>
                {/* <Menu.Item onClick={connectErgoPay}>*/}
                <Menu.Item>
                  {({ active }) => (
                    <a
                      href="#"
                      className={classNames(
                        active ? commonStyle.item1 : commonStyle.item2,
                        commonStyle.item3,
                      )}
                      style={{
                        fontFamily: `'Inter', sans-serif`,
                      }}
                    >
                      <span
                        style={{
                          marginRight: '8px',
                        }}
                      ></span>
                      <Image
                        alt="img"
                        src={ergoPayLogo}
                        width="30"
                        height="30"
                      />
                      <span className={commonStyle.ergoPayLogo}></span>
                      ErgoPay
                    </a>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      )}

      <div
        className={commonStyle.headerWalletWrapper}
        onClick={handleWalletTrue}
      >
        <div
          className={commonStyle.headerWallet}
          style={{
            backgroundColor: '#E041E7',
            display: 'flex',
            padding: '14px 22px',
            borderRadius: 12,
            color: colorStylingArray[color][1],
            flexDirection: walletConnected ? 'column' : 'row',
            border: color == 'white' ? '1px solid black' : '',
          }}
        >
          {!walletConnected && (
            <Image
              style={{ marginRight: 16 }}
              height="25"
              width="30"
              alt="wallet"
              src={
                colorStylingArray[color][1] == 'white'
                  ? wallet_white
                  : wallet_black
              }
              className={commonStyle.headerWalletImage}
            />
          )}
          <div className={commonStyle.walletConnect}>
            <span
              style={{
                fontFamily: `'Inter', sans-serif`,
              }}
            >
              {walletConnected ? (
                <span
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    verticalAlign: 'middle',
                  }}
                >
                  <span
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-evenly',
                      alignItems: 'center',
                      gap: '5px',
                    }}
                  >
                    <span style={{ marginLeft: 14 }}></span>
                    <Image
                      alt="img"
                      height="20"
                      width="20"
                      className={commonStyle.logosStyle}
                      src={
                        localStorage.getItem('walletUsed') == 'nautilus'
                          ? NautilusLogo
                          : ergoPayLogo
                      }
                    />
                    <span
                      style={{
                        color: colorStylingArray[color][1],
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        width: '150px',
                        marginLeft: '8px',
                      }}
                    >
                      {defaultAddress}
                    </span>
                  </span>
                </span>
              ) : (
                <span
                  style={{
                    fontFamily: `'Inter', sans-serif`,
                    fontWeight: 800,
                    fontSize: 16,
                    width: 161,
                  }}
                >
                  <button
                    className="text-white font-bold rounded-xl"
                    style={{ background: '#E041E7' }}
                  >
                    CONNECT WALLET
                  </button>
                </span>
              )}
            </span>
          </div>
          {walletHover && walletConnected && (
            <WalletHover
              disconnect={disconnectWallet}
              sigUSDBalance={sigUSDBalance}
              ergBalance={ergBalance}
              sigRSVBalance={sigRSVBalance}
              netaBalance={netaBalance}
              ergopadBalance={ergopadBalance}
              paideiaBalance={paideiaBalance}
            />
          )}
        </div>
      </div>
    </div>
  );
};
