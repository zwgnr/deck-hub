import { Circle, Diamond, Square, Triangle } from 'lucide-react';

export const handleCardType = (cardType: string) => {
  if (cardType === 'Unit') {
    return <Diamond className="h-8 w-8" />;
  }
  if (cardType === 'Relic') {
    return <Circle className="h-8 w-8" />;
  }
  if (cardType === 'Effect') {
    return <Square className="h-8 w-8" />;
  }
  if (cardType === 'Upgrade') {
    return <Triangle className="h-8 w-8" />;
  }
  return null;
};
