// @ts-ignore
import JSONBigInt from 'json-bigint';
import { UnsignedTransaction } from '@nautilus-js/eip12-types';

let ergolib: any;

if (typeof window !== "undefined") {
  ergolib = require("ergo-lib-wasm-browser");
}

export async function getTxReducedB64Safe(
  json: UnsignedTransaction,
  explorerClient: any,
) {
  /*
   * Name: getTxReducedB64Safe
   * Type: async function
   * Description:  creates a ReducedTransaction object from a json transaction and encodes it with Base64
   * Parameters:
   * json: object
   * inputs: object
   * dataInputs: object (default [])
   * Returns:
   * Promise<any>
   * Dependencies:
   * getTxReduced: function
   * byteArrayToBase64: function
   * ErgoLib: import
   * Comments:
   * - returns an array of the transaction id and a ReducedTransaction object encoded with Base64
   * - used to create a ReducedTransaction object
   * - used to create a QR code
   * - used to create a payment link
   */

  let txId: string | null = null;
  let reducedTx;

  try {
    [txId, reducedTx] = await getTxReduced(
      json,
      explorerClient,
    );
  } catch (e) {
    console.log('error', e);
  }

  // Reduced transaction is encoded with Base64
  const txReducedBase64 = byteArrayToBase64(reducedTx.sigma_serialize_bytes());

  const ergoPayTx = txReducedBase64.replace(/\//g, '_').replace(/\+/g, '-');
  //console.log("getTxReducedB64Safe3", txId, ergoPayTx);
  // split by chunk of 1000 char to generates the QR codes

  return [txId, ergoPayTx];
}

function byteArrayToBase64(byteArray: any) {
  /*
   * Name: byteArrayToBase64
   * Type: function
   * Description:  converts a byte array to a base64 string
   * Parameters:
   * byteArray: object
   * Returns:
   * string
   * Dependencies:
   * none
   */

  let binary = '';
  const byteLength = byteArray.byteLength;
  for (let i = 0; i < byteLength; i++) {
    binary += String.fromCharCode(byteArray[i]);
  }
  return window.btoa(binary);
}

async function getTxReduced(
  json: UnsignedTransaction,
  explorerClient: any,
): Promise<[string, any]> {
  /*
   * Name: getTxReduced
   * Type: async function
   * Description:  creates a ReducedTransaction object from a json transaction
   * Parameters:
   *  json: object
   * inputs: object
   * dataInputs: object (default [])
   * Returns:
   * Promise<any>
   * Dependencies:
   * getErgoStateContext: function
   * ErgoLib: import
   * Comments:
   * - returns an array of the transaction id and a ReducedTransaction object
   * - used to create a ReducedTransaction object
   */

  const unsignedTx = (await ergolib).UnsignedTransaction.from_json(
    JSONBigInt.stringify(json),
  );
  const inputBoxes = (await ergolib).ErgoBoxes.from_boxes_json(json.inputs);
  const inputDataBoxes = (await ergolib).ErgoBoxes.from_boxes_json(json.dataInputs);
  let ctx: any;

  try {
    ctx = await getErgoStateContext(explorerClient);
  } catch (e) {
    console.log('error', e);
  }
  const id = unsignedTx.id().to_str();
  const reducedTx = (await ergolib).ReducedTransaction.from_unsigned_tx(
    unsignedTx,
    inputBoxes,
    inputDataBoxes,
    ctx,
  );
  return [id, reducedTx];
}

async function getErgoStateContext(explorerClient: any): Promise<any> {
  /*
   * Name: getErgoStateContext
   * Type: async function
   * Description:  gets the current state context of the ergo blockchain from the explorer
   * Parameters:
   *  none
   * Returns:
   * Promise<any>
   * Dependencies:
   * getExplorerBlockHeaders: function
   * ErgoLib: import
   * Comments:
   * - returns an ErgoStateContext object
   * - used to create a ReducedTransaction object
   */

  let explorerHeaders: any = [];
  try {
    explorerHeaders = (
      await explorerClient.getApiV1BlocksHeaders()
    ).data.items.slice(0, 10);
  } catch (e) {
    console.log('error', e);
  }
  console.log('explorerHeaders', explorerHeaders);
  const block_headers = (await ergolib).BlockHeaders.from_json(explorerHeaders);
  const pre_header = (await ergolib).PreHeader.from_block_header(
    block_headers.get(0),
  );
  return new (await ergolib).ErgoStateContext(pre_header, block_headers);
}