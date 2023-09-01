import { type Dispatch, type SetStateAction } from 'react';

import { deckAtom, parallelChoiceAtom, paragonAtom, importErrorAtom } from '~/lib/atoms';
import { useSetAtom } from 'jotai';
import { useRef } from 'react';
import type { Card, Cards, Paragons } from '~/types/sharedTypes';
import { Check, Upload } from 'lucide-react';
import { Button } from './base/button';
import { DialogContent, DialogModal, DialogTrigger } from './base/dialog';
import { Heading } from 'react-aria-components';

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
    <DialogTrigger>
      <Button intent="secondary" className="rounded-lg p-2">
        <Upload className="h-6 w-6" />
      </Button>
      <DialogModal>
        <DialogContent>
          {({ close }) => (
            <>
              <Check className="h-8 w-8 text-green-500" />
              <Heading className="text-lg font-bold">Import Deck Code</Heading>
              <p className="text-sm text-fg-3">
                *Code must be in the offical Parallel Deck Code format, i.e.
                CB-9,CB-408,2XCB-103,3XCB-28
              </p>
              <div>
                <label htmlFor="deckCode" className="block text-sm font-medium ">
                  Paste your code here
                  <div className="mt-1">
                    <textarea
                      ref={textareaRef}
                      rows={4}
                      name="deckCode"
                      id="deckCode"
                      className="block w-full rounded-md border-gray-300 bg-surface-2 shadow-sm ring-transparent focus:border-transparent focus:outline-transparent focus:ring-2  focus:ring-primary dark:focus:outline-transparent sm:text-sm"
                      defaultValue=""
                    />
                  </div>
                </label>
              </div>
              <Button onPress={() => handleDeckDode()}>Import</Button>
            </>
          )}
        </DialogContent>
      </DialogModal>
    </DialogTrigger>
  );
};
