import React from 'react';
import Ergo from '../../public/symbol_bold__1080px__white.png';
import Image from 'next/image';

const ErgoIcon = () => {
  return (
    <Image src={Ergo} alt='logo' width={24} height={24} style={{color:'white'}} />
  );
};

export default ErgoIcon;
