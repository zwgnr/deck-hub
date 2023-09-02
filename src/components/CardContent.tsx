import { useAtom } from 'jotai';
import Image from 'next/image';
import { isMobile } from '~/lib/atoms';
import { formatText } from '~/lib/formatCardText';

export const CardContent = ({cardInfo}) => {
  const [mobile, setMobile] = useAtom(isMobile);
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
          <h1 className="text-3xl font-bold text-gray-100 dark:text-gray-100">{cardInfo?.name}</h1>
          <h2 className="mb-4 text-xl font-medium text-gray-900 dark:text-gray-500">
            {cardInfo?.gameData.cardType}
          </h2>
        </div>
        <div className="p-y overflow-y-auto text-sm font-normal text-gray-100 dark:text-gray-400">
          {formatText(cardInfo?.gameData.functionText ?? '')}
        </div>
        <div className=" flex flex-col gap-2">
          <div>
            <p className="text-lg font-medium text-gray-100 dark:text-gray-100">
              Energy: {cardInfo?.gameData.cost}
            </p>
          </div>
          <div className="flex flex-row gap-6">
            <p className="text-lg font-medium text-gray-100 dark:text-gray-100">
              Attack: {cardInfo?.gameData.attack}
            </p>
            <p className="text-lg font-medium text-gray-100 dark:text-gray-100">
              Health: {cardInfo?.gameData.health}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
