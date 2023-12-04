import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";
const KYA_STORAGE_KEY = "knowYourAssumptionsAccepted";

export default function KnowYourAssumptionsModal() {
  const [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
    localStorage.setItem(KYA_STORAGE_KEY, "true");
  }

  function openModal() {
    setIsOpen(true);
  }

  useEffect(() => {
    const isKYAAccepted = localStorage.getItem(KYA_STORAGE_KEY);
    if (!isKYAAccepted) {
      setIsOpen(true);
    }
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className="transition-all duration-200 ease-in-out hover:text-opacity-80 outline-none bg-transparent"
      >
        Know Your Assumptions
      </button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => console.log("")}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-50" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-2 sm:p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-[920px] transform overflow-hidden rounded-xl lg:rounded-2xl bg-white p-3 lg:p-6 text-left align-middle shadow-xl transition-all">
                  <div className="flex flex-col tracking-normal text-black">
                    <h2 className="font-bold text-2xl">
                      Know Your Assumptions
                    </h2>
                    <div className="space-y-4 px-2 py-6">
                      <p>
                        <span className="font-bold">Phoenix</span> is an open
                        source UI for interacting with contracts on the Ergo
                        Blockchain.{" "}
                      </p>
                      <div className="">
                        <span className="font-bold">Notice that:</span>
                        <ul className="list-inside">
                          <li>
                            - We don't log, collect, profile, share or sell your
                            data.
                          </li>
                          <li>
                            {" "}
                            - Phoenix operates on a live blockchain, thus
                            transactions are final, and irreversible once they
                            have status «
                            <span className="font-semibold">
                              confirmed
                            </span>».{" "}
                          </li>
                          <li>
                            {" "}
                            - Every transaction can be viewed via{" "}
                            <a
                              href="https://explorer.ergoplatform.com"
                              target="_blank"
                              className="transition-all duration-200 ease-in-out hover:text-opacity-80 text-primary"
                            >
                              explorer
                            </a>
                            .{" "}
                          </li>
                          <li>
                            {" "}
                            -{" "}
                            <a
                              href="https://github.com/PhoenixErgo"
                              target="_blank"
                              className="transition-all duration-200 ease-in-out hover:text-opacity-80 text-primary"
                            >
                              All code is open source and available
                            </a>{" "}
                            for public review.{" "}
                          </li>
                        </ul>
                      </div>
                      <p className="font-bold">
                        The Phoenix Finance doesn't guarantee the absence of
                        bugs and errors.
                      </p>
                      <p className="font-bold">
                        {" "}
                        NO assistance can offered if a user is hacked or cheated
                        out of passwords, currency or private keys.{" "}
                      </p>
                      <div>
                        <span className="font-bold">
                          By accepting these KYA, you agree that:{" "}
                        </span>
                        <ul className="list-decimal list-inside indent-xs">
                          <li>You will use the product at your own risk.</li>
                          <li>Only YOU are responsible for your assets.</li>
                          <li>
                            Only YOU are responsible for securely storing your
                            recovery phrase.
                          </li>
                          <li>
                            Our UI does not provide the option for slippage
                            tolerance, you will receive the corresponding amount
                            of hodlERG/ERG based on the price calculated at
                            transaction execution time.
                          </li>
                          <li>
                            Our UI uses a proxy contract to interact with the
                            hodlERG bank, not your wallet UTxOs. This means that
                            we have a transaction execution bot which processes
                            all transactions that interact with the bank.
                          </li>
                          <li>
                            If funds are stuck in the proxy, there is the option
                            to refund ERG/hodlERG as long as our bot does not
                            use the proxy to execute a transaction before you
                            are able to execute the refund.
                          </li>
                          <li>
                            If you would prefer to interact with the bank box
                            directly, use this UI:{" "}
                            <a
                              className="text-primary font-medium"
                              href="https://app.hodlcoin.co.in/"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              https://app.hodlcoin.co.in/
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <button
                      className="focus:outline-none text-white primary-gradient hover:opacity-80 focus:ring-4 focus:ring-purple-300 font-medium rounded text-md px-3 sm:px-5 py-2 sm:py-2.5"
                      onClick={closeModal}
                    >
                      I understand and accept the KYA
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
