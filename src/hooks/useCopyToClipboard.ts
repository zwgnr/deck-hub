import { type SetStateAction, useRef, useState } from 'react';

const writeClipboardContent = async (text: string) => {
  if (!navigator.clipboard) {
    return document.execCommand('copy', false, text);
  }
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};

export const useCopyToClipboard = () => {
  const [copiedText, setCopiedText] = useState<string>();
  const [error, setError] = useState<string>();
  const resetTimeout = useRef<NodeJS.Timeout>();

  const handleSuccesfulCopy = (func: (value: SetStateAction<boolean>) => void) => {
    func(true);
  };

  const handleFailedCopy = (errorText: string) => {
    setCopiedText(undefined);
    setError(errorText);
  };

  const handleReset = () => {
    setCopiedText(undefined);
    setError(undefined);
  };

  const copyToClipboard = async (text: string, func: (value: SetStateAction<boolean>) => void) => {
    if (resetTimeout.current) {
      clearTimeout(resetTimeout.current);
    }

    (await writeClipboardContent(text))
      ? handleSuccesfulCopy(func)
      : handleFailedCopy('Copy to clipboard failed');

    resetTimeout.current = setTimeout(handleReset, 2000);
  };

  return {
    copyToClipboard,
    copiedText,
    error,
  };
};
