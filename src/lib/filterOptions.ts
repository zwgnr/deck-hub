export interface FilterOptions {
  parallel: { value: string; label: string; checked: boolean }[];
  rarity: { value: string; label: string; checked: boolean }[];
  type: { value: string; label: string; checked: boolean }[];
  subType: { value: string; label: string; checked: boolean }[];
  energy: { value: string; label: string; checked: boolean }[];
}

export const filterOptions: FilterOptions = {
  parallel: [
    { value: "Augencore", label: "Augencore", checked: false },
    { value: "Earthen", label: "Earthen", checked: false },
    { value: "Kathari", label: "Kathari", checked: false },
    { value: "Marcolian", label: "Marcolian", checked: false },
    { value: "Shroud", label: "Shroud", checked: false },
    { value: "Universal", label: "Universal", checked: false },
  ],
  rarity: [
    { value: "Common", label: "Common", checked: false },
    { value: "Uncommon", label: "Uncommon", checked: false },
    { value: "Rare", label: "Rare", checked: false },
    { value: "Legendary", label: "Legendary", checked: false },
    { value: "Prime", label: "Prime", checked: false },
  ],
  type: [
    { value: "Effect", label: "Effect", checked: false },
    { value: "Relic", label: "Relic", checked: false },
    { value: "Upgrade", label: "Upgrade", checked: false },
    { value: "Unit", label: "Unit", checked: false },
  ],
  subType: [
    { value: "Clone", label: "Clone", checked: false },
    { value: "Vehicle", label: "Vehicle", checked: false },
  ],
  energy: [
    { value: "0", label: "0 Energy", checked: false },
    { value: "1", label: "1 Energy", checked: false },
    { value: "2", label: "2 Energy", checked: false },
    { value: "3", label: "3 Energy", checked: false },
    { value: "4", label: "4 Energy", checked: false },
    { value: "5", label: "5 Energy", checked: false },
    { value: "6", label: "6 Energy", checked: false },
    { value: "7", label: "7 Energy", checked: false },
    { value: "8", label: "8 Energy", checked: false },
    { value: "9", label: "9 Energy", checked: false },
    { value: "10", label: "10 Energy", checked: false },
  ],
};
