import { ChevronsUp, Shield, ShieldCheck } from 'lucide-react';

export const handleCardIcon = (skill: string) => {
  if (skill?.includes('*Shielded*')) {
    return <ShieldCheck className="h-6 w-6" />;
  }
  if (skill?.includes('*Defender*')) {
    return <Shield className="h-6 w-6" />;
  }

  if (skill?.includes('*Muster*')) {
    return <ChevronsUp className="h-6 w-6" />;
  }
  return null;
};
