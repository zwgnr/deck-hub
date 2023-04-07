import { Transition } from '@headlessui/react';
import { Icon } from '@iconify/react';
import { useAtomValue } from 'jotai';
import { Fragment, useEffect, useState } from 'react';

import { atdSuccessAtom } from '~/lib/atoms';

export const AddToDeckSuccess = () => {
  const success = useAtomValue(atdSuccessAtom);

  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const isSuccess = success;
    if (isSuccess === true) {
      setShowAlert(true);
    } else {
      setShowAlert(false);
    }
  }, [success]);

  return (
    <div aria-live="assertive" className="pointer-events-none fixed inset-0 z-50 flex items-end ">
      <div className="mr-0 flex w-full flex-col items-center justify-center xl:mr-12 xl:items-end">
        <Transition
          show={showAlert}
          as={Fragment}
          enter="transform ease-out duration-300 transition"
          enterFrom="opacity-0"
          enterTo="-translate-y-8 opacity-100"
          leave="transition ease-in duration-300"
          leaveFrom="translate-y-8 opacity-100"
          leaveTo="opacity-0"
        >
          <div className=" z-50 flex h-16 w-16 items-center  justify-center rounded-md  border-lime-500 bg-lime-500 shadow-xl shadow-lime-200 dark:shadow-lime-900/20">
            <Icon icon="material-symbols:check-box" className="h-12 w-12 text-white" />
          </div>
        </Transition>
      </div>
    </div>
  );
};
