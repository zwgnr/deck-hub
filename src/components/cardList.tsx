/* eslint-disable react/jsx-key */
import clsx from 'clsx';
import Image from 'next/image';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useEffect, useState } from 'react';

import * as HoverCardPrimitive from '@radix-ui/react-hover-card';
import * as Popover from '@radix-ui/react-popover';

import { type Card, type Cards } from '~/types/sharedTypes';

import {
  deckAtom,
  deckErrorAtom,
  isMobile,
  paragonAtom,
  parallelChoiceAtom,
  showDetailsAtom,
  showStatsAtom,
} from '~/lib/atoms';

import { handleCardIcon } from '~/lib/handleCardIcon';
import { formatText } from '../lib/formatCardText';
import { handleCardType } from '../lib/handleCardType';

import { FilterPanel } from './FilterPanel';

export interface CardListProps {
  cards: Cards;
}

export const CardList = (props: CardListProps) => {
  const { cards } = props;

  const parallelChoice = useAtomValue(parallelChoiceAtom);
  const [deck, setDeck] = useAtom(deckAtom);
  const statsEnabled = useAtomValue(showStatsAtom);
  const hoverEnabled = useAtomValue(showDetailsAtom);
  const activeParagon = useAtomValue(paragonAtom);
  const setDeckError = useSetAtom(deckErrorAtom);
  const [mobile, setMobile] = useAtom(isMobile);

  const [cardInfo, setCardInfo] = useState(cards[0]);
  const [, setOpen] = useState<boolean>(false);
  const [visibleCards, setVisibleCards] = useState<never[] | Cards>([]);

  useEffect(() => {
    function handleMobile() {
      if (
        ('maxTouchPoints' in navigator && navigator.maxTouchPoints > 0) ||
        window.innerWidth < 768
      ) {
        setMobile(true);
      } else {
        setMobile(false);
      }
    }
    // Check if running on the client-side before accessing the window object
    if (typeof window !== 'undefined') {
      handleMobile();
      window.addEventListener('resize', handleMobile);

      return () => {
        window.removeEventListener('resize', handleMobile);
      };
    }
  }, [setMobile]);

  // if multiple of the same cards are added, ensure they are placed next to each other
  const handlePlacement = (card: Card) => {
    // find position in deck of card in order to place copies next to it
    const index = deck.findIndex((item) => item.tokenId === card.tokenId);
    // get total amount of specifc card in a active deck
    const count = deck.filter((d) => d.name === card.name).length;
    // check for Niamh in order to handle passive effect
    if (activeParagon?.tokenId !== '10929') {
      // legendary card check with max limit of 1
      if (card.gameData.rarity === 'Legendary') {
        if (count < 1) {
          setDeck((prevDeck) => {
            const newDeck = [...prevDeck];
            newDeck.splice(index + 1, 0, card);
            return newDeck;
          });
        } else {
          // handle error message if user tries to add more than 1 legendary
          setDeckError((prevState) => ({
            ...prevState,
            errorCode: 'legendaryLimit',
          }));
          setTimeout(() => {
            setDeckError((prevState) => ({
              ...prevState,
              errorCode: '',
            }));
          }, 4000);
        }
      } else if (card.gameData.rarity !== 'Legendary') {
        if (count < 3) {
          setDeck((prevDeck) => {
            const newDeck = [...prevDeck];
            newDeck.splice(index + 1, 0, card);
            return newDeck;
          });
        } else {
          // handle error message if user tries to add non legendary where count > 3
          setDeckError((prevState) => ({
            ...prevState,
            errorCode: 'max3',
          }));
          setTimeout(() => {
            setDeckError((prevState) => ({
              ...prevState,
              errorCode: '',
            }));
          }, 4000);
        }
      }
    }
    if (activeParagon?.tokenId === '10929' && Number(card.gameData.cost) <= 5) {
      if (card.gameData.rarity === 'Legendary') {
        if (count < 1) {
          setDeck((prevDeck) => {
            const newDeck = [...prevDeck];
            newDeck.splice(index + 1, 0, card);
            return newDeck;
          });
        } else {
          // handle error message if user tries to add more than 1 legendary
          setDeckError((prevState) => ({
            ...prevState,
            errorCode: 'legendaryLimit',
          }));
          setTimeout(() => {
            setDeckError((prevState) => ({
              ...prevState,
              errorCode: '',
            }));
          }, 4000);
        }
      } else if (card.gameData.rarity !== 'Legendary') {
        if (count < 3) {
          setDeck((prevDeck) => {
            const newDeck = [...prevDeck];
            newDeck.splice(index + 1, 0, card);
            return newDeck;
          });
        } else {
          // handle error message if user tries to add non legendary where count > 3
          setDeckError((prevState) => ({
            ...prevState,
            errorCode: 'max3',
          }));
          setTimeout(() => {
            setDeckError((prevState) => ({
              ...prevState,
              errorCode: '',
            }));
          }, 4000);
        }
      }
      // handle error message if user tries to add more than 5 cost card for Niamh
    } else if (activeParagon?.tokenId === '10929' && Number(card.gameData.cost) > 5) {
      setDeckError((prevState) => ({
        ...prevState,
        errorCode: 'niamhLimit',
      }));
      setTimeout(() => {
        setDeckError((prevState) => ({
          ...prevState,
          errorCode: '',
        }));
      }, 4000);
    }
  };

  // handle error message if card is not of selected parallel or universal
  const handleIncorrectParallel = () => {
    setDeckError((prevState) => ({
      ...prevState,
      errorCode: 'wrongParallel',
    }));
    setTimeout(() => {
      setDeckError((prevState) => ({
        ...prevState,
        errorCode: '',
      }));
    }, 4000);
  };

  function addToDeck(card: Card) {
    if (deck.length < 40) {
      switch (parallelChoice) {
        case 'Augencore':
          card.gameData.parallel === 'Augencore' || card.gameData.parallel === 'Universal'
            ? handlePlacement(card)
            : handleIncorrectParallel();
          break;
        case 'Earthen':
          card.gameData.parallel === 'Earthen' || card.gameData.parallel === 'Universal'
            ? handlePlacement(card)
            : handleIncorrectParallel();
          break;
        case 'Kathari':
          card.gameData.parallel === 'Kathari' || card.gameData.parallel === 'Universal'
            ? handlePlacement(card)
            : handleIncorrectParallel();
          break;
        case 'Marcolian':
          card.gameData.parallel === 'Marcolian' || card.gameData.parallel === 'Universal'
            ? handlePlacement(card)
            : handleIncorrectParallel();
          break;
        case 'Shroud':
          card.gameData.parallel === 'Shroud' || card.gameData.parallel === 'Universal'
            ? handlePlacement(card)
            : handleIncorrectParallel();
          break;
        default:
          break;
      }
    } else {
      // handle error message if deck hits card limit
      setDeckError((prevState) => ({
        ...prevState,
        errorCode: 'over40',
      }));
      setTimeout(() => {
        setDeckError((prevState) => ({
          ...prevState,
          errorCode: '',
        }));
      }, 4000);
    }
  }

  const getOpacity = (card: string) =>
    card === 'Universal' || card === parallelChoice ? null : 'opacity-25';

  return (
    <div className=" flex  h-full flex-col justify-center px-6  pb-8 pt-10">
      <div className="w-full">
        <FilterPanel cards={cards} setVisibleCards={setVisibleCards} />
      </div>
      <div className="flex h-full flex-wrap justify-center gap-2 xl:overflow-y-auto">
        {visibleCards.map((card: Card, index) =>
          mobile ? (
            <Popover.Root key={index}>
              <div className="relative h-36 w-24">
                {statsEnabled ? (
                  <>
                    <div className="absolute right-16 top-0  flex items-center justify-center text-gray-300">
                      {handleCardType(card.gameData.cardType)}
                    </div>
                    <div className=" absolute right-2 top-2  flex items-center justify-center px-1 text-white">
                      <p>{card.gameData.cost}</p>
                    </div>
                  </>
                ) : null}
                <Popover.Trigger asChild>
                  <button
                    type="button"
                    onClick={() => (hoverEnabled ? setCardInfo(card) : addToDeck(card))}
                    className="h-full w-full"
                  >
                    <Image
                      // src={getImg(card.parallel, card.title, card.slug)}
                      src={card.media.image}
                      alt="card"
                      className={clsx(
                        getOpacity(card.gameData.parallel),
                        'h-full w-full rounded-md',
                      )}
                      // quality={100}
                      //height={72}
                      //width={200}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  </button>
                </Popover.Trigger>
                {card.gameData.cardType === 'Unit' && statsEnabled ? (
                  <>
                    <div className="absolute bottom-10 left-2 flex items-center justify-center px-1 text-white">
                      <p>{card.gameData.attack}</p>
                    </div>
                    <div className="absolute bottom-10 right-16 flex items-center justify-center px-1  text-gray-200">
                      {handleCardIcon(card.gameData.functionText)}
                    </div>
                    <div className="absolute bottom-10 right-2 flex items-center justify-center px-1  text-white">
                      <p>{card.gameData.health}</p>
                    </div>
                  </>
                ) : null}
              </div>
              {hoverEnabled ? (
                <Popover.Content
                  side="bottom"
                  align="center"
                  sideOffset={2}
                  className={clsx(
                    'radix-side-top:animate-slide-up radix-side-bottom:animate-slide-down z-50 h-[300px] w-[300px]',
                    ' mx-12 rounded-xl p-8',
                    ' bg-neutral-500 shadow-2xl shadow-black dark:bg-gray-800',
                    'focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75',
                  )}
                >
                  <Popover.Arrow className="fill-current text-slate-400 dark:text-slate-800" />

                  <div className="flex h-full w-full space-x-4">
                    <div className="flex flex-col justify-center gap-4">
                      <h1 className="text-xl font-medium text-gray-100 dark:text-gray-100">
                        {cardInfo?.name}
                      </h1>
                      <h2 className="text-xl font-medium text-gray-100 dark:text-gray-100">
                        {cardInfo?.gameData.cardType}
                      </h2>
                      <div className="p-y overflow-y-auto text-sm font-normal text-gray-100 dark:text-gray-400">
                        {formatText(cardInfo?.gameData.functionText ?? '')}
                      </div>
                      <div>
                        <p className="text-md font-medium text-gray-100 dark:text-gray-100">
                          Energy Cost: {cardInfo?.gameData.cost}
                        </p>
                      </div>
                      <div className="flex flex-row gap-6">
                        <p className="text-md font-medium text-gray-100 dark:text-gray-100">
                          Attack: {cardInfo?.gameData.attack}
                        </p>
                        <p className="text-md font-medium text-gray-100 dark:text-gray-100">
                          Health: {cardInfo?.gameData.health}
                        </p>
                      </div>
                    </div>
                  </div>
                </Popover.Content>
              ) : null}
            </Popover.Root>
          ) : (
            <HoverCardPrimitive.Root openDelay={0} closeDelay={0} key={index}>
              <div className="relative h-60 w-40">
                {statsEnabled ? (
                  <>
                    <div className="absolute right-16 top-0  flex items-center justify-center text-gray-300">
                      {handleCardType(card.gameData.cardType)}
                    </div>
                    <div className=" absolute right-2 top-2  flex items-center justify-center px-1 text-white">
                      <p>{card.gameData.cost}</p>
                    </div>
                  </>
                ) : null}
                <HoverCardPrimitive.Trigger asChild>
                  <button
                    type="button"
                    onMouseEnter={() => [setOpen(true), setCardInfo(card)]}
                    onMouseLeave={() => setOpen(false)}
                    onClick={() => addToDeck(card)}
                    className="h-full w-full"
                  >
                    <Image
                      // src={getImg(card.parallel, card.title, card.slug)}
                      src={card.media.image}
                      alt="card"
                      className={clsx(
                        getOpacity(card.gameData.parallel),
                        'h-full w-full rounded-md',
                      )}
                      // quality={100}
                      height={72}
                      width={200}
                      // fill
                      style={{ objectFit: 'cover' }}
                    />
                  </button>
                </HoverCardPrimitive.Trigger>
                {card.gameData.cardType === 'Unit' && statsEnabled ? (
                  <>
                    <div className="absolute bottom-10 left-2 flex items-center justify-center px-1 text-white">
                      <p>{card.gameData.attack}</p>
                    </div>
                    <div className="absolute bottom-10 right-16 flex items-center justify-center px-1  text-gray-200">
                      {handleCardIcon(card.gameData.functionText)}
                    </div>
                    <div className="absolute bottom-10 right-2 flex items-center justify-center px-1  text-white">
                      <p>{card.gameData.health}</p>
                    </div>
                  </>
                ) : null}
              </div>
              {hoverEnabled ? (
                <HoverCardPrimitive.Content
                  side="bottom"
                  align="center"
                  sideOffset={2}
                  className={clsx(
                    'radix-side-top:animate-slide-up radix-side-bottom:animate-slide-down z-50 h-[300px] w-[600px]  xl:h-[400px] xl:w-[800px]',
                    ' rounded-xl p-4',
                    ' bg-neutral-500 shadow-2xl shadow-black dark:bg-slate-800',
                    'focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75',
                  )}
                >
                  <HoverCardPrimitive.Arrow className="fill-current text-slate-400 dark:text-slate-800" />

                  <div className="flex h-full w-full space-x-4">
                    <div className="flex w-1/3 items-center justify-center py-4">
                      <div className="h-72 w-56 py-2 xl:h-96 xl:w-64">
                        <Image
                          // src={getImg(card.parallel, card.title, card.slug)}
                          src={cardInfo?.media.image ?? ''}
                          alt="card"
                          className="h-full w-full rounded-md"
                          // quality={100}
                          height={72}
                          width={200}
                          // fill
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-4">
                      <h1 className="text-xl font-medium text-gray-100 dark:text-gray-100">
                        {cardInfo?.name}
                      </h1>
                      <h2 className="text-xl font-medium text-gray-100 dark:text-gray-100">
                        {cardInfo?.gameData.cardType}
                      </h2>
                      <div className="p-y overflow-y-auto text-sm font-normal text-gray-100 dark:text-gray-400">
                        {formatText(cardInfo?.gameData.functionText ?? '')}
                      </div>
                      <div>
                        <p className="text-md font-medium text-gray-100 dark:text-gray-100">
                          Energy Cost: {cardInfo?.gameData.cost}
                        </p>
                      </div>
                      <div className="flex flex-row gap-6">
                        <p className="text-md font-medium text-gray-100 dark:text-gray-100">
                          Attack: {cardInfo?.gameData.attack}
                        </p>
                        <p className="text-md font-medium text-gray-100 dark:text-gray-100">
                          Health: {cardInfo?.gameData.health}
                        </p>
                      </div>
                    </div>
                  </div>
                </HoverCardPrimitive.Content>
              ) : null}
            </HoverCardPrimitive.Root>
          ),
        )}
      </div>
    </div>
  );
};
