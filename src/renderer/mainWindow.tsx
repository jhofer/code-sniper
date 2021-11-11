import { clipboard, ipcRenderer } from "electron";
import React, { useEffect, useRef, useState } from "react";
import { SearchBox } from "@fluentui/react/lib/SearchBox";
import { Stack, IStackTokens } from "@fluentui/react/lib/Stack";
import { FocusZone } from "@fluentui/react-focus";
import { CodeBlock, dracula } from "react-code-blocks";

import { classNames } from "./theme";
import { useSnippets } from "./useSnippets";
import {
  PASTE_SNIPPED,
  SEARCH_SNIP,
  NEW_SNIP,
  OPEN_SETTINGS_EDITOR,
} from "../constants";
import { NewSnippet } from "./NewSnippet";

export const MainWindow = () => {
  const [selected, setSelected] = useState(-1);
  const [searchText, setSearchText] = useState("");
  const [doCreateSnip, setDoCreateSnip] = useState(false);
  const [snippets, addSnippets] = useSnippets();

  const searchBoxRef = useRef(null);

  useEffect(() => {
    ipcRenderer.on(NEW_SNIP, () => {
      setDoCreateSnip(true);
    });
    ipcRenderer.on(SEARCH_SNIP, () => {
      searchBoxRef.current?.focus();
      setDoCreateSnip(false);
    });
  }, []);

  useEffect(() => {
    if (searchText == OPEN_SETTINGS_EDITOR) setSearchText("");
    ipcRenderer.send(OPEN_SETTINGS_EDITOR);
  }, [searchText]);

  const filteredSnippets = snippets.filter(
    (s) =>
      searchText == "" ||
      s.description.includes(searchText) ||
      s.snip.includes(searchText)
  );

  return doCreateSnip ? (
    <NewSnippet
      onSave={(snip) => {
        addSnippets(snip);
        ipcRenderer.send("close-window");
      }}
    />
  ) : (
    <Stack>
      <SearchBox
        ref={searchBoxRef}
        autoFocus
        placeholder="Search Snippet"
        value={searchText}
        onChange={(e) => setSearchText(e.currentTarget.value)}
      />
      <FocusZone
        as="ul"
        className={classNames.snippetList}
        onKeyDown={(e) => {
          if (e.key == "Enter") {
            const selectedSnippets = filteredSnippets[selected];
            ipcRenderer.send(PASTE_SNIPPED, selectedSnippets.snip);
          }
        }}
      >
        {filteredSnippets.map((s, i) => (
          <li
            className={classNames.codeSnippet}
            key={i}
            aria-posinset={i + 1}
            aria-setsize={filteredSnippets.length}
            aria-label="Snip"
            data-is-focusable
            onFocus={() => setSelected(i)}
          >
            <h1>{s.description}</h1>
            <h2>{s.language}</h2>
            <CodeBlock
              text={s.snip}
              language={s.language}
              showLineNumbers
              theme={dracula}
            />
          </li>
        ))}
      </FocusZone>
    </Stack>
  );
};
