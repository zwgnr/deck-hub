import { Transition } from '@headlessui/react';
import { Icon } from '@iconify/react';
import { useAtomValue } from 'jotai';
import { Fragment, useEffect, useState } from 'react';

import { importErrorAtom } from '~/lib/atoms';

export const ImportErrorMessage = () => {
  const importError = useAtomValue(importErrorAtom);

  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const hasError = importError.errorCode !== '';
    hasError === true ? setShowAlert(true) : setShowAlert(false);
  }, [importError]);

  let errorMessage;

  switch (importError.errorCode) {
    case 'noCode':
      errorMessage = 'No Deck code found, please enter one and try again.';
      break;
    case 'paragonError':
      errorMessage = 'Please make sure the first card is a valid Paragon.';
      break;
    case 'tooManyCards':
      errorMessage = 'Decks may only contain 40 cards. Remove some and try again.';
      break;
    case 'noParagonsInDeck':
      errorMessage = 'Decks may only include one Paragon.';
      break;
    case 'parallelMismatch':
      errorMessage =
        'Decks may only contain cards from a single Parallel, as well as Universal Cards.';
      break;
    case 'legendaryLimit':
      errorMessage = 'If a card is Legendary, you may only add one copy of that card per deck.';
      break;
    case 'max3':
      errorMessage = 'All non legendary cards have a limit of 3 per deck.';
      break;
    case 'niamhLimit':
      errorMessage =
        "Niamh, Wielder of Faith's passive effect states You may not include cards in your deck with an Energy cost above 5.";
      break;
    case 'syntaxError':
      errorMessage = 'Code Format Error. Please ensure your deck code is in the correct format.';
      break;
    case 'invalidCard':
      errorMessage = 'One or more cards is in invalid Parallel card and/or in an incorrect format.';
      break;
    default:
      break;
  }

  return (
    <div aria-live="assertive" className="pointer-events-none fixed inset-0 z-50 flex items-end ">
      <div className="flex w-full flex-col items-center justify-center">
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
          <div className=" z-50 h-24 w-3/4 rounded-md border-red-600  bg-red-700 p-8 shadow-xl shadow-red-200 dark:shadow-red-900/20 xl:w-1/3">
            <div className="flex h-full w-full items-center justify-center gap-8">
              <div className="flex-shrink-0">
                <Icon icon="bi:exclamation-circle-fill" className="h-12 w-12 text-white" />
              </div>
              <div>
                <div className="mt-2 text-lg text-white">
                  <p>{errorMessage}</p>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  );
};
