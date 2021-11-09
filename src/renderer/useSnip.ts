import { clipboard } from "electron";
import { useEffect, useState } from "react";

export function useSnip(): [
  string,
  React.Dispatch<React.SetStateAction<string>>
] {
  const [clipboardText, setClipboard] = useState<string>(clipboard.readText());
  const [snip, setSnip] = useState<string>(clipboardText);

  useEffect(() => {
    const internval = setInterval(() => {
      setClipboard(clipboard.readText());
    }, 1000);

    return () => {
      clearInterval(internval);
    };
  }, []);

  useEffect(() => {
    setSnip(clipboardText);
  }, [clipboardText]);

  return [snip, setSnip];
}
