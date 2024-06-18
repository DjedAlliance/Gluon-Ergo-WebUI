import React from 'react';
import Image from 'next/image';
import underConstructionIcon from '@/public/under-construction.png';
import s from './.module.css'

const UnderConstruction = () => {
    return (
        <>
            <div className={s.container}>
                <h1 className={s.header}>Under Construction</h1>
                <p className={s.text}>We're working hard to bring you a better experience. Please check back soon!</p>
                <Image
                    src={underConstructionIcon}
                    width="300"
                    height="300"
                    alt="Under Construction"
                    className={s.image}
                />
            </div>
        </>

    );
}

export default UnderConstruction
