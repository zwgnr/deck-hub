export function formatText(text: string) {
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

    return (
      <div className="flex flex-col gap-2 pt-1 pb-4">
        <p>
          {tag === null ? null : tag === "Muster:" ? (
            <span className="text-md mr-1 w-fit rounded-md bg-neutral-800 p-1 font-bold ">
              {tag}
            </span>
          ) : (
            <p className="text-md w-fit rounded-md bg-neutral-900 p-1">{tag}</p>
          )}
          {formatted}
        </p>
      </div>
    );
  }

  function handleMuster(arr: string[]) {
    let muster = [...arr];
    muster.shift(); //since muster was the first word, now remove it from array
    return handleWordStyles(muster, "Muster:");
  }

  function handleDefender(arr: string[]) {
    let defender = [...arr];
    defender.shift();
    return handleWordStyles(defender, "Defender");
  }

  function handleDecay(arr: string[]) {
    let decay = [...arr];
    decay.shift();
    return handleWordStyles(decay, "Decay");
  }

  function handleShielded(arr: string[]) {
    let shielded = [...arr];
    shielded.shift();
    return handleWordStyles(shielded, "Shielded");
  }

  /*
  if (result[0] === "*Shielded*.") {
    let shielded = [...result];
    shielded.shift();
    //console.log(shielded);

    if (shielded[0] === "*Muster*:") {
      return (
        <>
          <p className="text-md w-fit rounded-md bg-slate-900 p-1">
            Battle Ready
          </p>
          {handleMuster(shielded)}
        </>
      );
    }
    let newText = shielded.join(" ");
    return (
      <div className="flex flex-col gap-2">
        <p className="text-md w-fit rounded-md bg-slate-900 p-1">Shielded</p>
        <p>{newText}</p>
      </div>
    );
  }
*/
  if (result !== undefined) {
    if (result[0] === "*Battle" && result[1] === "Ready*") {
      let br = [...result];
      br.shift();
      br.shift();
      br.shift();
      //console.log(br[0]);

      if (br[0] === "*Muster*:") {
        return (
          <>
            <p className="text-md w-fit rounded-md bg-slate-900 p-1">
              Battle Ready
            </p>
            {handleMuster(br)}
          </>
        );
      }

      let newText = br.join(" ");
      return (
        <div className="flex flex-col gap-2">
          <p className="text-md w-fit rounded-md bg-slate-900 p-1">
            Battle Ready
          </p>
          <p>{newText}</p>
        </div>
      );
    }

    if (result[0] === "*Defender*." || result[0] === "*Defender*:") {
      return handleDefender(result);
    }

    if (result[0] === "*Decay*.") {
      return handleDecay(result);
    }

    if (result[0] === "*Muster*:") {
      return handleMuster(result);
    }

    if (result[0] === "*Shielded*.") {
      return handleShielded(result);
    }

    let remaining = [...result];

    return handleWordStyles(remaining, null);
  }
}
