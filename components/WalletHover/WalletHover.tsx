import React, { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import SigRSVicon from '../../public/sigrsv-icon.png';
import ERGicon from '../../public/ergo-icon.png';
// import SigUSDicon from "../../public/sigUSDicon.svg";
import paideiaIcon from '../../public/paideiaIcon.svg';
import netaIcon from '../../public/netaIcon.svg';
import commonStyle from '../../styles/common.module.css';
import Image from 'next/image';

function classNames(...classes:any) {
  return classes.filter(Boolean).join(' ');
}

export default function WalletHover({
                                      disconnect,
                                      sigUSDBalance,
                                      ergBalance,
                                      sigRSVBalance,
                                      ergopadBalance,
                                      netaBalance,
                                      paideiaBalance,
                                    }:any) {
  function handleClearWallet() {
    disconnect();
  }

  return (
    <Menu as='div' className={commonStyle.mainDiv}>
      <Transition
        show={true}
        as={Fragment}
        enter='transition ease-out duration-100'
        enterFrom='transform opacity-0 scale-95'
        enterTo='transform opacity-100 scale-100'
        leave='transition ease-in duration-75'
        leaveFrom='transform opacity-100 scale-100'
        leaveTo='transform opacity-0 scale-95'
      >
        <Menu.Items className={commonStyle.mainMenuItemWallet}>
          <div
            style={{
              padding: '0.25rem 0 0.25rem',
              marginBottom: '1px',
              marginTop: '1px',
            }}
          >
            {ergBalance != 0 && (
              <Menu.Item>
                {({ active }) => (
                  <a href='#' className={classNames(active ? commonStyle.item1 : commonStyle.item2, commonStyle.item3)}>
                    <Image alt='img' src={ERGicon} className={commonStyle.tokenIconImg} height='20' width='20' />
                    <span style={{ marginRight: '15px' }}></span>
                    <p>
                      ERG Balance:
                      <br />
                      {ergBalance} ERG
                    </p>
                  </a>
                )}
              </Menu.Item>
            )}
            {sigUSDBalance != 0 && (
              <Menu.Item>
                {({ active }) => (
                  <a href='#' className={classNames(active ? commonStyle.item1 : commonStyle.item2, commonStyle.item3)}>
                    <Image alt='img' src={ERGicon} className={commonStyle.tokenIconImg} height='20' width='20' />
                    <span style={{ marginRight: '15px' }}></span>
                    <p>
                      SigUSD Balance:
                      <br />
                      {sigUSDBalance} SigUSD
                    </p>
                  </a>
                )}
              </Menu.Item>
            )}
            {sigRSVBalance != 0 && (
              <Menu.Item>
                {({ active }) => (
                  <a href='#' className={classNames(active ? commonStyle.item1 : commonStyle.item2, commonStyle.item3)}>
                    <Image alt='img' src={SigRSVicon} className={commonStyle.tokenIconImg} height='20' width='20' />
                    <span style={{ marginRight: '15px' }}></span>
                    <p>
                      SigRSV Balance:
                      <br />
                      {sigRSVBalance} SigRSV
                    </p>
                  </a>
                )}
              </Menu.Item>
            )}
            {ergopadBalance != 0 && (
              <Menu.Item>
                {({ active }) => (
                  <a href='#' className={classNames(active ? commonStyle.item1 : commonStyle.item2, commonStyle.item3)}>
                    <Image alt='img' src={ERGicon} className={commonStyle.tokenIconImg} height='20' width='20' />
                    <span style={{ marginRight: '15px' }}></span>
                    <p>
                      ergopad Balance:
                      <br />
                      {ergopadBalance} ergopad
                    </p>
                  </a>
                )}
              </Menu.Item>
            )}
            {netaBalance != 0 && (
              <Menu.Item>
                {({ active }) => (
                  <a href='#' className={classNames(active ? commonStyle.item1 : commonStyle.item2, commonStyle.item3)}>
                    <Image alt='img' src={netaIcon} className={commonStyle.tokenIconImg} height='20' width='20' />
                    <span style={{ marginRight: '15px' }}></span>
                    <p>
                      NETA Balance:
                      <br />
                      {netaBalance} NETA
                    </p>
                  </a>
                )}
              </Menu.Item>
            )}
            {paideiaBalance != 0 && (
              <Menu.Item>
                {({ active }) => (
                  <a href='#' className={classNames(active ? commonStyle.item1 : commonStyle.item2, commonStyle.item3)}>
                    <Image alt='img' src={paideiaIcon} className={commonStyle.tokenIconImg} height='20' width='20' />
                    <span style={{ marginRight: '15px' }}></span>
                    <p>
                      Paideia Balance:
                      <br />
                      {paideiaBalance} Paideia
                    </p>
                  </a>
                )}
              </Menu.Item>
            )}
            <Menu.Item>
              {({ active }) => (
                <a style={{ textAlign: 'center' }} href='#' onClick={handleClearWallet}
                   className={classNames(active ? commonStyle.item1 : commonStyle.item2, commonStyle.item3)}>
                  <p
                    style={{
                      color: 'rgba(205, 10, 10, 0.8)',
                      margin: '0 auto',
                      fontSize: '0.95rem',
                      fontFamily: `'Inter', sans-serif`,
                    }}
                  >
                    Clear Wallet
                  </p>
                </a>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
