import React, { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
import { Button, Modal } from 'antd';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { toast } from 'react-toastify';
import { toaster_copy_text, txSubmmited } from '../Notifications/Toast';
import {getUnConfirmedOrConfirmedTx} from "@/blockchain/ergo/apiHelper";

const ErgoPayWalletModal = ({ isModalOpen, setIsModalOpen, ergoPayLink, txid, isMainnet }: any) => {
    const [textToCopy, setTextToCopy] = useState<string>('');

    useEffect(() => {
        setTextToCopy(ergoPayLink);
    }, [ergoPayLink]);

    useEffect(() => {
        let txIntervalId: any = null;

        // stops when modal is closed
        const checkAndNotifyOfTransaction = async (txid: string, isMainnet: boolean) => {
            txIntervalId = setInterval(async () => {
                const response = await getUnConfirmedOrConfirmedTx(txid, isMainnet);
                if(response && Object.keys(response).length !== 0){
                    clearInterval(txIntervalId);
                    toast.dismiss();
                    txSubmmited(txid, isMainnet);
                }
            }, 3000)
        }

        if(isModalOpen){
            checkAndNotifyOfTransaction(txid, isMainnet);
        }

        return () => {
            if(txIntervalId) clearInterval(txIntervalId);
        }
    }, [isModalOpen, txid, isMainnet]);
    const handleCopyText = (e: any) => {
        toast.success('Address successfully copied!', toaster_copy_text);
    };

    const openLink = () => {
        (window as any).open(ergoPayLink);
    };

    return (
        <Modal open={isModalOpen} onCancel={() => {
            setIsModalOpen(false);
            window.document.documentElement.classList.remove('overflow-hidden');
        }} footer={null}>
            <div style={{ fontFamily: `'Space Grotesk', sans-serif` }}>
                <p className="text-black">
                    Complete the action with an ErgoPay compatible wallet.
                </p>
                <div className="text-center mt-1 mb-4">
                    <a
                        href="https://ergoplatform.org/en/get-erg/#Wallets"
                        style={{ color: '#6E64BF', textDecoration: 'none' }}
                        target="_blank"
                        rel="noreferrer"
                    >
                        Find an ErgoPay compatible wallet
                    </a>
                </div>

                <h6 className="text-center text-black">Scan QR code</h6>

                {/*  qr code*/}
                <div className="flex justify-center">
                    <div
                        style={{
                            background: 'white',
                            padding: '10px',
                            maxWidth: 290,
                            borderRadius: 10,
                        }}
                    >
                        {
                            <QRCode
                                size={150}
                                value={ergoPayLink}
                            />
                        }
                    </div>
                </div>
                <div>
                    <h6 className="text-black text-center mt-2">or</h6>
                </div>

                <div className="flex justify-center mt-4">
                    <CopyToClipboard text={textToCopy} onCopy={(e) => handleCopyText(e)}>
                        <Button
                            block
                            style={{ fontFamily: `'Space Grotesk', sans-serif` }}
                            className="mr-2"
                        >
                            Copy request
                        </Button>
                    </CopyToClipboard>

                    <Button
                        block
                        style={{
                            border: 'none',
                            color: 'white',
                            background: '#6F65C5',
                            fontFamily: `'Space Grotesk', sans-serif`,
                        }}
                        onClick={openLink}
                        className="ml-2"
                    >
                        Open wallet
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default ErgoPayWalletModal;