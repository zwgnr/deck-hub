/* This example requires Tailwind CSS v2.0+ */
import { type Dispatch, Fragment, type SetStateAction } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Icon } from '@iconify/react';
import { deckAtom, parallelChoiceAtom, paragonAtom, importErrorAtom } from '~/lib/atoms';
import { useSetAtom } from 'jotai';
import { useRef } from 'react';
import type { Card, Cards, Paragons } from '~/types/sharedTypes';

export interface DeckImportProps {
  openImport: boolean;
  setOpenImport: Dispatch<SetStateAction<boolean>>;
  cards: Cards;
  paragons: Paragons;
}

export const DeckImport = (props: DeckImportProps) => {
  const { openImport, setOpenImport, cards, paragons } = props;

  const setParallelChoice = useSetAtom(parallelChoiceAtom);
  const setActiveParagon = useSetAtom(paragonAtom);
  const setImportError = useSetAtom(importErrorAtom);

  const setDeck = useSetAtom(deckAtom);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const defaultParagon = {
    tokenId: '',
    name: '',
    media: {
      image: '',
      thumbSm: '',
      thumbLg: '',
    },
    gameData: {
      parallel: '',
      rarity: '',
      cost: '',
      attack: '',
      health: '',
      cardType: '',
      subtype: '',
      functionText: '',
      passiveAbility: '',
    },
    id: '',
  };

  const handleDeckDode = () => {
    try {
      const deckCode = textareaRef.current?.value;
      const trimmedDeckCode = deckCode?.trim();
      const deckCodeArr: string[] = trimmedDeckCode?.split(',') ?? [];

      const paragonIds = paragons.map((paragon) => paragon.id);
      const cardIds = cards.map((card) => card.id);

      if (deckCode === '') {
        throw new Error('noCode');
      }

      if (!paragonIds.includes(deckCodeArr[0] ?? '')) {
        throw new Error('paragonError');
      }

      if (paragonIds.includes(deckCodeArr[0] ?? '')) {
        const importedParagon = paragons.filter((paragon) => paragon.id === deckCodeArr[0]);
        setParallelChoice(importedParagon[0]?.gameData?.parallel ?? '');
        setActiveParagon(importedParagon[0] ?? defaultParagon);
      }
      // create arr without paragon included
      const cardEntries = [...deckCodeArr];
      cardEntries.shift();

      if (cardEntries.length > 40) {
        throw new Error('tooManyCards');
      }

      // Create new deck to set
      const newArray = cardEntries.flatMap((item) => {
        if (item === '' || item === ',') {
          throw new Error('syntaxError');
        }
        // Split each item into an ID and a quantity
        let [quantityString, id] = item.split('X');
        // check for single cards that do not have a quantity value

        if (!id) {
          id = quantityString;
          quantityString = '1';
        }
        if (paragonIds.includes(id ?? '')) {
          throw new Error('noParagonsInDeck');
        }

        if (!cardIds.includes(id ?? '')) {
          throw new Error('invalidCard');
        }

        // Convert the quantity string to a number
        const quantity = parseInt(quantityString ?? '', 10);

        // Filter the ids array to find the matching card
        const matchingCards = cards.reduce((uniqueCards: Cards, currentCard) => {
          if (currentCard.id === id && !uniqueCards.some((card: Card) => card.id === id)) {
            uniqueCards.push(currentCard);
          }
          return uniqueCards;
        }, []);

        // Map each matching card id to a new object with the specified quantity
        return matchingCards.flatMap((obj) => Array.from({ length: quantity }, () => ({ ...obj })));
      });

      newArray.map((card) => {
        const importedParagon = paragons.filter((paragon) => paragon.id === deckCodeArr[0]);
        if (
          card.gameData.parallel !== importedParagon[0]?.gameData.parallel &&
          card.gameData.parallel !== 'Universal'
        ) {
          throw new Error('parallelMismatch');
        }

        const count = newArray.filter((d) => d.name === card.name).length;

        if (importedParagon[0]?.tokenId !== '10929') {
          // legendary card check with max limit of 1
          if (card.gameData.rarity === 'Legendary') {
            if (count > 1) {
              throw new Error('legendaryLimit');
            }
          } else if (card.gameData.rarity !== 'Legendary') {
            if (count > 3) {
              throw new Error('max3');
            }
          }
        }
        if (importedParagon[0]?.tokenId === '10929' && Number(card.gameData.cost) <= 5) {
          if (card.gameData.rarity === 'Legendary') {
            if (count > 1) {
              throw new Error('legendaryLimit');
            }
          } else if (card.gameData.rarity !== 'Legendary') {
            if (count > 3) {
              throw new Error('max3');
            }
          }
        } else if (importedParagon[0]?.tokenId === '10929' && Number(card.gameData.cost) > 5) {
          throw new Error('niamhLimit');
        }

        return null;
      });

      setDeck(newArray);

      setOpenImport(false);
    } catch (error: unknown) {
      const errorCodeString = (error as Error).message;
      setParallelChoice('');
      setActiveParagon({
        tokenId: '',
        name: '',
        media: {
          image: '',
          thumbSm: '',
          thumbLg: '',
        },
        gameData: {
          parallel: '',
          rarity: '',
          cost: '',
          attack: '',
          health: '',
          cardType: '',
          subtype: '',
          functionText: '',
          passiveAbility: '',
        },
        id: '',
      });
      setDeck([]);
      setImportError((prevState) => ({
        ...prevState,
        errorCode: errorCodeString,
      }));
      setTimeout(() => {
        setImportError((prevState) => ({
          ...prevState,
          errorCode: '',
        }));
      }, 4000);
    }
    setOpenImport(false);
  };

  return (
    <Transition.Root show={openImport} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" onClose={setOpenImport}>
        <div className="flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="bg-nuetral-100 inline-block transform overflow-hidden rounded-lg bg-neutral-200 px-4 pb-4 pt-5 text-left align-bottom shadow-xl transition-all dark:bg-neutral-900 sm:my-8 sm:w-full sm:max-w-sm sm:p-6 sm:align-middle">
              <div>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-neutral-500">
                  <Icon icon="material-symbols:deployed-code-outline" className="h-6 w-6" />
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <Dialog.Title as="h3" className="text-xl font-bold leading-6 ">
                    Import Deck Code
                  </Dialog.Title>
                  <div className="m-2 mb-8 mt-8">
                    <p className="text-sm text-gray-500">
                      *Code must be in the offical Parallel Deck Code format, i.e.
                      CB-9,CB-408,2XCB-103,3XCB-28
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <label htmlFor="deckCode" className="block text-sm font-medium ">
                  Paste your code here
                  <div className="mt-1">
                    <textarea
                      ref={textareaRef}
                      rows={4}
                      name="deckCode"
                      id="deckCode"
                      className="block w-full rounded-md border-gray-300 bg-neutral-100 shadow-sm ring-transparent focus:border-transparent focus:outline-transparent focus:ring-2  focus:ring-lime-500   dark:bg-neutral-700 dark:focus:outline-transparent dark:focus:ring-lime-500 sm:text-sm"
                      defaultValue=""
                    />
                  </div>
                </label>
              </div>

              <div className="mt-5 sm:mt-6">
                <button
                  type="button"
                  className="inline-flex w-full justify-center rounded-md border border-transparent bg-lime-500 px-4 py-2 text-base font-medium text-white shadow-sm  sm:text-sm"
                  onClick={() => handleDeckDode()}
                >
                  Import
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
