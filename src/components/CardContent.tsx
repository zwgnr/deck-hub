import { useAtom } from 'jotai';
import Image from 'next/image';
import { isMobile } from '~/lib/atoms';
import { formatText } from '~/lib/formatCardText';
import { Card } from '~/types/sharedTypes';

interface CardContentProps {
  cardInfo?: Card;
}

export const CardContent = (props: CardContentProps) => {
  const { cardInfo } = props;
  const [mobile] = useAtom(isMobile);
  return (
    <div className="flex h-full w-full space-x-4">
      {mobile ? null : (
        <div className="flex w-1/2 items-center justify-center py-4">
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
      )}
      <div className="flex h-full flex-col justify-between py-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-fg-3">{cardInfo?.name}</h1>
          <h2 className="mb-4 text-xl font-medium text-gray-900 dark:text-gray-500">
            {cardInfo?.gameData.cardType}
          </h2>
        </div>
        <div className="p-y overflow-y-auto text-sm font-normal text-fg-4">
          {formatText(cardInfo?.gameData.functionText ?? '')}
        </div>
        <div className=" flex flex-col gap-2 rounded-lg bg-surface-3 p-2">
          <div>
            <p className="text-lg font-medium text-fg-3">Energy: {cardInfo?.gameData.cost}</p>
          </div>
          <div className="flex flex-row gap-6">
            <p className="text-lg font-medium text-fg-3">Attack: {cardInfo?.gameData.attack}</p>
            <p className="text-lg font-medium text-fg-3">Health: {cardInfo?.gameData.health}</p>
          </div>
        </div>
        <div className="mt-2 flex items-center gap-2 text-lg font-medium text-fg-3">
          <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 320 512">
            <path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z" />
          </svg>
          <a
            href={`https://opensea.io/assets/ethereum/0x76be3b62873462d2142405439777e971754e8e77/${cardInfo?.tokenId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            {Number(cardInfo?.lastPriceNetworkBaseToken).toFixed(4)} ($
            {Number(cardInfo?.lastPriceUsd).toFixed(2)})
          </a>
        </div>
      </div>
    </div>
  );
};
