import React from 'react';
import uploadStyles from '../../styles/Upload.module.css';
import submitStyles from '../../styles/Submit.module.css';
import Link from 'next/link';
import navStyle from '../../styles/navbar.module.css';

const UploadInputBox = () => {
  return (
    <div>
      <div className={`${uploadStyles.uploadContainer}`}>
        <h1 className={submitStyles.title}>UPLOAD FILE</h1>
        <hr className='my-5' />
        <p className='fs-3 pb-5'>Upload the metadata file containing the standard specified <span
          className='text-primary'>here</span></p>

        <div className={`${uploadStyles.addFileBox}`}>
          <div className='flex flex-col items-center justify-center  '>
            <svg aria-hidden='true' className='w-10 h-10 mb-3 text-yellow-400' fill='none'
                 stroke='currentColor'
                 viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
              <path stroke-linecap='round' stroke-linejoin='round' stroke-width='2'
                    d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12'></path>
            </svg>
          </div>
          <p className='text-center text-warning '>Drag and drop any files <br /> here, or click below
            to <br /> browse.
          </p>
          <button
            className='bg-white hover:bg-white-700 text-black font-bold py-2 px-4 rounded-2xl'>
            Add files
          </button>
        </div>
        <p className={submitStyles.fileType}>File type: Json</p>
      </div>

      <div className={`d-flex justify-content-center`}>
        <div className={` d-flex justify-content-center`}>
          <Link href='/payment' className={navStyle.navLinks}>
            <button type='submit' className={submitStyles.nextButton}>NEXT</button>
          </Link>
        </div>
      </div>

    </div>
  );
};

export default UploadInputBox;
