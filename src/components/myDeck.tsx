import Image from "next/image";
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import clsx from "clsx";
import * as HoverCardPrimitive from "@radix-ui/react-hover-card";
import * as Popover from "@radix-ui/react-popover";

import { useAtom, useAtomValue } from "jotai";

import { EnergyChart } from "./energyChart";
import { TypeChart } from "./typeChart";

import { handleCardType } from "../lib/handleCardType";
import { handleCardIcon } from "~/lib/handleCardIcon";
import { formatText } from "~/lib/formatCardText";

import { useCopyToClipboard } from "~/hooks/useCopyToClipboard";
import { CopyAlert } from "./CopyAlert";
import { StatsToggle } from "./interactions/StatsToggle";
import { HoverToggle } from "./interactions/DetailsToggle";

import {
  deckAtom,
  deckErrorAtom,
  isDesktop,
  paragonAtom,
  parallelChoiceAtom,
  showDetailsAtom,
  showStatsAtom,
} from "~/lib/atoms";

import type { Card, Cards, Paragons } from "~/types/sharedTypes";
import { AddToDeckErrorMessage } from "./ATDErrorMessage";
import { ImportErrorMessage } from "./ImportErrorMessage";

export interface DeckProps {
  cards: Cards;
  paragons: Paragons;
}

