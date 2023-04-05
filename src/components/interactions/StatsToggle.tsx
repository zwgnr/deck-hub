import { Switch } from '@headlessui/react';
import { clsx } from 'clsx';
import { useAtom } from 'jotai';
import { showStatsAtom } from '~/lib/atoms';

export const StatsToggle = () => {
  const [statsEnabled, setStatsEnabled] = useAtom(showStatsAtom);
  return (
    <Switch.Group as="div" className="flex items-center justify-between">
      <span className="flex flex-grow flex-col">
        <Switch.Label
          as="span"
          className="mr-2 text-sm font-medium text-neutral-600 dark:text-neutral-300"
          passive
        >
          Quick Stats
        </Switch.Label>
      </span>
      <Switch
        checked={statsEnabled}
        onChange={setStatsEnabled}
        className={clsx(
          statsEnabled ? 'bg-lime-400' : 'bg-neutral-300 dark:bg-neutral-600',
          'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ease-in-out',
        )}
      >
        <span className="sr-only">Enable Card Stats</span>
        <span
          aria-hidden="true"
          className={clsx(
            statsEnabled ? 'translate-x-6 ' : 'translate-x-1',
            'pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
          )}
        />
      </Switch>
    </Switch.Group>
  );
};
