import { Transition } from "@headlessui/react";
import { Icon } from "@iconify/react";
import { useAtomValue } from "jotai";
import { Fragment, useEffect, useState } from "react";

import { deckErrorAtom, parallelChoiceAtom } from "~/lib/atoms";

export const AddToDeckErrorMessage = () => {
  const parallelChoice = useAtomValue(parallelChoiceAtom);
  const deckError = useAtomValue(deckErrorAtom);

  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const hasError = deckError.errorCode !== "";
    hasError === true ? setShowAlert(true) : setShowAlert(false);
  }, [deckError]);

  let errorMessage;

  switch (deckError.errorCode) {
    case "wrongParallel":
      errorMessage = `This card can not be added to the deck! Please choose a
          Universal or ${parallelChoice} card.`;
      break;
    case "max3":
      errorMessage = `All non legendary cards have a limit of 3 per deck.`;
      break;
    case "over40":
      errorMessage = `Parallel Decks can only have 40 cards!`;
      break;
    case "legendaryLimit":
      errorMessage = `If a card is Legendary, you may only add one copy of that card per deck.`;
      break;
    case "niamhLimit":
      errorMessage = `Niamh, Wielder of Faith's passive effect states You may not include cards in your deck with an Energy cost above 5.`;
      break;
  }

  return (
    <div
      aria-live="assertive"
      className="pointer-events-none fixed inset-0 z-50 flex items-end "
    >
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
                <Icon
                  icon="bi:exclamation-circle-fill"
                  className="h-12 w-12 text-white"
                />
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
