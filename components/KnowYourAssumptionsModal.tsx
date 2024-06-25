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

        KYA
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
                        <span className="font-bold">Gluon</span> is an asset-backed stable coin protocol.
                      </p>
                      <p>
                        <span className="font-bold">Gluon Gold on Ergo</span> is a Gluon-based smart contract
                        running on the Ergo blockchain, allowing you to issue Gold-pegged stablecoins backed by ERG.
                      </p>
                      <p>
                        This website is an open-source UI for interacting with Gluon Gold on Ergo.{" "}
                      </p>
                      <div className="">
                        <span className="font-bold">Note that:</span>
                        <ul className="list-inside">
                          <li>
                            - This website does not log, collect, profile, share or sell your
                            data.
                          </li>
                          <li>
                            {" "}
                            - Gluon Gold on Ergo runs on a blockchain. Therefore,
                            transactions are final and irreversible once they
                            have status «
                            <span className="font-semibold">
                              confirmed
                            </span>».{" "}
                          </li>
                          <li>
                            {" "}
                            - All transactions can be viewed via{" "}
                            <a
                              href="https://explorer.ergoplatform.com"
                              target="_blank"
                              className="transition-all duration-200 ease-in-out hover:text-opacity-80 text-primary"
                            >
                              Ergo's Explorer
                            </a>
                            .{" "}
                          </li>
                        </ul>
                      </div>
                      <p className="font-bold">
                        The absence of bugs and errors is not guaranteed.
                      </p>
                      <p className="font-bold">
                        {" "}
                        No assistance can be offered if a user is hacked or cheated
                        out of passwords, recovery phrases, private keys or assets.{" "}
                      </p>
                      <div>
                        <span className="font-bold">
                          By using this website, you agree that:{" "}
                        </span>
                        <ul className="list-decimal list-inside indent-xs">
                          <li>You will use it at your own risk.</li>
                          <li>Only you are responsible for your assets.</li>
                          <li>
                            Only you are responsible for securely storing your
                            passwords, recovery phrases and private keys.
                          </li>
                        </ul>
                      </div>
                    </div>
                    <button
                      className="focus:outline-none text-black bg-yellow-400 primary-gradient hover:opacity-80 hover:bg-[#F3B619]-600 focus:ring-4 focus:ring-purple-300 font-medium rounded text-md px-3 sm:px-5 py-2 sm:py-2.5"
                      onClick={closeModal}
                    >
                      I understand and I agree
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
