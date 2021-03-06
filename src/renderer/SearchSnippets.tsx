import { ipcRenderer } from "electron";
import React, { useEffect, useRef, useState } from "react";
import { SearchBox } from "@fluentui/react/lib/SearchBox";
import { Stack } from "@fluentui/react/lib/Stack";
import { FocusZone } from "@fluentui/react-focus";
import { CodeBlock, dracula } from "react-code-blocks";
import Fuse from "fuse.js";
import { classNames } from "./theme";
import { Snip, useSnippets } from "./useSnippets";
import {
  OPEN_SETTINGS_EDITOR,
} from "../constants";

interface SearchSnippetsProps {
  onSelect: (snip: Snip) => void;
}

export function SearchSnippets(props: SearchSnippetsProps) {
  const { onSelect } = props;
  const [selected, setSelected] = useState(-1);
  const [searchText, setSearchText] = useState<string>("");

  const [snippets] = useSnippets();
  const [filteredSnippets, setFilteredSnippets] = useState(snippets);

  const searchBoxRef = useRef(null);
  const fuse = useRef<Fuse<Snip>>(null);

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
        height: "100%",
        width: "100%",
        padding: 10,
      }}
    >
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
            onSelect(selectedSnippets);
          }
        }}
      >
        {filteredSnippets.map((s, i) => {
          const snipLines = s.snip.split("\n");
          const a = s.snip.split("\n").slice(0, 15).join("\n");
          return (
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
              <div style={{ maxHeight: 200, overflowY: "scroll" }}>
                <CodeBlock
                  text={s.snip}
                  language={s.language}
                  showLineNumbers
                  theme={dracula}
                />
              </div>
            </li>
          );
        })}
      </FocusZone>
    </Stack>
  );
}
