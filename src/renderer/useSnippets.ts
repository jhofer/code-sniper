import { ipcRenderer } from "electron";
import { useEffect, useState } from "react";
import {
  LOAD_SNIPPETS_REQUESTED,
  LOAD_SNIPPETS_SUCCEEDED,
  SAVE_SNIPPET,
} from "../constants";

export interface Snip {
  description: string;
  snip: string;
  language: string;
}

export function useSnippets(): [Array<Snip>, (snip: Snip) => void] {
  const [snippets, setSnippets] = useState<Array<Snip>>([]);
  useEffect(() => {
    ipcRenderer.send(LOAD_SNIPPETS_REQUESTED);
    ipcRenderer.on(LOAD_SNIPPETS_SUCCEEDED, (ev, snippets) => {
      setSnippets(snippets);
    });
  }, []);

  const addSnippet = (snip: Snip) => {
    setSnippets([snip, ...snippets]);
    ipcRenderer.send(SAVE_SNIPPET, snip);
  };
  return [snippets, addSnippet];
}
