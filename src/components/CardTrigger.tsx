import { useAtom, useAtomValue } from 'jotai';
import { Button } from './base/button';

import { isMobile, showStatsAtom } from '~/lib/atoms';
import { handleCardType } from '~/lib/handleCardType';
import { Card } from '~/types/sharedTypes';
import { handleCardIcon } from '~/lib/handleCardIcon';
import { Dispatch, ReactNode } from 'react';

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
      className={mobile || addToDeck === undefined ? 'relative  h-36 w-24 ' : 'relative h-60 w-40 '}
    >
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
