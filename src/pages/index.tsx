import Head from "next/head";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { request, gql } from "graphql-request";
import { Icon } from "@iconify/react";

import { CardList } from "~/components/cardList";
import { MyDeck } from "~/components/myDeck";
import { ParallelPicker } from "~/components/parallelPicker";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  deckAtom,
  isMobile,
  paragonAtom,
  parallelChoiceAtom,
} from "~/lib/atoms";

import type { Cards, Paragons } from "~/types/sharedTypes";
import DeckImport from "~/components/DeckImport";

export const getStaticProps = async () => {
  const definedEndpoint = "https://api.defined.fi";
  const definedAPIKey = process.env.DEFINED!;

  const definedHeaders = {
    "Content-Type": "application/json",
    "x-api-key": definedAPIKey,
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

  const getCollection = await request({
    url: definedEndpoint,
    document: cardCollectionQuery,
    requestHeaders: definedHeaders,
  });

  const getParagons = await request({
    url: definedEndpoint,
    document: paragonsQuery,
    requestHeaders: definedHeaders,
  });

  const paragons = await getParagons.filterNftParallelAssets.results;

  const collection = await getCollection.filterNftParallelAssets.results;

  const parallelUrl = "https://parallel.life/api/pgs/api/v1/cards/";
  const parallelResponse = await fetch(parallelUrl);
  const parallelResult = await parallelResponse.json();
  const parallelData = await parallelResult.cards;

  //find matching design_id from parallel api and add it to defined array
  const cardData = collection.map((item: { tokenId: string }) => {
    const matchingObject = parallelData.find(
      (obj: { token_id: number }) => obj.token_id === parseInt(item.tokenId)
    );
    const designId = matchingObject ? matchingObject.design_id : null;
    return {
      ...item,
      id: designId,
    };
  });

  const paragonData = paragons.map((item: { tokenId: string }) => {
    const matchingObject = parallelData.find(
      (obj: { token_id: number }) => obj.token_id === parseInt(item.tokenId)
    );
    const designId = matchingObject ? matchingObject.design_id : null;
    return {
      ...item,
      id: designId,
    };
  });

  return {
    props: { cards: cardData, paragons: paragonData }, // will be passed to the page component as props
  };
};

export interface HomeProps {
  cards: Cards;
  paragons: Paragons;
}

const Home = (props: HomeProps) => {
  const { cards, paragons } = props;

  const { theme, setTheme } = useTheme();

  const [parallelChoice, setParallelChoice] = useAtom(parallelChoiceAtom);
  const [activeParagon, setActiveParagon] = useAtom(paragonAtom);
  const setDeck = useSetAtom(deckAtom);

  const [openImport, setOpenImport] = useState(false);

  const twitter = <Icon icon="mdi:twitter" className="h-6 w-6" />;

  const Footer = () => {
    return (
      <div className="flex h-16 w-full flex-row items-center justify-between divide-neutral-500  px-8  text-neutral-400">
        <div className="flex h-full flex-row items-center divide-x-2 p-2">
          <a
            title="https://twitter.com/zwagnr"
            href="https://twitter.com/zwagnr"
            target="_blank"
            rel="noopener noreferrer"
            className="text-lime-400"
          >
            {twitter}
          </a>
          <a
            href="https://etherscan.io/address/0x5e19dafC53f8C6Be0797Ed6c252A92E53cb75860"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-1"
          >
            <p className="ml-2">Donate</p>
          </a>
        </div>
        <div className="flex">
          <p className="text-xs">
            *Not affiliated with Parallel Studios or EchelonFND
          </p>
        </div>
      </div>
    );
  };

  const handleStartOver = () => {
    setParallelChoice("");
    setActiveParagon({
      tokenId: "",
      name: "",
      media: {
        image: "",
        thumbSm: "",
        thumbLg: "",
      },
      gameData: {
        parallel: "",
        rarity: "",
        cost: "",
        attack: "",
        health: "",
        cardType: "",
        subtype: "",
        functionText: "",
        passiveAbility: "",
      },
      id: "",
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
      <main className=" flex h-screen min-h-screen min-w-full flex-col items-center overflow-hidden bg-neutral-100 dark:bg-neutral-900">
        <div className="flex h-16 w-full items-center justify-start border-b-2  p-4 dark:border-neutral-800">
          <h1 className="text-3xl font-bold tracking-tight dark:text-white">
            Deck <span className="text-lime-400 ">Hub</span>
          </h1>
          <DeckImport
            openImport={openImport}
            setOpenImport={setOpenImport}
            cards={cards}
            paragons={paragons}
          />
          <div className="absolute right-8 flex gap-4">
            <button
              onClick={() => setOpenImport(true)}
              title="Import Deck"
              className="rounded-lg bg-neutral-400 p-2 text-black sm:block"
            >
              <Icon icon="tabler:package-import" className="h-6 w-6" />
            </button>
            <button
              onClick={handleStartOver}
              title="Start Over"
              className="rounded-lg bg-neutral-400 p-2 text-black sm:block"
            >
              <Icon icon="material-symbols:device-reset" className="h-6 w-6" />
            </button>
            <button
              disabled
              className="rounded-lg bg-lime-100 p-2 text-black sm:block"
            >
              Connect (soon)
            </button>
            <button
              type="button"
              className="rounded-xl p-1 text-gray-400"
              onClick={() =>
                theme === "light" ? setTheme("dark") : setTheme("light")
              }
            >
              <span className="sr-only">Theme Mode</span>
              {theme === "light" ? (
                <Icon icon="ph:sun-bold" className="h-8 w-8" />
              ) : (
                <Icon icon="ph:moon-bold" className="h-8 w-8" />
              )}
            </button>
          </div>
        </div>

        <>
          <div className="flex w-screen flex-col overflow-auto ">
            <div className="flex h-full flex-col  gap-4 p-8 pb-0 xl:flex-row">
              <div className="flex w-full flex-col gap-2 xl:w-3/5 ">
                <MyDeck cards={cards} paragons={paragons} />
              </div>
              <div className="w-full rounded-xl border-2 border-neutral-300 bg-white shadow-lg dark:border-transparent dark:bg-neutral-800  xl:w-2/5 ">
                {parallelChoice === "" ? (
                  <ParallelPicker />
                ) : (
                  <CardList cards={cards} />
                )}
              </div>
            </div>
          </div>
          <Footer />
        </>
      </main>
    </>
  );
};

export default Home;
