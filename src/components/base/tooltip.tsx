import type { ReactNode } from 'react';

import {
  Tooltip as AriaTooltip,
  TooltipTrigger as AriaTooltipTrigger,
  type TooltipProps as AriaTooltipProps,
} from 'react-aria-components';

import { tv } from 'tailwind-variants';

const tooltip = tv({
  base: 'm-1 lg:max-w-lg rounded-md max-w-sm bg-surface p-2 text-fg shadow-xl outline-none [&[data-entering]]:animate-fade [&[data-exiting]]:animate-fadeOut',
});

const TooltipTrigger = AriaTooltipTrigger;

interface TooltipProps extends Omit<AriaTooltipProps, 'children'> {
  className?: string;
  children: ReactNode;
}

const Tooltip = ({ children, className, ...props }: TooltipProps) => (
  <AriaTooltip className={tooltip({ className })} {...props}>
    {children}
  </AriaTooltip>
);

export { Tooltip, TooltipTrigger };
