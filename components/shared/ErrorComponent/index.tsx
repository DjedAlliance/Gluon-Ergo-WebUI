import React, { FC } from 'react';
import s from './.module.css';

interface ErrorComponentProps {
    isError: boolean;
    amount: number;
    maxAmount: any;
  }

const ErrorComponent:FC<ErrorComponentProps> = ({ isError, amount, maxAmount }) => {
  return (
    <>
      {isError && amount > 0 && (
        <p className={s.text}>
          Amount exceeds the maximum limit of {maxAmount}.
        </p>
      )}
      {isError && amount <= 0 && (
        <p className={s.text}>Amount must be greater than zero.</p>
      )}
    </>
  );
};

export default ErrorComponent;
