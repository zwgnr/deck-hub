export type Card = {
  tokenId: string;
  name: string;
  lastPriceNetworkBaseToken: string;
  lastPriceUsd: string
  media: {
    image: string;
    thumbSm: string;
    thumbLg: string;
  };
  gameData: {
    parallel: string;
    rarity: string;
    cost: string;
    attack: string;
    health: string;
    cardType: string;
    subtype: string;
    functionText: string;
    passiveAbility: string;
  };
  id: string;
};

export type Cards = {
  tokenId: string;
  name: string;
  lastPriceNetworkBaseToken: string;
  lastPriceUsd: string;
  media: {
    image: string;
    thumbSm: string;
    thumbLg: string;
  };
  gameData: {
    parallel: string;
    rarity: string;
    cost: string;
    attack: string;
    health: string;
    cardType: string;
    subtype: string;
    functionText: string;
    passiveAbility: string;
  };
  id: string;
}[];

export type Paragons = {
  tokenId: string;
  name: string;
  media: {
    image: string;
    thumbSm: string;
    thumbLg: string;
  };
  gameData: {
    parallel: string;
    rarity: string;
    cost: string;
    attack: string;
    health: string;
    cardType: string;
    subtype: string;
    functionText: string;
    passiveAbility: string;
  };
  id: string;
}[];
