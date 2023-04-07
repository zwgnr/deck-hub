import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export const parallelChoiceAtom = atomWithStorage('parallelChoice', '');

export const showStatsAtom = atom(false);

export const showDetailsAtom = atom(true);

export const paragonAtom = atomWithStorage('activeParagon', {
  tokenId: '',
  name: '',
  media: {
    image: '',
    thumbSm: '',
    thumbLg: '',
  },
  gameData: {
    parallel: '',
    rarity: '',
    cost: '',
    attack: '',
    health: '',
    cardType: '',
    subtype: '',
    functionText: '',
    passiveAbility: '',
  },
  id: '',
});

type DeckCard = {
  tokenId: string;
  name: string;
  lastPriceNetworkBaseToken: string;
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

export const deckAtom = atomWithStorage<DeckCard[]>('deck', []);

export const atdSuccessAtom = atom(false);

interface DeckError {
  errorCode: string;
}

export const deckErrorAtom = atom<DeckError>({
  errorCode: '',
});

interface ImportError {
  errorCode: string;
}

export const importErrorAtom = atom<ImportError>({
  errorCode: '',
});

export const isMobile = atom(true);
