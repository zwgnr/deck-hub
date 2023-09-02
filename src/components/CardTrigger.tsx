import { useAtom, useAtomValue } from 'jotai';
import { Button } from './base/button';

import { isMobile, showStatsAtom } from '~/lib/atoms';
import { handleCardType } from '~/lib/handleCardType';
import { Card } from '~/types/sharedTypes';
import { handleCardIcon } from '~/lib/handleCardIcon';
import { Dispatch, ReactNode } from 'react';
import clsx from 'clsx';

export interface CardTriggerProps {
  card: Card;
  hoverEnabled: boolean;
  addToDeck?: (card: Card) => void;
  setCardInfo: (card: Card) => void;
  getOpacity?: (card: string) => null | string;
  setPopoverOpen: Dispatch<React.SetStateAction<boolean>>;
  setHoveredIndex: Dispatch<React.SetStateAction<number | null>>;
  index: number;
  children: ReactNode;
}

export const CardTrigger = (props: CardTriggerProps) => {
  const {
    card,
    hoverEnabled,
    addToDeck,
    setCardInfo,
    setPopoverOpen,
    setHoveredIndex,
    index,
    children,
  } = props;
  const statsEnabled = useAtomValue(showStatsAtom);
  const [mobile] = useAtom(isMobile);
  return (
    <div
      className={mobile || addToDeck === undefined ? 'relative h-36 w-24 ' : 'relative h-60 w-40 '}
    >
      {statsEnabled ? (
        <>
          <div
            className={clsx(
              'absolute top-0 z-10 flex items-center justify-center text-gray-300',
              addToDeck === undefined ? 'right-8' : 'right-16',
            )}
          >
            {handleCardType(card.gameData.cardType)}
          </div>
          <div
            className={clsx(
              'absolute top-2 z-10 flex items-center justify-center px-1 text-white',
              addToDeck === undefined ? 'right-1' : 'right-2 ',
            )}
          >
            <p>{card.gameData.cost}</p>
          </div>
        </>
      ) : null}
      {card.gameData.cardType === 'Unit' && statsEnabled ? (
        <>
          <div
            className={clsx(
              'absolute  z-10 flex items-center justify-center px-1 text-white',
              addToDeck === undefined ? 'bottom-6 left-1' : 'bottom-10 left-2',
            )}
          >
            <p>{card.gameData.attack}</p>
          </div>
          <div
            className={clsx(
              'absolute z-10 flex items-center justify-center  px-1 text-gray-200',
              addToDeck === undefined ? 'bottom-6 right-8' : 'bottom-10 right-16',
            )}
          >
            {handleCardIcon(card.gameData.functionText)}
          </div>
          <div
            className={clsx(
              'absolute z-10 flex items-center justify-center  px-1 text-white',
              addToDeck === undefined ? 'bottom-6 right-1' : 'bottom-10 right-2',
            )}
          >
            <p>{card.gameData.health}</p>
          </div>
        </>
      ) : null}

      <Button
        onPress={() => {
          if (mobile && hoverEnabled) {
            setCardInfo(card);
            setHoveredIndex(index);
            setPopoverOpen(true);
          } else {
            addToDeck === null ? null : addToDeck !== undefined ? addToDeck(card) : null;
          }
        }}
        intent="secondary"
        className="h-full w-full bg-transparent p-0 data-[hovered]:bg-transparent"
      >
        {({ isHovered }) => (
          <>
            {!mobile && isHovered && setCardInfo(card)}
            {children}
          </>
        )}
      </Button>
    </div>
  );
};
