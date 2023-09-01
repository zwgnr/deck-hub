import {
  type ChangeEvent,
  type Dispatch,
  type SetStateAction,
  Fragment,
  useEffect,
  useState,
  useRef,
} from 'react';

import { Disclosure, Menu, Transition } from '@headlessui/react';

import clsx from 'clsx';

import { type FilterOptions, filterOptions } from '~/lib/filterOptions';

import type { Card, Cards } from '~/types/sharedTypes';
import { ChevronDown, Filter } from 'lucide-react';

export interface FilterPanelProps {
  cards: Cards;
  setVisibleCards: Dispatch<SetStateAction<never[] | Cards>>;
}

export const FilterPanel = (props: FilterPanelProps) => {
  const { cards, setVisibleCards } = props;
  const [sortOption, setSortOption] = useState('');
  const [fitlerCount, setFilterCount] = useState(0);
  const [clear, setClear] = useState(false);

  const sortOptions = [
    { name: 'Energy Cost', href: '#', current: false },
    { name: 'Health', href: '#', current: false },
    { name: 'Attack', href: '#', current: false },
    { name: 'Alphabetical', href: '#', current: false },
  ];

  const [filters, setFilters] = useState<FilterOptions>(filterOptions);

  type ActiveFilters = {
    [key: string]: string[];
  };

  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
    parallel: [],
    rarity: [],
    type: [],
    subType: [],
    energy: [],
  });

  function addFilter(optionType: string, filterValue: string) {
    if (!activeFilters[optionType]?.includes(filterValue)) {
      setActiveFilters((prev) => ({
        ...prev,
        [optionType]: [...(prev[optionType] ?? []), filterValue],
      }));
    }
  }

  function removeFilter(optionType: string, filterValue: string) {
    setActiveFilters((prev) => ({
      ...prev,
      [optionType]: prev[optionType]?.filter((i) => i !== filterValue) ?? [],
    }));
  }

  function handleCheckedChange(
    event: ChangeEvent<HTMLInputElement>,
    optionType: keyof FilterOptions,
    optionIdx: number,
    filterValue: string,
  ) {
    const isChecked = event.target.checked;
    const newFilters = { ...filters };

    if (newFilters[optionType] !== undefined && newFilters[optionType][optionIdx] !== undefined) {
      const currentFilter = newFilters[optionType][optionIdx];
      if (currentFilter !== undefined) {
        currentFilter.checked = isChecked;
        newFilters[optionType][optionIdx] = currentFilter;
      }
    }

    setFilters(newFilters);
    // iterate the filters state and count how many boxes are checked

    interface FilterItem {
      checked: boolean;
    }

    // get count of how many filters enabled
    const totalCount: number = (Object.values(filters) as FilterItem[][]).reduce(
      (accumulator: number, currentValue: FilterItem[]) => {
        const checkedCount: number = currentValue.filter((item: FilterItem) => item.checked).length;
        return accumulator + checkedCount;
      },
      0,
    );

    setFilterCount(totalCount);

    isChecked ? addFilter(optionType, filterValue) : removeFilter(optionType, filterValue);
  }

  interface IndividualFilterOptions {
    value: string;
    label: string;
    checked: boolean;
  }

  const prevClear = useRef(false);

  useEffect(() => {
    const resetOptions = (options: IndividualFilterOptions[]) =>
      options.map((option) => ({ ...option, checked: false }));

    const resetFilters = () => {
      setFilters({
        parallel: resetOptions(filters.parallel),
        rarity: resetOptions(filters.rarity),
        type: resetOptions(filters.type),
        subType: resetOptions(filters.subType),
        energy: resetOptions(filters.energy),
      });
    };

    if (!prevClear.current && clear) {
      setActiveFilters({
        parallel: [],
        rarity: [],
        type: [],
        subType: [],
        energy: [],
      });
      setFilterCount(0);
      resetFilters();
      setClear(false);
    }

    prevClear.current = clear;
  }, [clear, filters]);

  useEffect(() => {
    // Filter options updated so apply all filters here
    let result = cards;
    let sorted;
    // clean this up!
    result = cards.filter(
      (card: Card) =>
        (activeFilters.parallel?.length === 0 ||
          activeFilters.parallel?.includes(card.gameData.parallel)) &&
        (activeFilters.rarity?.length === 0 ||
          activeFilters.rarity?.includes(card.gameData.rarity)) &&
        (activeFilters.type?.length === 0 ||
          activeFilters.type?.includes(card.gameData.cardType)) &&
        (activeFilters.subType?.length === 0 ||
          activeFilters.subType?.includes(card.gameData.subtype)) &&
        (activeFilters.energy?.length === 0 || activeFilters.energy?.includes(card.gameData.cost)),
    );
    setVisibleCards([]);
    switch (sortOption) {
      case 'Health':
        sorted = result.sort(
          (a: { gameData: { health: string } }, b: { gameData: { health: string } }) =>
            Number(a.gameData.health) - Number(b.gameData.health),
        );
        break;
      case 'Attack':
        sorted = result.sort(
          (a: { gameData: { attack: string } }, b: { gameData: { attack: string } }) =>
            Number(a.gameData.attack) - Number(b.gameData.attack),
        );
        break;
      case 'Alphabetical':
        sorted = result.sort((a: { name: string }, b: { name: string }) =>
          a.name.localeCompare(b.name),
        );
        break;
      default:
        sorted = result.sort(
          (a: { gameData: { cost: string } }, b: { gameData: { cost: string } }) =>
            Number(a.gameData.cost) - Number(b.gameData.cost),
        );
        break;
    }
    setVisibleCards(sorted);
  }, [activeFilters, cards, setVisibleCards, sortOption]);

  return (
    <div className="dark:bg-neutral-800">
      {/* Filters */}
      <Disclosure
        as="section"
        aria-labelledby="filter-heading"
        className="relative z-10 grid items-center"
      >
        <h2 id="filter-heading" className="sr-only">
          Filters
        </h2>
        <div className="relative col-start-1 row-start-1 pb-8">
          <div className="mx-auto flex max-w-7xl space-x-6 divide-x divide-gray-300 text-sm">
            <div>
              <Disclosure.Button className="group flex items-center font-medium dark:text-neutral-500">
                <Filter className="mr-2 h-5 w-5 flex-none dark:text-gray-300 " aria-hidden="true" />
                {fitlerCount} Filters
              </Disclosure.Button>
            </div>
            <div className="pl-6">
              <button onClick={() => [setClear(true)]} type="button" className="dark:text-gray-300">
                Clear all
              </button>
            </div>
          </div>
        </div>
        <Disclosure.Panel className="border-t border-gray-200 py-10">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-4 px-4 text-sm">
            <div className="grid auto-rows-min grid-cols-1 gap-y-10 md:grid-cols-2 md:gap-x-6">
              <fieldset>
                <legend className="block font-medium">Parallel</legend>
                <div className="space-y-6 pt-6 sm:space-y-4 sm:pt-4">
                  {filters.parallel.map((option, optionIdx) => (
                    <div key={option.value} className="flex items-center text-base sm:text-sm">
                      <input
                        id={`parallel-${optionIdx}`}
                        name="parallel[]"
                        defaultValue={option.value}
                        type="checkbox"
                        className={clsx(
                          option.checked ? 'text-lime-500' : 'bg-neutral-200 dark:bg-neutral-500',
                          'h-4 w-4 flex-shrink-0 rounded border-0 outline-none  ring-current  focus:ring-0 focus:ring-offset-0  focus-visible:ring-4 focus-visible:ring-blue-500',
                        )}
                        checked={option.checked}
                        defaultChecked={option.checked}
                        onChange={(event) =>
                          handleCheckedChange(event, 'parallel', optionIdx, option.value)
                        }
                      />
                      <label
                        htmlFor={`parallel-${optionIdx}`}
                        className="ml-3 min-w-0 flex-1 text-neutral-500 dark:text-neutral-400"
                      >
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
              </fieldset>
              <fieldset>
                <legend className="block font-medium">Rarity</legend>
                <div className="space-y-6 pt-6 sm:space-y-4 sm:pt-4 ">
                  {filters.rarity.map((option, optionIdx) => (
                    <div key={option.value} className="flex items-center text-base sm:text-sm">
                      <input
                        id={`rarity-${optionIdx}`}
                        name="rarity[]"
                        defaultValue={option.value}
                        type="checkbox"
                        className={clsx(
                          option.checked ? 'text-lime-500' : 'bg-neutral-200 dark:bg-neutral-500',
                          'h-4 w-4 flex-shrink-0 rounded border-0 outline-none  ring-current  focus:ring-0 focus:ring-offset-0  focus-visible:ring-4 focus-visible:ring-blue-500',
                        )}
                        checked={option.checked}
                        defaultChecked={option.checked}
                        onChange={(event) =>
                          handleCheckedChange(event, 'rarity', optionIdx, option.value)
                        }
                      />
                      <label
                        htmlFor={`rarity-${optionIdx}`}
                        className="ml-3 min-w-0 flex-1 text-neutral-500 dark:text-neutral-400"
                      >
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
              </fieldset>
            </div>
            <div className="grid auto-rows-min grid-cols-1 gap-y-10  md:grid-cols-2 md:gap-x-6">
              <fieldset>
                <legend className="block font-medium">Type</legend>
                <div className="space-y-6 pt-6 sm:space-y-4 sm:pt-4">
                  {filters.type.map((option, optionIdx) => (
                    <div key={option.value} className="flex items-center text-base sm:text-sm">
                      <input
                        id={`type-${optionIdx}`}
                        name="type[]"
                        defaultValue={option.value}
                        type="checkbox"
                        className={clsx(
                          option.checked ? 'text-lime-500' : 'bg-neutral-200 dark:bg-neutral-500',
                          'h-4 w-4 flex-shrink-0 rounded border-0 outline-none  ring-current  focus:ring-0 focus:ring-offset-0  focus-visible:ring-4 focus-visible:ring-blue-500',
                        )}
                        checked={option.checked}
                        defaultChecked={option.checked}
                        onChange={(event) =>
                          handleCheckedChange(event, 'type', optionIdx, option.value)
                        }
                      />
                      <label
                        htmlFor={`type-${optionIdx}`}
                        className="ml-3 min-w-0 flex-1 text-neutral-500 dark:text-neutral-400"
                      >
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
                <legend className="block pt-4 font-medium">Sub Type</legend>
                <div className="space-y-6 pt-6 sm:space-y-4 sm:pt-4">
                  {filters.subType.map((option, optionIdx) => (
                    <div key={option.value} className="flex items-center text-base sm:text-sm">
                      <input
                        id={`subType-${optionIdx}`}
                        name="subType[]"
                        defaultValue={option.value}
                        type="checkbox"
                        className={clsx(
                          option.checked ? 'text-lime-400' : 'bg-neutral-200 dark:bg-neutral-500',
                          'h-4 w-4 flex-shrink-0 rounded border-0 outline-none  ring-current  focus:ring-0 focus:ring-offset-0  focus-visible:ring-4 focus-visible:ring-blue-500',
                        )}
                        checked={option.checked}
                        defaultChecked={option.checked}
                        onChange={(event) =>
                          handleCheckedChange(event, 'subType', optionIdx, option.value)
                        }
                      />
                      <label
                        htmlFor={`subType-${optionIdx}`}
                        className="ml-3 min-w-0 flex-1 text-neutral-500 dark:text-neutral-400"
                      >
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
              </fieldset>
              <fieldset>
                <legend className="block font-medium">Energy</legend>
                <div className="space-y-6 pt-6 sm:space-y-4 sm:pt-4">
                  {filters.energy.map((option, optionIdx) => (
                    <div key={option.value} className="flex items-center text-base sm:text-sm">
                      <input
                        id={`energy-${optionIdx}`}
                        name="energy[]"
                        defaultValue={option.value}
                        type="checkbox"
                        className={clsx(
                          option.checked ? 'text-lime-500' : 'bg-neutral-200 dark:bg-neutral-500',
                          'h-4 w-4 flex-shrink-0 rounded border-0 outline-none  ring-current  focus:ring-0 focus:ring-offset-0  focus-visible:ring-4 focus-visible:ring-blue-500',
                        )}
                        checked={option.checked}
                        defaultChecked={option.checked}
                        onChange={(event) =>
                          handleCheckedChange(event, 'energy', optionIdx, option.value)
                        }
                      />
                      <label
                        htmlFor={`energy-${optionIdx}`}
                        className="ml-3 min-w-0 flex-1 text-neutral-500 dark:text-neutral-400"
                      >
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
              </fieldset>
            </div>
          </div>
        </Disclosure.Panel>
        <div className="col-start-1 row-start-1 pb-6">
          <div className="mx-auto flex max-w-7xl justify-end">
            <Menu as="div" className="relative inline-block">
              <div className="flex">
                <Menu.Button className="group inline-flex justify-center text-sm font-medium hover:text-gray-900 dark:text-gray-300">
                  Sort
                  <ChevronDown
                    className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                    aria-hidden="true"
                  />
                </Menu.Button>
              </div>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-neutral-700">
                  <div className="py-1">
                    {sortOptions.map((option) => (
                      <Menu.Item key={option.name}>
                        <a
                          onClick={() => setSortOption(option.name)}
                          href={option.href}
                          className={clsx(
                            option.current ? 'font-medium text-gray-900' : 'dark:text-gray-200',
                            sortOption === option.name ? 'bg-lime-400' : '',
                            'block px-4 py-2 text-sm',
                          )}
                        >
                          {option.name}
                        </a>
                      </Menu.Item>
                    ))}
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </Disclosure>
    </div>
  );
};
