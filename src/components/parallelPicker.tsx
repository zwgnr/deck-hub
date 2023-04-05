import clsx from 'clsx';
import Image from 'next/image';
import { parallelChoiceAtom } from '~/lib/atoms';
import { useSetAtom } from 'jotai';
import { v4 as uuidv4 } from 'uuid';

export const parallels = [
  {
    name: 'Augencore',
    current: false,
    color:
      'hover:shadow-orange-600 hover:border-orange-600 dark:hover:border-orange-600 hover:border-2',
    img: '/images/augencore.png',
  },
  {
    name: 'Earthen',
    current: false,
    color:
      'hover:shadow-green-600 hover:border-green-600 dark:hover:border-green-600 hover:border-2',
    img: '/images/earthen.png',
  },
  {
    name: 'Kathari',
    current: false,
    color: 'hover:shadow-blue-600 hover:border-blue-600 dark:hover:border-blue-600 hover:border-2',
    img: '/images/kathari.png',
  },
  {
    name: 'Marcolian',
    current: false,
    color: 'hover:shadow-red-600 hover:border-red-600 dark:hover:border-red-600 hover:border-2',
    img: '/images/marcolian.png',
  },
  {
    name: 'Shroud',
    current: false,
    color:
      'hover:shadow-violet-600 hover:border-violet-600 dark:hover:border-violet-600 hover:border-2',
    img: '/images/shroud.png',
  },
];

export const ParallelPicker = () => {
  const setParallelChoice = useSetAtom(parallelChoiceAtom);
  return (
    <div className="flex h-full w-full flex-col items-center justify-start gap-2 overflow-auto p-4 py-10">
      <h1 className="mb-8 text-2xl font-bold">Choose Your Parallel</h1>

      <div className="flex h-4/5 w-full flex-row flex-wrap items-center justify-center gap-8">
        {parallels.map((faction) => (
          <button
            key={uuidv4()}
            type="button"
            onClick={() => setParallelChoice(faction.name)}
            className={clsx(
              faction.color,
              'duration-400 background h-64 w-64 transform  rounded-2xl border-2 border-transparent  bg-black p-6 transition hover:scale-110 hover:shadow-xl dark:bg-black',
            )}
          >
            <Image src={faction.img} height={400} width={400} alt={faction.name} />
          </button>
        ))}
      </div>
    </div>
  );
};
