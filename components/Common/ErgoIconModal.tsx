import React from 'react';
import Ergo from '../../public/ergo-icon.png';
import Image from 'next/image';

const ErgoIconModal = () => {
  return (
    <Image src={Ergo} alt='logo' width={24} height={24} style={{color:'white'}} />
  );
};

export default ErgoIconModal;
