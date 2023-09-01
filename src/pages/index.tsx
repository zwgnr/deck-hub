import Head from 'next/head';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { request, gql } from 'graphql-request';

import { CardList } from '~/components/cardList';
import { MyDeck } from '~/components/myDeck';
import { ParallelPicker } from '~/components/parallelPicker';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { deckAtom, isMobile, paragonAtom, parallelChoiceAtom } from '~/lib/atoms';

import type { Cards, Paragons } from '~/types/sharedTypes';
import { DeckImport } from '~/components/DeckImport';
import { Footer } from '~/components/Footer';
import { Moon, RotateCcw, Sun, Upload } from 'lucide-react';

export const getStaticProps = async () => {
  const definedEndpoint = 'https://api.defined.fi';
  const definedAPIKey = process.env.DEFINED ?? '';

  const definedHeaders = {
    'Content-Type': 'application/json',
    'x-api-key': definedAPIKey,
  };

  const cardCollectionQuery = gql`
    {
      filterNftParallelAssets(
        limit: 2000
        match: { class: [FE], rarity: [Common, Uncommon, Rare, Legendary] }
      ) {
        count
        results {
          tokenId
          name
          lastPriceNetworkBaseToken
          media {
            image
            thumbSm
            thumbLg
          }
          gameData {
            parallel
            rarity
            cost
            attack
            health
            cardType
            subtype
            functionText
            passiveAbility
          }
        }
      }
    }
  `;

  const paragonsQuery = gql`
    {
      filterNftParallelAssets(limit: 20, match: { cardType: Paragon }) {
        count
        results {
          tokenId
          name
          media {
            image
            thumbSm
            thumbLg
          }
          gameData {
            parallel
            rarity
            cost
            attack
            health
            cardType
            subtype
            functionText
            passiveAbility
          }
        }
      }
    }
  `;

  interface DefinedCards {
    filterNftParallelAssets: {
      results: {
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
      }[];
    };
  }

  const getCollection = await request<DefinedCards>({
    url: definedEndpoint,
    document: cardCollectionQuery,
    requestHeaders: definedHeaders,
  });

  interface DefinedParagons {
    filterNftParallelAssets: {
      results: {
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
    };
  }

  const getParagons = await request<DefinedParagons>({
    url: definedEndpoint,
    document: paragonsQuery,
    requestHeaders: definedHeaders,
  });

  const paragons = getParagons.filterNftParallelAssets.results;

  const collection = getCollection.filterNftParallelAssets.results;

  interface ParallelCards {
    cards: {
      created_at: string | null;
      updated_at: string | null;
      deleted_at: string | null;
      id: number;
      token_id: number | null; // updated to be nullable
      modifiers: null;
      title: string | null;
      name: string | null;
      description: string | null;
      function_text: string | null;
      flavour_text: string | null;
      parallel: string | null;
      states: null;
      image_url: string | null;
      contract_addr: number | null;
      animation_url: string | null;
      rarity: string | null;
      slug: string | null;
      card_class: string | null;
      is_playable: boolean;
      is_signed: boolean;
      basename: string | null;
      design_id: string | null;
      cost: number | null;
      attack: number | null;
      expansion: string | null;
      type: string | null;
      subtype: string | null | undefined;
      base_card_id: number;
      is_apparition: boolean;
    }[];
  }

  const parallelUrl = 'https://parallel.life/api/pgs/api/v1/cards/';
  const parallelResponse = await fetch(parallelUrl);
  const parallelResult = (await parallelResponse.json()) as ParallelCards;

  const parallelData = parallelResult.cards;

  // find matching design_id from parallel api and add it to defined array

  const cardData = collection.map((item: { tokenId: string }) => {
    const matchingObject = parallelData.find(
      (obj: { token_id: number | null }) => obj.token_id === parseInt(item.tokenId, 10),
    );
    const designId = matchingObject?.design_id ?? null;
    return {
      ...item,
      id: designId,
    };
  });

  const paragonData = paragons.map((item: { tokenId: string }) => {
    const matchingObject = parallelData.find(
      (obj: { token_id: number | null }) => obj.token_id === parseInt(item.tokenId, 10),
    );
    const designId = matchingObject ? matchingObject.design_id : null;
    return {
      ...item,
      id: designId,
    };
  });

  return {
    props: { cards: cardData, paragons: paragonData },
  };
};

export interface HomeProps {
  cards: Cards;
  paragons: Paragons;
}

export const Home = (props: HomeProps) => {
  const { cards, paragons } = props;

  const { theme, setTheme } = useTheme();

  const [parallelChoice, setParallelChoice] = useAtom(parallelChoiceAtom);
  const setActiveParagon = useSetAtom(paragonAtom);
  const setDeck = useSetAtom(deckAtom);
  const mobile = useAtomValue(isMobile);
  const [openImport, setOpenImport] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const handleStartOver = () => {
    setParallelChoice('');
    setActiveParagon({
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
    setDeck([]);
  };

  return (
    <>
      <Head>
        <title>Deck Hub</title>
        <meta name="description" content="Deck Hub, a Parallel Deck Builder" />
        <link rel="icon" href="/images/dhLogo.png" />
        <link
          rel="preload"
          href="/fonts/poppins.woff2"
          as="font"
          crossOrigin="anonymous"
          type="font/woff2"
        />
      </Head>
      <main className=" flex h-screen min-h-screen min-w-full flex-col items-center overflow-hidden bg-surface">
        <div className="flex h-16 w-full items-center justify-start border-b-2 border-border p-4">
          <h1 className="text-3xl font-bold tracking-tight">
            Deck
            <span className="text-primary">Hub</span>
          </h1>

          <div className="absolute right-8 flex gap-4">
            <DeckImport
              openImport={openImport}
              setOpenImport={setOpenImport}
              cards={cards}
              paragons={paragons}
            />
            <button
              onClick={handleStartOver}
              title="Start Over"
              className="rounded-lg bg-secondary p-2 text-secondary-fg hover:bg-secondary/60 sm:block"
              type="button"
            >
              <RotateCcw className="h-6 w-6" />
            </button>
            {!mobile ? (
              <button
                type="button"
                disabled
                className="rounded-lg bg-lime-100 p-2 text-black sm:block"
              >
                Connect (soon)
              </button>
            ) : null}
            <button
              type="button"
              className="rounded-xl p-1 text-gray-400"
              onClick={() => (theme === 'light' ? setTheme('dark') : setTheme('light'))}
            >
              {hasMounted ? (
                theme === 'light' ? (
                  <Sun className="h-8 w-8" />
                ) : (
                  <Moon className="h-8 w-8" />
                )
              ) : null}
            </button>
          </div>
        </div>
        <div className="flex w-screen flex-col overflow-auto ">
          <div className="flex h-full flex-col  gap-4 p-8 pb-0 xl:flex-row">
            <div className="flex w-full flex-col gap-2 xl:w-3/5 ">
              <MyDeck cards={cards} paragons={paragons} />
            </div>
            <div className="w-full rounded-xl border-2 border-border shadow-lg dark:border-transparent  xl:w-2/5 ">
              {parallelChoice === '' ? <ParallelPicker /> : <CardList cards={cards} />}
            </div>
          </div>
        </div>
        <Footer />
      </main>
    </>
  );
};

export default Home;
