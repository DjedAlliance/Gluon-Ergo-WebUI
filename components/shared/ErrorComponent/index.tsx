import React, { FC } from "react";
import s from "./.module.css";

interface ErrorComponentProps {
  isError: boolean;
  amount: number;
  maxAmount: any;
  isFusion: boolean;
  maxProtonsAvailable?: number;
  maxNeutronsAvailable?: number;
  ProtonsAmountForFusion?: number;
  NeutronsAmountForFusion?: number;
  setIsError?: (value: boolean) => void;
}

const ErrorComponent: FC<ErrorComponentProps> = ({
  isError,
  amount,
  maxAmount,
  isFusion,
  maxProtonsAvailable,
  maxNeutronsAvailable,
  ProtonsAmountForFusion,
  NeutronsAmountForFusion,
  setIsError,
}) => {
  if (
    isFusion &&
    maxProtonsAvailable &&
    maxNeutronsAvailable &&
    ProtonsAmountForFusion &&
    NeutronsAmountForFusion
  ) {
    if (
      ProtonsAmountForFusion > maxProtonsAvailable ||
      NeutronsAmountForFusion > maxNeutronsAvailable
    ) {
      if (setIsError) setIsError(true);
    }
    return (
      <>
        {ProtonsAmountForFusion > maxProtonsAvailable && (
          <p className={s.text}>Amount exceeds the available GAUC Balance.</p>
        )}
        {NeutronsAmountForFusion > maxNeutronsAvailable && (
          <p className={s.text}>Amount exceeds the available GAU Balance.</p>
        )}
      </>
    );
  } else {
    return (
      <>
        {isError && amount > maxAmount && (
          <p className={s.text}>Amount exceeds the available Balance.</p>
        )}
        {isError && amount <= 0 && (
          <p className={s.text}>Amount must be greater than zero.</p>
        )}
        {isError && amount > 0 && amount <= maxAmount && (
          <p className={s.text}>Error.</p>
        )}
      </>
    );
  }
};

export default ErrorComponent;
