import { RegisterType } from '../blockchain/ergo/explorerApi';

interface ErgoTransaction{
  'id': string;
  'inputs': Array<ErgoTransactionInput>;
  'dataInputs': Array<ErgoTransactionDataInput>;
  'outputs': Array<ErgoTransactionOutput>;
  'size': number;
}

interface ErgoTransactionInput{
  'boxId': string;
  'spendingProof': SpendingProof
  'extension': Extension;
}

interface SpendingProof{
  'proofBytes': string;
  'extension': Extension;
}

interface Extension{
  [key: string]: string;
}

interface ErgoTransactionDataInput{
  'boxId': string;
  'extension': Extension;
}

interface ErgoTransactionOutput{
  'boxId': string;
  'value': number;
  'ergoTree': string;
  'creationHeight': number;
  'assets': Array<Asset>;
  'additionalRegisters': Registers;
  'transactionId': string;
  'index': number;
  'spentTransactionId'?: string;
}

interface Asset{
  'tokenId': string;
  'amount': number;
}

type Registers = Partial<Record<RegisterType, string>>;