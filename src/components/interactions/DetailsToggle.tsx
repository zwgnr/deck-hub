import { Switch } from "@headlessui/react";
import clsx from "clsx";
import { useAtom } from "jotai";
import { showDetailsAtom } from "~/lib/atoms";

export const HoverToggle = () => {
  const [hoverEnabled, setHoverEnabled] = useAtom(showDetailsAtom);
  return (
    <Switch.Group as="div" className="flex items-center justify-between">
      <span className="flex flex-grow flex-col">
        <Switch.Label
          as="span"
          className="mr-2 text-sm font-medium text-neutral-600 dark:text-neutral-300"
          passive
        >
          Details
        </Switch.Label>
      </span>
      <Switch
        checked={hoverEnabled}
        onChange={setHoverEnabled}
        className={clsx(
          hoverEnabled ? "bg-lime-400" : "bg-neutral-300 dark:bg-neutral-600",
          "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ease-in-out"
        )}
      >
        <span className="sr-only">Enable Hcver Cards</span>
        <span
          aria-hidden="true"
          className={clsx(
            hoverEnabled ? "translate-x-6" : "translate-x-1",
            "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
          )}
        />
      </Switch>
    </Switch.Group>
  );
};
