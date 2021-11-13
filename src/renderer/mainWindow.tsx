import { app, clipboard, ipcRenderer } from "electron";
import React, { useEffect, useRef, useState } from "react";
import { SearchBox } from "@fluentui/react/lib/SearchBox";
import { Stack, IStackTokens } from "@fluentui/react/lib/Stack";
import { FocusZone } from "@fluentui/react-focus";
import { CodeBlock, dracula } from "react-code-blocks";
import Fuse from "fuse.js";
import { classNames } from "./theme";
import { Snip, useSnippets } from "./useSnippets";
import {
  PASTE_SNIPPET,
  SEARCH_SNIPPET,
  NEW_SNIPPET,
  OPEN_SETTINGS_EDITOR,
} from "../constants";
import { NewSnippet } from "./NewSnippet";
import { store } from "../store";
import { SearchSnippets } from "./SearchSnippets";

export const MainWindow = () => {
  const [selected, setSelected] = useState(-1);
  const [searchText, setSearchText] = useState<string>("");
  const [doCreateSnip, setDoCreateSnip] = useState(false);
  const [snippets, addSnippets] = useSnippets();
  const [filteredSnippets, setFilteredSnippets] = useState(snippets);

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

  useEffect(() => {
    if (
      searchText.replaceAll(" ", "") ===
      ">" + OPEN_SETTINGS_EDITOR.replaceAll("-", "")
    ) {
      setSearchText("");
      ipcRenderer.send(OPEN_SETTINGS_EDITOR);
    } else if (searchText === "") {
      setFilteredSnippets(snippets);
    } else if (fuse.current) {
      const result = fuse.current.search(searchText);
      const sortDesc = (
        a: Fuse.FuseResult<Snip>,
        b: Fuse.FuseResult<Snip>
      ): number => b.score - a.score;
      setFilteredSnippets(result.sort(sortDesc).map((a) => a.item));
    } else {
      setFilteredSnippets(snippets);
    }
  }, [searchText]);

  useEffect(() => {
    fuse.current = new Fuse(snippets, {
      keys: ["snip", "language", "description"],
    });
    if (searchText === "") {
      setFilteredSnippets(snippets);
    }
  }, [snippets]);

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
