import { Icon } from "@iconify/react";

export const handleCardIcon = (skill: string) => {
  //console.log(skill);

  if (skill?.includes("*Shielded*")) {
    return (
      <Icon
        icon="material-symbols:health-and-safety-outline"
        className="h-6 w-6"
      />
    );
  }
  if (skill?.includes("*Defender*")) {
    return <Icon icon="ic:outline-shield" className="h-6 w-6" />;
  }

  if (skill?.includes("*Muster*")) {
    return (
      <Icon
        icon="material-symbols:keyboard-double-arrow-up"
        className="h-6 w-6"
      />
    );
  }
};
