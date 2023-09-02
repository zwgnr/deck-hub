/* eslint-disable react/jsx-key */
import clsx from 'clsx';
import Image from 'next/image';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useEffect, useState } from 'react';

import { type Card, type Cards } from '~/types/sharedTypes';

import {
  atdSuccessAtom,
  deckAtom,
  deckErrorAtom,
  isMobile,
  paragonAtom,
  parallelChoiceAtom,
  showDetailsAtom,
} from '~/lib/atoms';

import { FilterPanel } from './FilterPanel';
import { Tooltip, TooltipTrigger } from './base/tooltip';
import { CardTrigger } from './CardTrigger';
import { CardContent } from './CardContent';
import { Popover, PopoverTrigger } from './base/popover';

export interface CardListProps {
  cards: Cards;
}

export const CardList = (props: CardListProps) => {
  const { cards } = props;

  const parallelChoice = useAtomValue(parallelChoiceAtom);
  const [deck, setDeck] = useAtom(deckAtom);
  const hoverEnabled = useAtomValue(showDetailsAtom);
  const activeParagon = useAtomValue(paragonAtom);
  const setSuccess = useSetAtom(atdSuccessAtom);
  const setDeckError = useSetAtom(deckErrorAtom);
  const [mobile, setMobile] = useAtom(isMobile);

  const [cardInfo, setCardInfo] = useState(cards[0]);
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
    const index = deck.findIndex((item) => item.id === card.id);
    // get total amount of specifc card in a active deck
    const count = deck.filter((d) => d.id === card.id).length;
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
          setSuccess(true);
          setTimeout(() => {
            setSuccess(false);
          }, 1000);
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
          setSuccess(true);
          setTimeout(() => {
            setSuccess(false);
          }, 1000);
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
          setSuccess(true);
          setTimeout(() => {
            setSuccess(false);
          }, 1000);
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
          setSuccess(true);
          setTimeout(() => {
            setSuccess(false);
          }, 1000);
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
  const [, setPopoverOpen] = useState(false);

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  return (
    <div className=" flex  h-full flex-col justify-center px-6  pb-8 pt-8">
      <div className="w-full">
        <FilterPanel cards={cards} setVisibleCards={setVisibleCards} />
      </div>
      <div className="flex h-full w-full flex-wrap justify-center gap-2 xl:overflow-y-auto">
        {visibleCards.map((card: Card, index) =>
          mobile ? (
            <PopoverTrigger>
              <CardTrigger
                card={card}
                hoverEnabled={hoverEnabled}
                addToDeck={addToDeck}
                setCardInfo={setCardInfo}
                getOpacity={getOpacity}
                setPopoverOpen={setPopoverOpen}
                setHoveredIndex={setHoveredIndex}
                index={index}
              >
                <Image
                  // src={getImg(card.parallel, card.title, card.slug)}
                  src={card.media.image}
                  alt="card"
                  className={clsx(getOpacity(card.gameData.parallel), 'h-full w-full rounded-md')}
                  // quality={100}
                  height={72}
                  width={200}
                  // fill
                  style={{ objectFit: 'cover' }}
                />
              </CardTrigger>

              <Popover
                isOpen={hoverEnabled && hoveredIndex === index}
                onOpenChange={(newState) => {
                  if (newState) {
                    setHoveredIndex(index);
                  } else {
                    setHoveredIndex(null);
                  }
                }}
                className={
                  'z-50 h-[300px] w-3/4 rounded-xl bg-surface-4 p-4 shadow-2xl shadow-black'
                }
              >
                <CardContent cardInfo={cardInfo} />
              </Popover>
            </PopoverTrigger>
          ) : (
            <TooltipTrigger
              isOpen={hoverEnabled && hoveredIndex === index}
              onOpenChange={(newState) => {
                if (newState) {
                  setHoveredIndex(index);
                } else {
                  setHoveredIndex(null);
                }
              }}
              key={index}
            >
              <CardTrigger
                card={card}
                hoverEnabled={hoverEnabled}
                addToDeck={addToDeck}
                setCardInfo={setCardInfo}
                getOpacity={getOpacity}
                setPopoverOpen={setPopoverOpen}
                setHoveredIndex={setHoveredIndex}
                index={index}
              >
                <Image
                  // src={getImg(card.parallel, card.title, card.slug)}
                  src={card.media.image}
                  alt="card"
                  className={clsx(getOpacity(card.gameData.parallel), 'h-full w-full rounded-md')}
                  // quality={100}
                  height={72}
                  width={200}
                  // fill
                  style={{ objectFit: 'cover' }}
                />
              </CardTrigger>

              <Tooltip
                className={
                  'z-50 h-[300px] w-[600px] rounded-xl bg-surface-4 p-4 shadow-2xl shadow-black xl:h-[400px] xl:w-[600px]'
                }
              >
                <CardContent cardInfo={cardInfo} />
              </Tooltip>
            </TooltipTrigger>
          ),
        )}
      </div>
    </div>
  );
};