export const MyDeck = (props: DeckProps) => {
  const { cards, paragons } = props;

  const parallelChoice = useAtomValue(parallelChoiceAtom);
  const [activeParagon, setActiveParagon] = useAtom(paragonAtom);
  const [deck, setDeck] = useAtom(deckAtom);
  const statsEnabled = useAtomValue(showStatsAtom);
  const hoverEnabled = useAtomValue(showDetailsAtom);
  const [deckError, setDeckError] = useAtom(deckErrorAtom);
  const [desktop, setDesktop] = useAtom(isDesktop);

  const [cardInfo, setCardInfo] = useState(cards[0]);
  const [deckCode, setDeckCode] = useState("");
  const [showAlert, setShowAlert] = useState<boolean>(false);

  const { copyToClipboard } = useCopyToClipboard();

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth > 768) {
        setDesktop(true);
      } else {
        setDesktop(false);
      }
    }
    // Check if running on the client-side before accessing the window object
    if (typeof window !== "undefined") {
      handleResize();
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);

  //setDefaultParagon

  useEffect(() => {
    const getDefaultParagon = () => {
      switch (parallelChoice) {
        case "Augencore":
          let aug = paragons.filter(
            (paragon) => paragon.gameData.parallel === "Augencore"
          );
          return aug[0];
        case "Earthen":
          let earthen = paragons.filter(
            (paragon) => paragon.gameData.parallel === "Earthen"
          );
          return earthen[0];
        case "Kathari":
          let kathari = paragons.filter(
            (paragon) => paragon.gameData.parallel === "Kathari"
          );
          return kathari[0];
        case "Marcolian":
          let marcolian = paragons.filter(
            (paragon) => paragon.gameData.parallel === "Marcolian"
          );
          return marcolian[0];
        case "Shroud":
          let shroud = paragons.filter(
            (paragon) => paragon.gameData.parallel === "Shroud"
          );
          return shroud[0];
        default:
          break;
      }
    };
    const newActiveParagon = getDefaultParagon();
    if (activeParagon?.name === "") {
      const newActiveParagon = getDefaultParagon();
      if (newActiveParagon && newActiveParagon.name !== activeParagon.name) {
        setActiveParagon(newActiveParagon);
      }
    } else if (parallelChoice === "") {
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
    }
  }, [parallelChoice]);

  //remove cards with cost > 5 from deck if Niamh is set as active Paragon
  useEffect(() => {
    if (activeParagon?.tokenId === "10929") {
      const filteredDeck = deck.filter(
        (card) => Number(card.gameData.cost) <= 5
      );
      setDeck(filteredDeck);
    }
  }, [activeParagon]);

  //set deck code
  useEffect(() => {
    let codeIds = deck.map((card) => card.id);
    // Accumulate counts of each item
    const counts = codeIds.reduce(
      (acc: { [x: string]: number }, item: string) => {
        if (item in acc) {
          acc[item]++;
        } else {
          acc[item] = 1;
        }
        return acc;
      },
      {}
    );

    // Convert counts to formatted strings
    const formattedItems = Object.entries(counts)
      .map(([item, count]) => (count === 1 ? item : `${count}X${item}`))
      .join(",");

    setDeckCode(`${activeParagon?.id},${formattedItems}`);
  }, [deck, activeParagon]);

  // map placeholder cards
  let placeHolderCards = [];

  if (deck.length === 0) {
    for (let i = 1; i <= 40; i++) {
      placeHolderCards.push(i);
    }
  } else {
    for (let i = 1; i <= 40 - deck.length; i++) {
      placeHolderCards.push(i);
    }
  }

  const handleParagonChange = (direction: string) => {
    switch (parallelChoice) {
      case "Augencore":
        let aug = paragons.filter(
          (paragon) => paragon.gameData.parallel === "Augencore"
        );
        let index = aug.findIndex((p) => p.tokenId === activeParagon?.tokenId);
        if (direction === "right") {
          if (index !== aug.length - 1) {
            setActiveParagon(aug[index + 1]!);
          }
        }
        if (direction === "left") {
          if (index !== 0) {
            setActiveParagon(aug[index - 1]!);
          }
        }
        break;
      case "Earthen":
        let earthen = paragons.filter(
          (paragon) => paragon.gameData.parallel === "Earthen"
        );
        let earthenIndex = earthen.findIndex(
          (p) => p.tokenId === activeParagon?.tokenId
        );
        if (direction === "right") {
          if (earthenIndex !== earthen.length - 1) {
            setActiveParagon(earthen[earthenIndex + 1]!);
          }
        }
        if (direction === "left") {
          if (earthenIndex !== 0) {
            setActiveParagon(earthen[earthenIndex - 1]!);
          }
        }
        break;
      case "Kathari":
        let kathari = paragons.filter(
          (paragon) => paragon.gameData.parallel === "Kathari"
        );
        let kathariIndex = kathari.findIndex(
          (p) => p.tokenId === activeParagon?.tokenId
        );
        if (direction === "right") {
          if (kathariIndex !== kathari.length - 1) {
            setActiveParagon(kathari[kathariIndex + 1]!);
          }
        }
        if (direction === "left") {
          if (kathariIndex !== 0) {
            setActiveParagon(kathari[kathariIndex - 1]!);
          }
        }
        break;
      case "Marcolian":
        let marcolian = paragons.filter(
          (paragon) => paragon.gameData.parallel === "Marcolian"
        );
        let marcolianIndex = marcolian.findIndex(
          (p) => p.tokenId === activeParagon?.tokenId
        );
        if (direction === "right") {
          if (marcolianIndex !== marcolian.length - 1) {
            setActiveParagon(marcolian[marcolianIndex + 1]!);
          }
        }
        if (direction === "left") {
          if (marcolianIndex !== 0) {
            setActiveParagon(marcolian[marcolianIndex - 1]!);
          }
        }
        break;
      case "Shroud":
        let shroud = paragons.filter(
          (paragon) => paragon.gameData.parallel === "Shroud"
        );
        let shroudIndex = shroud.findIndex(
          (p) => p.tokenId === activeParagon?.tokenId
        );
        if (direction === "right") {
          if (shroudIndex !== shroud.length - 1) {
            setActiveParagon(shroud[shroudIndex + 1]!);
          }
        }
        if (direction === "left") {
          if (shroudIndex !== 0) {
            setActiveParagon(shroud[shroudIndex - 1]!);
          }
        }
        break;
      default:
        break;
    }
  };

  function addOne(card: Card) {
    if (deck.length < 40) {
      //find position in deck of card in order to place copies next to it
      const index = deck.findIndex((item) => item.tokenId === card.tokenId);
      //get total amount of specifc card in a active deck
      const count = deck.filter((d) => d.tokenId === card.tokenId).length;
      //legendary card check with max limit of 1
      if (card.gameData.rarity === "Legendary") {
        if (count < 1) {
          setDeck((prevDeck) => {
            const newDeck = [...prevDeck];
            newDeck.splice(index + 1, 0, card);
            return newDeck;
          });
        } else {
          // handle error message if user tries to add more than 1 legendary
          setDeckError((prevState) => ({
            ...prevState,
            errorCode: "legendaryLimit",
          }));
          setTimeout(() => {
            setDeckError((prevState) => ({
              ...prevState,
              errorCode: "",
            }));
          }, 4000);
        }
      } else if (card.gameData.rarity !== "Legendary") {
        if (count < 3) {
          setDeck((prevDeck) => {
            const newDeck = [...prevDeck];
            newDeck.splice(index + 1, 0, card);
            return newDeck;
          });
        } else {
          setDeckError((prevState) => ({
            ...prevState,
            errorCode: "max3",
          }));
          setTimeout(() => {
            setDeckError((prevState) => ({
              ...prevState,
              errorCode: "",
            }));
          }, 4000);
        }
      }
    } else {
      // handle error message if deck hits card limit
      setDeckError((prevState) => ({
        ...prevState,
        errorCode: "over40",
      }));
      setTimeout(() => {
        setDeckError((prevState) => ({
          ...prevState,
          errorCode: "",
        }));
      }, 4000);
    }
  }

  function removeOne(index: number) {
    setDeck((prevDeck) => prevDeck.filter((_, i) => i !== index));
  }

  const sortedCards = deck.sort(
    (a, b) => Number(a.gameData.cost) - Number(b.gameData.cost)
  );

  function handlePassiveText(text: string) {
    const modifiedString = text?.replace(/\n/g, " ");
    const result = modifiedString?.split(" ");

    function handleWordStyles(arr: string[], tag: string | null) {
      const formatted = arr.map((word, index) => {
        // Regular expression to match pattern "*word*" || "*Battle" "Ready*"
        const pattern = /\*(Battle.*?)|(.*?Ready\*)|\*(.*?)\*/g;
        if (word.match(pattern)) {
          const formattedWord = word.replace(/\*/g, ""); // Remove asterisks
          return <span className="italic text-lime-400">{formattedWord} </span>; // Wrap in <span> tags to make it red and italic
        } else if (
          word === "*" &&
          arr[index - 1] !== "*" &&
          arr[index + 1] !== "*"
        ) {
          return (
            <>
              <br key={index} />
              <br key={index++} />
            </>
          ); // Replace single asterisk with a <br> tag
        } else {
          return <span key={index}>{word} </span>;
        }
      });
      //console.log(activeParagon?.tokenId)
      return (
        <div className="flex flex-col gap-2 pt-1 pb-4">
          <p>
            {tag === null ? null : tag === "Muster:" ? (
              <span className="text-md mr-1 w-fit rounded-md bg-slate-800 p-1 font-bold ">
                {tag}
              </span>
            ) : (
              <span className="italic text-lime-400">{tag} </span>
            )}
            {formatted}
          </p>
        </div>
      );
    }

    function handlePassive(arr: string[]) {
      let passive = [...arr];
      passive.shift(); //since muster was the first word, now remove it from array
      return handleWordStyles(passive, "Passive:");
    }

    if (result[0] === "*Passive*:") {
      return handlePassive(result);
    }
  }

  const Paragon = () => {
    const getDefaultParagon = () => {
      switch (parallelChoice) {
        case "Augencore":
          let aug = paragons.filter(
            (paragon) => paragon.gameData.parallel === "Augencore"
          );
          return aug[0];
        case "Earthen":
          let earthen = paragons.filter(
            (paragon) => paragon.gameData.parallel === "Earthen"
          );
          return earthen[0];
        case "Kathari":
          let kathari = paragons.filter(
            (paragon) => paragon.gameData.parallel === "Kathari"
          );
          return kathari[0];
        case "Marcolian":
          let marcolian = paragons.filter(
            (paragon) => paragon.gameData.parallel === "Marcolian"
          );
          return marcolian[0];
        case "Shroud":
          let shroud = paragons.filter(
            (paragon) => paragon.gameData.parallel === "Shroud"
          );
          return shroud[0];
        default:
          break;
      }
      setActiveParagon(getDefaultParagon()!);
    };
    return (
      <Image
        src={activeParagon?.media.image!}
        alt="Paragon"
        fill
        style={{ objectFit: "contain" }}
        id="1"
      />
    );
  };

  return (
    <div className="flex h-full w-full flex-col gap-8 rounded-xl border-2 border-neutral-300 bg-white py-0 pl-0 shadow-lg dark:border-transparent dark:bg-neutral-800 xl:flex-row xl:gap-0 xl:py-8 xl:pl-8 ">
      <AddToDeckErrorMessage />
      <ImportErrorMessage />
      <CopyAlert
        text={deckCode}
        showAlert={showAlert}
        setShowAlert={setShowAlert}
      />
      <div className=" flex h-fit w-full flex-col items-start justify-center overflow-hidden rounded-xl border-2 dark:border-transparent dark:bg-neutral-900 xl:h-full xl:w-2/6 ">
        <div className="flex w-full justify-center p-2">
          <p className="text-lg font-bold">Paragon</p>
        </div>

        <div className="flex h-56 w-full overflow-hidden  xl:h-2/5">
          {desktop ? (
            <HoverCardPrimitive.Root openDelay={0} closeDelay={0}>
              <div className="relative flex h-full w-full">
                <HoverCardPrimitive.Trigger asChild>
                  {parallelChoice === "" ? (
                    <Image
                      src={"/images/placeholder.png"}
                      alt="card"
                      fill
                      style={{ objectFit: "contain" }}
                      id="1"
                    />
                  ) : (
                    <Image
                      src={activeParagon?.media.image!}
                      alt="Paragon"
                      fill
                      style={{ objectFit: "contain" }}
                      id="1"
                    />
                  )}
                </HoverCardPrimitive.Trigger>
                {activeParagon.id === "" ? null : hoverEnabled ? (
                  <HoverCardPrimitive.Content
                    side="left"
                    align="center"
                    sideOffset={2}
                    className={clsx(
                      "radix-side-top:animate-slide-up radix-side-bottom:animate-slide-down z-50 h-[400px] w-[800px]",
                      " rounded-xl p-4",
                      "bg-neutral-500 shadow-2xl shadow-black dark:bg-gray-800",
                      "focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75"
                    )}
                  >
                    <HoverCardPrimitive.Arrow className="fill-current text-slate-600 dark:text-gray-800" />

                    <div className="flex h-full w-full space-x-4">
                      <div className="flex w-1/3 items-center justify-center py-4">
                        <div className="h-96 w-64 py-2">
                          <Image
                            src={activeParagon?.media.image!}
                            alt="card"
                            className="h-full w-full rounded-md"
                            height={72}
                            width={500}
                            style={{ objectFit: "cover" }}
                          ></Image>
                        </div>
                      </div>
                      <div className="flex flex-col gap-4">
                        <h1 className="text-xl font-medium text-gray-100 dark:text-gray-100">
                          {activeParagon?.name.slice(
                            0,
                            activeParagon?.name.length - 8
                          )}
                        </h1>
                        <h2 className="text-xl font-medium text-gray-100 dark:text-gray-100">
                          {activeParagon?.gameData.cardType}
                        </h2>
                        <p className="p-y overflow-y-auto text-sm font-normal text-gray-100 dark:text-gray-400">
                          {formatText(activeParagon?.gameData.functionText!)}
                        </p>
                        <p className="p-y overflow-y-auto text-sm font-normal text-gray-100 dark:text-gray-400">
                          {handlePassiveText(
                            activeParagon?.gameData.passiveAbility!
                          )}
                        </p>
                        <div>
                          <p className="text-md font-medium text-gray-100 dark:text-gray-100">
                            Energy Cost: {activeParagon?.gameData.cost}
                          </p>
                        </div>
                        <div className="flex flex-row gap-6">
                          <p className="text-md font-medium text-gray-100 dark:text-gray-100">
                            Attack: {activeParagon?.gameData.attack}
                          </p>
                          <p className="text-md font-medium text-gray-100 dark:text-gray-100">
                            Health: {activeParagon?.gameData.health}
                          </p>
                        </div>
                      </div>
                    </div>
                  </HoverCardPrimitive.Content>
                ) : null}
              </div>
            </HoverCardPrimitive.Root>
          ) : (
            <Popover.Root>
              <div className="relative flex h-full w-full">
                <Popover.Trigger asChild>
                  {parallelChoice === "" ? (
                    <Image
                      src={"/images/placeholder.png"}
                      alt="card"
                      fill
                      style={{ objectFit: "contain" }}
                      id="1"
                    />
                  ) : (
                    <Image
                      src={activeParagon?.media.image!}
                      alt="Paragon"
                      fill
                      style={{ objectFit: "contain" }}
                      id="1"
                    />
                  )}
                </Popover.Trigger>
                {activeParagon.id === "" ? null : hoverEnabled ? (
                  <Popover.Content
                    side="bottom"
                    align="center"
                    sideOffset={2}
                    className={clsx(
                      "radix-side-top:animate-slide-up radix-side-bottom:animate-slide-down z-50 h-[400px] w-[400px]",
                      " rounded-xl p-4",
                      "bg-neutral-500 shadow-2xl shadow-black dark:bg-gray-800",
                      "focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75"
                    )}
                  >
                    <Popover.Arrow className="fill-current text-slate-600 dark:text-gray-800" />

                    <div className="flex h-full w-full space-x-4">
                      <div className="flex w-1/2 items-center justify-center py-4">
                        <div className="h-72 w-56 py-2">
                          <Image
                            src={activeParagon?.media.image!}
                            alt="card"
                            className="h-full w-full rounded-md"
                            height={72}
                            width={500}
                            style={{ objectFit: "cover" }}
                          ></Image>
                        </div>
                      </div>
                      <div className="flex flex-col gap-4">
                        <h1 className="text-xl font-medium text-gray-100 dark:text-gray-100">
                          {activeParagon?.name.slice(
                            0,
                            activeParagon?.name.length - 8
                          )}
                        </h1>
                        <h2 className="text-xl font-medium text-gray-100 dark:text-gray-100">
                          {activeParagon?.gameData.cardType}
                        </h2>
                        <p className="p-y overflow-y-auto text-sm font-normal text-gray-100 dark:text-gray-400">
                          {formatText(activeParagon?.gameData.functionText!)}
                        </p>
                        <p className="p-y overflow-y-auto text-sm font-normal text-gray-100 dark:text-gray-400">
                          {handlePassiveText(
                            activeParagon?.gameData.passiveAbility!
                          )}
                        </p>
                        <div>
                          <p className="text-md font-medium text-gray-100 dark:text-gray-100">
                            Energy Cost: {activeParagon?.gameData.cost}
                          </p>
                        </div>
                        <div className="flex flex-row gap-6">
                          <p className="text-md font-medium text-gray-100 dark:text-gray-100">
                            Attack: {activeParagon?.gameData.attack}
                          </p>
                          <p className="text-md font-medium text-gray-100 dark:text-gray-100">
                            Health: {activeParagon?.gameData.health}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Popover.Content>
                ) : null}
              </div>
            </Popover.Root>
          )}
        </div>
        <div className="flex h-24 w-full flex-col  items-center justify-center  ">
          <p>{activeParagon?.name.slice(0, activeParagon?.name.length - 8)}</p>
          <div className="flex gap-2">
            <button
              onClick={() => handleParagonChange("left")}
              className="h-12 w-12 "
              title="Change Paragon"
            >
              <Icon
                icon="ic:outline-arrow-circle-left"
                className="h-8 w-8 dark:text-neutral-400"
              />
            </button>
            <button
              onClick={() => handleParagonChange("right")}
              className="h-12 w-12 "
              title="Change Paragon"
            >
              <Icon
                icon="ic:outline-arrow-circle-right"
                className="h-8 w-8 dark:text-neutral-400"
              />
            </button>
          </div>
        </div>
        <div className="h-96 w-full border-t-2 border-neutral-300 dark:border-neutral-600 xl:h-3/5">
          <div className="h-48 w-full px-6 xl:h-1/2">
            <TypeChart />
          </div>
          <div className=" h-48 w-full p-6 xl:h-1/2">
            <EnergyChart />
          </div>
        </div>
      </div>
      <div className="flex h-fit w-full flex-wrap items-center justify-center gap-2 overflow-y-auto xl:h-full xl:w-4/6">
        <div className="flex w-full items-center justify-between px-4 pb-4">
          <div className="flex flex-row gap-2 ">
            <StatsToggle />
            <HoverToggle />
          </div>
          <div className="flex gap-2">
            <button
              title="Clear Deck"
              onClick={() => setDeck([])}
              className="rounded-md bg-neutral-300 p-2 hover:bg-neutral-400 dark:bg-neutral-600 dark:text-gray-300 dark:hover:bg-neutral-500"
            >
              <Icon icon="radix-icons:reset" className="h-6 w-6" />
            </button>{" "}
            <button
              title="Save and Copy Deck Code"
              onClick={() => {
                copyToClipboard(deckCode, setShowAlert);
              }}
              className="rounded-md bg-neutral-300 p-2 hover:bg-neutral-400 dark:bg-neutral-600 dark:text-gray-300 dark:hover:bg-neutral-500"
            >
              <Icon icon="ic:twotone-save-alt" className="h-6 w-6" />
            </button>
          </div>
        </div>
        {deck.length === 0
          ? null
          : sortedCards.map((card, index) =>
              desktop ? (
                <HoverCardPrimitive.Root openDelay={0} closeDelay={0}>
                  <div key={index}>
                    <HoverCardPrimitive.Trigger asChild>
                      <div
                        onMouseEnter={() => [setCardInfo(card)]}
                        className=" relative flex h-36 w-24 flex-col items-center justify-start rounded-md"
                      >
                        <Image
                          src={card.media.image}
                          alt="card"
                          className="  h-24 w-16  rounded-md bg-slate-700 p-0"
                          fill
                          style={{ objectFit: "cover" }}
                        ></Image>
                        {statsEnabled ? (
                          <>
                            <div className="absolute right-8 top-0  flex items-center justify-center text-gray-300">
                              {handleCardType(card.gameData.cardType)}
                            </div>
                            <div className=" absolute right-1 top-1 flex items-center justify-center text-white">
                              <p>{card.gameData.cost}</p>
                            </div>
                          </>
                        ) : null}
                        {card.gameData.cardType !==
                        "Unit" ? null : statsEnabled ? (
                          <>
                            <div className="absolute bottom-5 left-1 flex items-center justify-center text-white">
                              <p>{card.gameData.attack}</p>
                            </div>
                            <div className="absolute bottom-6 right-8 flex items-center justify-center  text-gray-200">
                              {handleCardIcon(card.gameData.functionText)}
                            </div>
                            <div className="absolute bottom-5 right-1 flex items-center justify-center   text-white">
                              <p>{card.gameData.health}</p>
                            </div>
                          </>
                        ) : null}
                      </div>
                    </HoverCardPrimitive.Trigger>
                    {hoverEnabled ? (
                      <HoverCardPrimitive.Content
                        side="left"
                        align="center"
                        sideOffset={2}
                        className={clsx(
                          "radix-side-top:animate-slide-up radix-side-bottom:animate-slide-down z-50 h-[400px] w-[800px]",
                          " rounded-xl p-4",
                          "bg-neutral-500 shadow-2xl shadow-black dark:bg-gray-800",
                          "focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75"
                        )}
                      >
                        <HoverCardPrimitive.Arrow className="fill-current text-slate-600 dark:text-gray-800" />

                        <div className="flex h-full w-full space-x-4">
                          <div className="flex w-1/3 items-center justify-center py-4">
                            <div className="h-96 w-64 py-2">
                              <Image
                                //src={getImg(card.parallel, card.title, card.slug)}
                                src={cardInfo?.media.image!}
                                alt="card"
                                className="h-full w-full rounded-md"
                                //quality={100}
                                height={72}
                                width={400}
                                //fill
                                style={{ objectFit: "cover" }}
                              ></Image>
                            </div>
                          </div>
                          <div className="flex flex-col gap-4">
                            <h1 className="text-xl font-medium text-gray-100 dark:text-gray-100">
                              {cardInfo?.name}
                            </h1>
                            <h2 className="text-xl font-medium text-gray-100 dark:text-gray-100">
                              {cardInfo?.gameData.cardType}
                            </h2>
                            <p className="p-y overflow-y-auto text-sm font-normal text-gray-100 dark:text-gray-400">
                              {formatText(cardInfo?.gameData.functionText!)}
                            </p>
                            <div>
                              <p className="text-md font-medium text-gray-100 dark:text-gray-100">
                                Energy Cost: {cardInfo?.gameData.cost}
                              </p>
                            </div>
                            <div className="flex flex-row gap-6">
                              <p className="text-md font-medium text-gray-100 dark:text-gray-100">
                                Attack: {cardInfo?.gameData.attack}
                              </p>
                              <p className="text-md font-medium text-gray-100 dark:text-gray-100">
                                Health: {cardInfo?.gameData.health}
                              </p>
                            </div>
                          </div>
                        </div>
                      </HoverCardPrimitive.Content>
                    ) : null}

                    <div className="flex w-full flex-row items-center justify-center gap-2 pt-1">
                      <button onClick={() => removeOne(index)}>
                        <Icon
                          icon="mdi:minus-box"
                          className="h-6 w-6 text-neutral-700 dark:text-neutral-500"
                        />
                      </button>
                      <button onClick={() => addOne(card)}>
                        <Icon
                          icon="material-symbols:add-box"
                          className="h-6 w-6 text-neutral-700 dark:text-neutral-500"
                        />
                      </button>
                    </div>
                  </div>
                </HoverCardPrimitive.Root>
              ) : (
                <Popover.Root>
                  <div key={index}>
                    <Popover.Trigger asChild>
                      <div
                        onClick={() => [setCardInfo(card)]}
                        className=" relative flex h-36 w-24 flex-col items-center justify-start rounded-md"
                      >
                        <Image
                          src={card.media.image}
                          alt="card"
                          className="  h-24 w-16  rounded-md bg-slate-700 p-0"
                          fill
                          style={{ objectFit: "cover" }}
                        ></Image>
                        {statsEnabled ? (
                          <>
                            <div className="absolute right-8 top-0  flex items-center justify-center text-gray-300">
                              {handleCardType(card.gameData.cardType)}
                            </div>
                            <div className=" absolute right-1 top-1 flex items-center justify-center text-white">
                              <p>{card.gameData.cost}</p>
                            </div>
                          </>
                        ) : null}
                        {card.gameData.cardType !==
                        "Unit" ? null : statsEnabled ? (
                          <>
                            <div className="absolute bottom-5 left-1 flex items-center justify-center text-white">
                              <p>{card.gameData.attack}</p>
                            </div>
                            <div className="absolute bottom-6 right-8 flex items-center justify-center  text-gray-200">
                              {handleCardIcon(card.gameData.functionText)}
                            </div>
                            <div className="absolute bottom-5 right-1 flex items-center justify-center   text-white">
                              <p>{card.gameData.health}</p>
                            </div>
                          </>
                        ) : null}
                      </div>
                    </Popover.Trigger>
                    {hoverEnabled ? (
                      <Popover.Content
                        side="bottom"
                        align="center"
                        sideOffset={2}
                        className={clsx(
                          "radix-side-top:animate-slide-up radix-side-bottom:animate-slide-down z-50 h-[400px] w-[400px]",
                          " rounded-xl p-4",
                          "bg-neutral-500 shadow-2xl shadow-black dark:bg-gray-800",
                          "focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75"
                        )}
                      >
                        <Popover.Arrow className="fill-current text-slate-600 dark:text-gray-800" />

                        <div className="flex h-full w-full space-x-4">
                          <div className="flex w-full items-center justify-center py-4">
                            <div className="h-72 w-56 py-2">
                              <Image
                                //src={getImg(card.parallel, card.title, card.slug)}
                                src={cardInfo?.media.image!}
                                alt="card"
                                className="h-full w-full rounded-md"
                                //quality={100}
                                height={72}
                                width={400}
                                //fill
                                style={{ objectFit: "cover" }}
                              ></Image>
                            </div>
                          </div>
                          <div className="flex flex-col gap-4">
                            <h1 className="text-xl font-medium text-gray-100 dark:text-gray-100">
                              {cardInfo?.name}
                            </h1>
                            <h2 className="text-xl font-medium text-gray-100 dark:text-gray-100">
                              {cardInfo?.gameData.cardType}
                            </h2>
                            <p className="p-y overflow-y-auto text-sm font-normal text-gray-100 dark:text-gray-400">
                              {formatText(cardInfo?.gameData.functionText!)}
                            </p>
                            <div>
                              <p className="text-md font-medium text-gray-100 dark:text-gray-100">
                                Energy Cost: {cardInfo?.gameData.cost}
                              </p>
                            </div>
                            <div className="flex flex-row gap-6">
                              <p className="text-md font-medium text-gray-100 dark:text-gray-100">
                                Attack: {cardInfo?.gameData.attack}
                              </p>
                              <p className="text-md font-medium text-gray-100 dark:text-gray-100">
                                Health: {cardInfo?.gameData.health}
                              </p>
                            </div>
                          </div>
                        </div>
                      </Popover.Content>
                    ) : null}

                    <div className="flex w-full flex-row items-center justify-center gap-2 pt-1">
                      <button onClick={() => removeOne(index)}>
                        <Icon
                          icon="mdi:minus-box"
                          className="h-6 w-6 text-neutral-700 dark:text-neutral-500"
                        />
                      </button>
                      <button onClick={() => addOne(card)}>
                        <Icon
                          icon="material-symbols:add-box"
                          className="h-6 w-6 text-neutral-700 dark:text-neutral-500"
                        />
                      </button>
                    </div>
                  </div>
                </Popover.Root>
              )
            )}
        {placeHolderCards.map((card, index) => (
          <div key={index}>
            <div className=" relative flex h-36 w-24 flex-col items-center justify-start rounded-md bg-slate-800 ">
              {
                <Image
                  src={"/images/placeholder.png"}
                  alt="Placeholder Card"
                  className="  h-24 w-16  rounded-md bg-slate-700 p-0"
                  fill
                  style={{ objectFit: "cover", objectPosition: "top" }}
                ></Image>
              }
            </div>
            <div className="flex w-full flex-row justify-center gap-2 pt-1">
              <span className="flex h-6 w-6 items-center justify-center rounded-sm "></span>
              <span className="flex h-6 w-6 items-center justify-center rounded-sm "></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
