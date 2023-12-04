import { toast } from 'react-toastify';
import { EXPLORER_URL } from '@/blockchain/ergo/constants';

export const noti_option: any = {
  position: 'top-right',
  autoClose: false,
  hideProgressBar: false,
  closeOnClick: false,
  pauseOnHover: true,
  draggable: false,
  progress: undefined,
  theme: 'dark',
};

export const noti_option_form_error = (id: string | number) :any => {
  return {
    toastId: id,
    position: 'top-right',
    autoClose: false,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: false,
    progress: undefined,
    theme: 'dark'
  }
};

interface NotificationOptions {
  toastId: any;
  position: string;
  closeOnClick: boolean;
  pauseOnHover: boolean;
  draggable: boolean;
  hideProgressBar: boolean;
  autoClose: number;
  theme: string;
}

export const noti_option_close: any = (id: any): NotificationOptions => {
  const data: NotificationOptions = {
    toastId: id,
    position: 'top-right',
    closeOnClick: false,
    pauseOnHover: true,
    draggable: false,
    hideProgressBar: true,
    autoClose: 3000,
    theme: 'dark',
  };
  return data;
};

export const installNautilus:any = {
  position: 'top-right',
  toastId: 'wallet -not-found',
  closeOnClick: false,
  pauseOnHover: true,
  draggable: false,
  hideProgressBar: true,
  theme: 'dark',
  autoClose: 5000,
  onClick: (props: any) => window.open(`https://chrome.google.com/webstore/detail/nautilus-wallet/gjlmehlldlphhljhpnlddaodbjjcchai/`, '_blank'),
};

export const txSubmmited = (txHash: string, isMainnet: boolean) =>
  toast.success(`Transaction submitted (click me)`, {
    position: 'top-right',
    autoClose: false,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: false,
    progress: undefined,
    theme: 'dark',
    onClick: props => window.open(`${EXPLORER_URL(isMainnet)}/en/transactions/${txHash}`, '_blank'),
  });

export const toaster_copy_text: any = {
  position: 'bottom-right',
  toastId: 'Address copy',
  autoClose: 2000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: false,
  draggable: false,
  theme: 'dark',
};