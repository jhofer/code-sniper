import { ipcRenderer } from "electron";
import React, { useEffect, useRef, useState } from "react";
import { Stack } from "@fluentui/react/lib/Stack";
import Fuse from "fuse.js";
import { Snip, useSnippets } from "./useSnippets";
import {
  PASTE_SNIPPET,
  SEARCH_SNIPPET,
  NEW_SNIPPET,
} from "../constants";
import { NewSnippet } from "./NewSnippet";
import { store } from "../store";
import { SearchSnippets } from "./SearchSnippets";

export const MainWindow = () => {
  const [doCreateSnip, setDoCreateSnip] = useState(false);
  const [_, addSnippets] = useSnippets();
  const searchBoxRef = useRef(null);
  const fuse = useRef<Fuse<Snip>>(null);

  useEffect(() => {
    ipcRenderer.on(NEW_SNIPPET, () => {
      setDoCreateSnip(true);
    });
    ipcRenderer.on(SEARCH_SNIPPET, () => {
      searchBoxRef.current?.focus();
      setDoCreateSnip(false);
    });
  }, []);

  return (
    <Stack
      grow
      style={{
        minHeight: "98vh",
        width: "100%",
      }}
    >
      {doCreateSnip ? (
        <NewSnippet
          onSave={(snip) => {
            addSnippets(snip);
            ipcRenderer.send("close-window");
          }}
        />
      ) : (
        <SearchSnippets onSelect={(snipppet)=>{
          ipcRenderer.send(PASTE_SNIPPET, snipppet.snip);
        }} />
      )}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          width: "100%",
          fontSize: 10,
          padding: 2,
        }}
      >
        <div>version {store.get("version")}</div>
      </div>
    </Stack>
  );
};
