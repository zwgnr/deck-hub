import { Icon } from '@iconify/react';

export const handleCardType = (cardType: string) => {
  if (cardType === 'Unit') {
    return <Icon icon="tabler:square-rotated" className="h-8 w-8" />;
  }
  if (cardType === 'Relic') {
    return <Icon icon="material-symbols:circle-outline" className="h-8 w-8" />;
  }
  if (cardType === 'Effect') {
    return <Icon icon="material-symbols:square-outline" className="h-8 w-8" />;
  }
  if (cardType === 'Upgrade') {
    return <Icon icon="ph:triangle-bold" className="h-8 w-8" />;
  }
  return null;
};
