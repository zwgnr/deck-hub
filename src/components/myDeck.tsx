import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';
import clsx from 'clsx';
import * as HoverCardPrimitive from '@radix-ui/react-hover-card';
import * as RadixPopover from '@radix-ui/react-popover';
import { v4 as uuidv4 } from 'uuid';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';

import type { Card, Cards, Paragons } from '~/types/sharedTypes';

import {
  deckAtom,
  deckErrorAtom,
  isMobile,
  paragonAtom,
  parallelChoiceAtom,
  showCardList,
  showDetailsAtom,
} from '~/lib/atoms';

import { useCopyToClipboard } from '~/hooks/useCopyToClipboard';
import { formatText } from '~/lib/formatCardText';

import { CopyAlert } from './CopyAlert';
import { StatsToggle } from './interactions/StatsToggle';
import { HoverToggle } from './interactions/DetailsToggle';

import { EnergyChart } from './energyChart';
import { TypeChart } from './typeChart';

import { AddToDeckErrorMessage } from './ATDErrorMessage';
import { ImportErrorMessage } from './ImportErrorMessage';
import { AddToDeckSuccess } from './ATDSuccess';
import {
  ArrowLeftCircle,
  ArrowRightCircle,
  Download,
  Expand,
  MinusSquare,
  PlusSquare,
  XCircle,
} from 'lucide-react';
import { Popover, PopoverTrigger } from './base/popover';
import { Tooltip, TooltipTrigger } from './base/tooltip';
import { CardTrigger } from './CardTrigger';
import { CardContent } from './CardContent';

export interface DeckProps {
  cards: Cards;
  paragons: Paragons;
}

