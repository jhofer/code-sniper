import { ipcRenderer } from "electron";
import { useEffect, useState } from "react";

interface Snip {
  description: string;
  snip: string;
  language: string;
}

export function useSnippets(): [Array<Snip>, (snip: Snip) => void] {
  const [snippets, setSnippets] = useState([]);
  useEffect(() => {
    ipcRenderer.send("load-snippets-requested");
    ipcRenderer.on("load-snippets-succeeded", (ev, snippets) => {
      console.log("load-snippets-succeeded", snippets);
      setSnippets(snippets);
    });
  }, []);

  const addSnippet = (snip: Snip) => {
    setSnippets([...snippets, snip]);
    ipcRenderer.send("save-snip", snip);
  };
  return [snippets, addSnippet];
}
