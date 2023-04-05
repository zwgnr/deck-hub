import { uuid } from 'uuidv4';

export const formatText = (text: string) => {
  const modifiedString = text?.replace(/\n/g, ' ');
  const result = modifiedString?.split(' ');

  function handleWordStyles(arr: string[], tag: string | null) {
    const formatted = arr.map((word, index) => {
      // Regular expression to match pattern "*word*" || "*Battle" "Ready*"
      const pattern = /\*(Battle.*?)|(.*?Ready\*)|\*(.*?)\*/g;
      if (word.match(pattern)) {
        const formattedWord = word.replace(/\*/g, ''); // Remove asterisks
        return (
          <span key={uuid()} className="italic text-lime-400">
            {formattedWord}{' '}
          </span>
        ); //
      }
      if (word === '*' && arr[index - 1] !== '*' && arr[index + 1] !== '*') {
        return (
          <>
            <br key={uuid()} />
            <br key={uuid()} />
          </>
        ); // Replace single asterisk with a <br> tag
      }
      return <span key={uuid()}>{word} </span>;
    });

    return (
      <div className="flex flex-col gap-2 pt-1 pb-4">
        <p>
          {(() => {
            if (tag === null) {
              return null;
            }
            if (tag === 'Muster:') {
              return (
                <span className="text-md mr-1 w-fit rounded-md bg-neutral-800 p-1 font-bold">
                  {tag}
                </span>
              );
            }
            return <p className="text-md w-fit rounded-md bg-neutral-900 p-1">{tag}</p>;
          })()}
          {formatted}
        </p>
      </div>
    );
  }

  function handleMuster(arr: string[]) {
    const muster = [...arr];
    // since muster was the first word, now remove it from array
    muster.shift();
    return handleWordStyles(muster, 'Muster:');
  }

  function handleDefender(arr: string[]) {
    const defender = [...arr];
    defender.shift();
    return handleWordStyles(defender, 'Defender');
  }

  function handleDecay(arr: string[]) {
    const decay = [...arr];
    decay.shift();
    return handleWordStyles(decay, 'Decay');
  }

  function handleShielded(arr: string[]) {
    const shielded = [...arr];
    shielded.shift();
    return handleWordStyles(shielded, 'Shielded');
  }
  if (result !== undefined) {
    if (result[0] === '*Battle' && result[1] === 'Ready*') {
      const br = [...result];
      br.shift();
      br.shift();
      br.shift();

      if (br[0] === '*Muster*:') {
        return (
          <>
            <p className="text-md w-fit rounded-md bg-slate-900 p-1">Battle Ready</p>
            {handleMuster(br)}
          </>
        );
      }

      const newText = br.join(' ');
      return (
        <div className="flex flex-col gap-2">
          <p className="text-md w-fit rounded-md bg-slate-900 p-1">Battle Ready</p>
          <p>{newText}</p>
        </div>
      );
    }

    if (result[0] === '*Defender*.' || result[0] === '*Defender*:') {
      return handleDefender(result);
    }

    if (result[0] === '*Decay*.') {
      return handleDecay(result);
    }

    if (result[0] === '*Muster*:') {
      return handleMuster(result);
    }

    if (result[0] === '*Shielded*.') {
      return handleShielded(result);
    }

    const remaining = [...result];

    return handleWordStyles(remaining, null);
  }
  return null;
};