export const MyDeck = (props: DeckProps) => {
  const { cards, paragons } = props;

  const parallelChoice = useAtomValue(parallelChoiceAtom);
  const [activeParagon, setActiveParagon] = useAtom(paragonAtom);
  const [deck, setDeck] = useAtom(deckAtom);
  const hoverEnabled = useAtomValue(showDetailsAtom);
  const setDeckError = useSetAtom(deckErrorAtom);
  const [mobile, setMobile] = useAtom(isMobile);

  const [cardInfo, setCardInfo] = useState(cards[0]);
  const [deckCode, setDeckCode] = useState('');
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [cardListVisible, setShowCardList] = useAtom(showCardList);
  const { copyToClipboard } = useCopyToClipboard();

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

  // setDefaultParagon

  useEffect(() => {
    const getDefaultParagon = () => {
      let result;
      switch (parallelChoice) {
        case 'Augencore': {
          const [aug] = paragons.filter((paragon) => paragon.gameData.parallel === 'Augencore');
          result = aug;
          break;
        }
        case 'Earthen': {
          const [earthen] = paragons.filter((paragon) => paragon.gameData.parallel === 'Earthen');
          result = earthen;
          break;
        }
        case 'Kathari': {
          const [kathari] = paragons.filter((paragon) => paragon.gameData.parallel === 'Kathari');
          result = kathari;
          break;
        }
        case 'Marcolian': {
          const [marcolian] = paragons.filter(
            (paragon) => paragon.gameData.parallel === 'Marcolian',
          );
          result = marcolian;
          break;
        }
        case 'Shroud': {
          const [shroud] = paragons.filter((paragon) => paragon.gameData.parallel === 'Shroud');
          result = shroud;
          break;
        }
        default:
          break;
      }
      return result;
    };

    if (activeParagon?.name === '') {
      const newActiveParagon = getDefaultParagon();
      if (newActiveParagon && newActiveParagon.name !== activeParagon.name) {
        setActiveParagon(newActiveParagon);
      }
    } else if (parallelChoice === '') {
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
    }
  }, [activeParagon.name, paragons, parallelChoice, setActiveParagon]);

  const deckRef = useRef(deck);

  useEffect(() => {
    deckRef.current = deck;
  }, [deck]);

  useEffect(() => {
    if (activeParagon?.tokenId === '10929') {
      const filteredDeck = deckRef.current.filter((card) => Number(card.gameData.cost) <= 5);
      setDeck(filteredDeck);
    }
  }, [activeParagon, setDeck]);

  // set deck code
  useEffect(() => {
    const codeIds = deck.map((card) => card.id);
    // Accumulate counts of each item
    const counts = codeIds.reduce((acc: { [x: string]: number }, item: string) => {
      if (item in acc) {
        acc[item]++;
      } else {
        acc[item] = 1;
      }
      return acc;
    }, {});

    // Convert counts to formatted strings
    const formattedItems = Object.entries(counts)
      .map(([item, count]) => (count === 1 ? item : `${count}X${item}`))
      .join(',');

    setDeckCode(`${activeParagon?.id},${formattedItems}`);
  }, [deck, activeParagon]);

  // map placeholder cards
  const placeHolderCards = [];

  if (deck.length === 0) {
    for (let i = 1; i <= 40; i++) {
      placeHolderCards.push(i);
    }
  } else {
    for (let i = 1; i <= 40 - deck.length; i++) {
      placeHolderCards.push(i);
    }
  }

  const handleParagonChange = (direction: string) => {
    let aug,
      augIndex,
      earthen,
      earthenIndex,
      kathari,
      kathariIndex,
      marcolian,
      marcolianIndex,
      shroud,
      shroudIndex;
    switch (parallelChoice) {
      case 'Augencore':
        aug = paragons.filter((paragon) => paragon.gameData.parallel === 'Augencore');
        augIndex = aug.findIndex((p) => p.tokenId === activeParagon?.tokenId);
        if (direction === 'right') {
          if (augIndex !== aug.length - 1) {
            const nextParagon = aug?.[augIndex + 1];
            if (nextParagon) {
              setActiveParagon(nextParagon);
            }
          }
        }
        if (direction === 'left') {
          if (augIndex !== 0) {
            const prevParagon = aug?.[augIndex - 1];
            if (prevParagon) {
              setActiveParagon(prevParagon);
            }
          }
        }
        break;
      case 'Earthen':
        earthen = paragons.filter((paragon) => paragon.gameData.parallel === 'Earthen');
        earthenIndex = earthen.findIndex((p) => p.tokenId === activeParagon?.tokenId);
        if (direction === 'right') {
          if (earthenIndex !== earthen.length - 1) {
            const nextParagon = earthen?.[earthenIndex + 1];
            if (nextParagon) {
              setActiveParagon(nextParagon);
            }
          }
        }
        if (direction === 'left') {
          if (earthenIndex !== 0) {
            const prevParagon = earthen?.[earthenIndex - 1];
            if (prevParagon) {
              setActiveParagon(prevParagon);
            }
          }
        }
        break;
      case 'Kathari':
        kathari = paragons.filter((paragon) => paragon.gameData.parallel === 'Kathari');
        kathariIndex = kathari.findIndex((p) => p.tokenId === activeParagon?.tokenId);
        if (direction === 'right') {
          if (kathariIndex !== kathari.length - 1) {
            const nextParagon = kathari?.[kathariIndex + 1];
            if (nextParagon) {
              setActiveParagon(nextParagon);
            }
          }
        }
        if (direction === 'left') {
          if (kathariIndex !== 0) {
            const prevParagon = kathari?.[kathariIndex - 1];
            if (prevParagon) {
              setActiveParagon(prevParagon);
            }
          }
        }
        break;
      case 'Marcolian':
        marcolian = paragons.filter((paragon) => paragon.gameData.parallel === 'Marcolian');
        marcolianIndex = marcolian.findIndex((p) => p.tokenId === activeParagon?.tokenId);
        if (direction === 'right') {
          if (marcolianIndex !== marcolian.length - 1) {
            const nextParagon = marcolian?.[marcolianIndex + 1];
            if (nextParagon) {
              setActiveParagon(nextParagon);
            }
          }
        }
        if (direction === 'left') {
          if (marcolianIndex !== 0) {
            const prevParagon = marcolian?.[marcolianIndex - 1];
            if (prevParagon) {
              setActiveParagon(prevParagon);
            }
          }
        }
        break;
      case 'Shroud':
        shroud = paragons.filter((paragon) => paragon.gameData.parallel === 'Shroud');
        shroudIndex = shroud.findIndex((p) => p.tokenId === activeParagon?.tokenId);
        if (direction === 'right') {
          if (shroudIndex !== shroud.length - 1) {
            const nextParagon = shroud?.[shroudIndex + 1];
            if (nextParagon) {
              setActiveParagon(nextParagon);
            }
          }
        }
        if (direction === 'left') {
          if (shroudIndex !== 0) {
            const prevParagon = shroud?.[shroudIndex - 1];
            if (prevParagon) {
              setActiveParagon(prevParagon);
            }
          }
        }
        break;
      default:
        break;
    }
  };

  function addOne(card: Card) {
    if (deck.length < 40) {
      // find position in deck of card in order to place copies next to it
      const index = deck.findIndex((item) => item.tokenId === card.tokenId);
      // get total amount of specifc card in a active deck
      const count = deck.filter((d) => d.tokenId === card.tokenId).length;
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

  function removeOne(index: number) {
    setDeck((prevDeck) => prevDeck.filter((_, i) => i !== index));
  }

  const sortedCards = deck.sort((a, b) => Number(a.gameData.cost) - Number(b.gameData.cost));

  function handlePassiveText(text: string) {
    const modifiedString = text?.replace(/\n/g, ' ');
    const result = modifiedString?.split(' ');

    function handleWordStyles(arr: string[], tag: string | null) {
      const formatted = arr.map((word, index) => {
        // Regular expression to match pattern "*word*" || "*Battle" "Ready*"
        const pattern = /\*(Battle.*?)|(.*?Ready\*)|\*(.*?)\*/g;
        if (word.match(pattern)) {
          const formattedWord = word.replace(/\*/g, ''); // Remove asterisks
          return (
            <span key={uuidv4()} className="italic text-lime-400">
              {formattedWord}{' '}
            </span>
          );
        }
        if (word === '*' && arr[index - 1] !== '*' && arr[index + 1] !== '*') {
          return (
            <div key={uuidv4()}>
              <br />
            </div>
          ); // Replace single asterisk with a <br> tag
        }
        return <span key={uuidv4()}>{word} </span>;
      });
      return (
        <div className="flex flex-col gap-2 pb-4 pt-1">
          <div>
            {tag === 'Muster:' && (
              <span className="text-md mr-1 w-fit rounded-md bg-slate-800 p-1 font-bold">
                {tag}
              </span>
            )}
            {tag !== 'Muster:' && tag !== null && (
              <span className="italic text-lime-400">{tag} </span>
            )}
            {formatted}
          </div>
        </div>
      );
    }

    function handlePassive(arr: string[]) {
      const passive = [...arr];
      passive.shift(); // since muster was the first word, now remove it from array
      return handleWordStyles(passive, 'Passive:');
    }

    if (result[0] === '*Passive*:') {
      return handlePassive(result);
    }
  }
  const [, setPopoverOpen] = useState(false);

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  return (
    <div className="flex h-full w-full flex-col gap-8 rounded-xl bg-surface-2 py-0 pl-0 shadow-lg xl:flex-row xl:gap-0 xl:py-8 xl:pl-8 ">
      <AddToDeckErrorMessage />
      <ImportErrorMessage />
      <AddToDeckSuccess />
      <CopyAlert text={deckCode} showAlert={showAlert} setShowAlert={setShowAlert} />
      <div className=" flex h-fit w-full flex-col items-start justify-center overflow-hidden rounded-xl bg-surface xl:h-full xl:w-2/6 ">
        <div className="flex w-full justify-center p-2">
          <p className="text-lg font-bold">Paragon</p>
        </div>

        <div className="flex h-56 w-full overflow-hidden xl:h-2/5">
          {mobile ? (
            <RadixPopover.Root>
              <div className="relative flex h-full w-full">
                <RadixPopover.Trigger asChild>
                  {parallelChoice === '' ? (
                    <Image
                      src={'/images/paragonPlaceholder.png'}
                      alt="card"
                      fill
                      style={{ objectFit: 'contain' }}
                      id="1"
                      sizes="50vw"
                    />
                  ) : (
                    <Image
                      src={activeParagon?.media.image ?? ''}
                      alt="Paragon"
                      fill
                      style={{ objectFit: 'contain' }}
                      id="1"
                      sizes="50vw"
                    />
                  )}
                </RadixPopover.Trigger>
                {activeParagon.id !== '' && hoverEnabled ? (
                  <RadixPopover.Content
                    side="bottom"
                    align="center"
                    sideOffset={2}
                    className={clsx(
                      'radix-side-top:animate-slide-up radix-side-bottom:animate-slide-down z-50 h-[400px] w-[300px]',
                      'rounded-xl p-8',
                      'bg-neutral-500 shadow-2xl shadow-black dark:bg-gray-800',
                      'focus:outline-none',
                    )}
                  >
                    <RadixPopover.Arrow className="fill-current text-slate-600 dark:text-gray-800" />

                    <div className="flex h-full w-full space-x-4">
                      <div className="flex flex-col gap-4">
                        <h1 className="text-2xl font-bold text-gray-100 dark:text-gray-100">
                          {activeParagon?.name
                            ? activeParagon.name.substring(0, activeParagon.name.length - 8)
                            : ''}
                        </h1>
                        <h2 className="text-xl font-medium text-gray-900 dark:text-gray-500">
                          {activeParagon?.gameData.cardType}
                        </h2>
                        <div className="p-y overflow-y-auto text-sm font-normal text-gray-100 dark:text-gray-400">
                          {formatText(activeParagon?.gameData.functionText ?? '')}
                        </div>
                        <div className="p-y overflow-y-auto text-sm font-normal text-gray-100 dark:text-gray-400">
                          {handlePassiveText(activeParagon?.gameData.passiveAbility ?? '')}
                        </div>
                        <div>
                          <p className="text-md font-medium text-gray-100 dark:text-gray-100">
                            Energy Cost: {activeParagon?.gameData.cost}
                          </p>
                        </div>
                        <div className="flex flex-row gap-6">
                          <p className="text-md font-medium text-gray-100 dark:text-gray-100">
                            Attack: {activeParagon?.gameData.attack}
                          </p>
                          <p className="text-md font-medium text-gray-100 dark:text-gray-100">
                            Health: {activeParagon?.gameData.health}
                          </p>
                        </div>
                      </div>
                    </div>
                  </RadixPopover.Content>
                ) : null}
              </div>
            </RadixPopover.Root>
          ) : (
            <HoverCardPrimitive.Root openDelay={0} closeDelay={0}>
              <div className="relative flex h-full w-full">
                <HoverCardPrimitive.Trigger asChild className="relative">
                  {parallelChoice === '' ? (
                    <Image
                      src="/images/paragonPlaceholder.png"
                      alt="card"
                      fill
                      style={{ objectFit: 'contain' }}
                      id="1"
                      sizes="50vw"
                    />
                  ) : (
                    <Image
                      src={activeParagon?.media.image ?? ''}
                      alt="Paragon"
                      fill
                      style={{ objectFit: 'contain' }}
                      id="1"
                      sizes="50vw"
                    />
                  )}
                </HoverCardPrimitive.Trigger>
                {activeParagon.id !== '' && hoverEnabled && (
                  <HoverCardPrimitive.Content
                    side="bottom"
                    align="center"
                    sideOffset={2}
                    className={clsx(
                      'radix-side-top:animate-slide-up radix-side-bottom:animate-slide-down z-50 h-[400px] w-[600px]',
                      ' rounded-xl p-4',
                      'bg-neutral-500 shadow-2xl shadow-black dark:bg-gray-800',
                      'focus:outline-none focus-visible:ring focus-visible:ring-lime-500 focus-visible:ring-opacity-75',
                    )}
                  >
                    <div className="flex h-full w-full space-x-4">
                      <div className="flex w-1/2 items-center justify-center py-4">
                        <div className="h-96 w-64 py-2">
                          <Image
                            src={activeParagon?.media.image ?? ''}
                            alt="card"
                            className="h-full w-full rounded-md"
                            height={72}
                            width={500}
                            style={{ objectFit: 'cover' }}
                          />
                        </div>
                      </div>
                      <div className="flex flex-col gap-4">
                        <h1 className="text-3xl font-bold text-gray-100 dark:text-gray-100">
                          {activeParagon?.name
                            ? activeParagon.name.substring(0, activeParagon.name.length - 8)
                            : ''}
                        </h1>
                        <h2 className="text-xl font-medium text-gray-100 dark:text-gray-100">
                          {activeParagon?.gameData.cardType}
                        </h2>
                        <div className="p-y overflow-y-auto text-sm font-normal text-gray-100 dark:text-gray-400">
                          {formatText(activeParagon?.gameData.functionText ?? '')}
                        </div>
                        <div className="p-y overflow-y-auto text-sm font-normal text-gray-100 dark:text-gray-400">
                          {handlePassiveText(activeParagon?.gameData.passiveAbility ?? '')}
                        </div>
                        <div>
                          <p className="text-md font-medium text-gray-100 dark:text-gray-100">
                            Energy Cost: {activeParagon?.gameData.cost}
                          </p>
                        </div>
                        <div className="flex flex-row gap-6">
                          <p className="text-md font-medium text-gray-100 dark:text-gray-100">
                            Attack: {activeParagon?.gameData.attack}
                          </p>
                          <p className="text-md font-medium text-gray-100 dark:text-gray-100">
                            Health: {activeParagon?.gameData.health}
                          </p>
                        </div>
                      </div>
                    </div>
                  </HoverCardPrimitive.Content>
                )}
              </div>
            </HoverCardPrimitive.Root>
          )}
        </div>
        <div className="flex h-24 w-full flex-col  items-center justify-center  ">
          <p>
            {activeParagon?.name
              ? activeParagon.name.substring(0, activeParagon.name.length - 8)
              : ''}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleParagonChange('left')}
              className="h-12 w-12 "
              title="Change Paragon"
            >
              <ArrowLeftCircle className="h-8 w-8 dark:text-neutral-400" />
            </button>
            <button
              type="button"
              onClick={() => handleParagonChange('right')}
              className="h-12 w-12 "
              title="Change Paragon"
            >
              <ArrowRightCircle className="h-8 w-8 dark:text-neutral-400" />
            </button>
          </div>
        </div>
        <div className="h-96 w-full border-t-2 border-neutral-300 dark:border-neutral-600 xl:h-3/5">
          <div className="h-48 w-full px-6 xl:h-1/2">
            <TypeChart />
          </div>
          <div className=" h-48 w-full p-6 xl:h-1/2">
            <EnergyChart />
          </div>
        </div>
      </div>
      <div className="flex h-fit w-full flex-wrap items-center justify-center gap-2 overflow-y-auto xl:h-full xl:w-4/6">
        <div className="flex w-full items-center justify-between px-4 pb-4">
          <div className="mr-4 flex flex-row gap-2 xl:mr-0">
            <StatsToggle />
            <HoverToggle />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              title="Clear Deck"
              onClick={() => setDeck([])}
              className="rounded-md bg-surface-3 p-2 text-fg-4 hover:bg-surface-4"
            >
              <XCircle className="h-6 w-6" />
            </button>{' '}
            <button
              type="button"
              title="Save and Copy Deck Code"
              onClick={() => {
                (async () => {
                  try {
                    await copyToClipboard(deckCode, setShowAlert);
                  } catch (error) {
                    // eslint-disable-next-line no-console
                    console.error('Error copying to clipboard:', error);
                  }
                })().catch((error) => {
                  // eslint-disable-next-line no-console
                  console.error('Error in async function:', error);
                });
              }}
              className="rounded-md bg-surface-3 p-2 text-fg-4 hover:bg-surface-4"
            >
              <Download className="h-6 w-6" />
            </button>
            <button
              title="Expand/Toggle Card List"
              onClick={() => setShowCardList(!cardListVisible)}
              className="rounded-md bg-surface-3 p-2 text-fg-4 hover:bg-surface-4"
            >
              <Expand className="h-6 w-6" />
            </button>
          </div>
        </div>
        {deck.length === 0
          ? null
          : sortedCards.map((card, index) =>
              mobile ? (
                <div key={index}>
                  <PopoverTrigger>
                    <CardTrigger
                      card={card}
                      hoverEnabled={hoverEnabled}
                      setCardInfo={setCardInfo}
                      setPopoverOpen={setPopoverOpen}
                      setHoveredIndex={setHoveredIndex}
                      index={index}
                    >
                      <Image
                        src={card.media.image}
                        alt="card"
                        className="  h-24 w-16  rounded-md bg-slate-700 p-0"
                        fill
                        sizes="50vw"
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
                      className={clsx(
                        'radix-side-top:animate-slide-up radix-side-bottom:animate-slide-down z-50 h-[300px] w-[700px]  xl:h-[400px] xl:w-[600px]',
                        ' rounded-xl p-4',
                        'bg-neutral-500 shadow-2xl shadow-black dark:bg-gray-800',
                        'focus:outline-none',
                      )}
                    >
                      <CardContent cardInfo={cardInfo} />
                    </Popover>
                    <div className="flex w-full flex-row items-center justify-center gap-2 pt-1">
                      <button type="button" onClick={() => removeOne(index)}>
                        <MinusSquare className="h-6 w-6 fill-surface-4 text-surface-2" />
                      </button>
                      <button type="button" onClick={() => addOne(card)}>
                        <PlusSquare className="h-6 w-6 fill-surface-4 text-surface-2" />
                      </button>
                    </div>
                  </PopoverTrigger>
                </div>
              ) : (
                <div key={index}>
                  <TooltipTrigger
                    isOpen={hoverEnabled && hoveredIndex === index}
                    onOpenChange={(newState) => {
                      if (newState) {
                        setHoveredIndex(index);
                      } else {
                        setHoveredIndex(null);
                      }
                    }}
                  >
                    <CardTrigger
                      card={card}
                      hoverEnabled={hoverEnabled}
                      setCardInfo={setCardInfo}
                      setPopoverOpen={setPopoverOpen}
                      setHoveredIndex={setHoveredIndex}
                      index={index}
                    >
                      <Image
                        src={card.media.image}
                        alt="card"
                        className="h-24 w-16 rounded-md bg-slate-700 p-0"
                        fill
                        sizes="50vw"
                        style={{ objectFit: 'cover' }}
                      />
                    </CardTrigger>

                    <Tooltip
                      className={clsx(
                        'radix-side-top:animate-slide-up radix-side-bottom:animate-slide-down z-50 h-[300px] w-[700px]  xl:h-[400px] xl:w-[600px]',
                        ' rounded-xl p-4',
                        'bg-neutral-500 shadow-2xl shadow-black dark:bg-gray-800',
                        'focus:outline-none',
                      )}
                    >
                      <CardContent cardInfo={cardInfo} />
                    </Tooltip>
                    <div className="flex w-full flex-row items-center justify-center gap-2 pt-1">
                      <button type="button" onClick={() => removeOne(index)}>
                        <MinusSquare className="h-6 w-6 fill-surface-4 text-surface-2" />
                      </button>
                      <button type="button" onClick={() => addOne(card)}>
                        <PlusSquare className="h-6 w-6 fill-surface-4 text-surface-2" />
                      </button>
                    </div>
                  </TooltipTrigger>
                </div>
              ),
            )}
        {placeHolderCards.map((index) => (
          <div key={index}>
            <div className="relative flex h-36 w-24 flex-col items-center justify-start rounded-md bg-slate-800 ">
              <Image
                src="/images/placeholder.png"
                alt="Placeholder Card"
                className="rounded-md"
                fill
                sizes="10vh"
                style={{ objectFit: 'cover', objectPosition: 'top' }}
              />
            </div>
            <div className="flex w-full flex-row justify-center gap-2 pt-1">
              <span className="flex h-6 w-6 items-center justify-center rounded-sm " />
              <span className="flex h-6 w-6 items-center justify-center rounded-sm " />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
