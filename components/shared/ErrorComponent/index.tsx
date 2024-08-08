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
      {isError && amount > maxAmount && (
        <p className={s.text}>
          Amount exceeds the available Balance.
        </p>
      )}
      {isError && amount <= 0 && (
        <p className={s.text}>Amount must be greater than zero.</p>
      )}
      {isError && amount > 0 && amount <= maxAmount && (
        <p className={s.text}>Error.</p>
      )}
    </>
  );
};

export default ErrorComponent;
