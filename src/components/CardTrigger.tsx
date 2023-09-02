import { useAtom, useAtomValue } from 'jotai';
import { Button } from './base/button';

import Image from 'next/image';
import { isMobile, showStatsAtom } from '~/lib/atoms';
import { handleCardType } from '~/lib/handleCardType';
import { Card } from '~/types/sharedTypes';
import { handleCardIcon } from '~/lib/handleCardIcon';
import clsx from 'clsx';

export const CardTrigger = ({
  card,
  hoverEnabled,
  addToDeck,
  setCardInfo,
  getOpacity,
  setPopoverOpen,
  setHoveredIndex,
  index,
  children,
}) => {
  const statsEnabled = useAtomValue(showStatsAtom);
  const [mobile, setMobile] = useAtom(isMobile);
  return (
    <div
      className={
        mobile || addToDeck === null
          ? 'relative  h-36 w-24 '
          : 'relative h-60 w-40 '
      }
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
            addToDeck === null ? null : addToDeck(card);
          }
        }}
        intent="secondary"
        className="h-full w-full p-0 bg-transparent"
      >
        {({ isPressed, isHovered }) => (
          <>
            {!mobile && isHovered && setCardInfo(card)}
            {children}
          </>
        )}
      </Button>
    </div>
  );
};
