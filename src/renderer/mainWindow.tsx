import { clipboard, ipcRenderer } from "electron";
import React, { useEffect, useRef, useState } from "react";
import AceEditor from "react-ace";
import { SearchBox } from "@fluentui/react/lib/SearchBox";
import { Stack, IStackTokens } from "@fluentui/react/lib/Stack";
import { ComboBox, TextField } from "@fluentui/react";
import { FocusZone } from "@fluentui/react-focus";
import { CodeBlock, dracula } from "react-code-blocks";
import "ace-builds/src-noconflict/theme-dracula";

import { languages } from "./languages";
import { classNames } from "./theme";
import { useSnippets } from "./useSnippets";
import { useSnip } from "./useSnip";
import { PASTE_SNIPPED, SEARCH_SNIP, NEW_SNIP } from "../constants";

export const MainWindow = () => {
  const [snip, setSnip] = useSnip();
  const [selected, setSelected] = useState(-1);
  const [description, setDescription] = useState("");
  const [searchText, setSearchText] = useState("");
  const [language, setLanguage] = useState("typescript");
  const [doCreateSnip, setDoCreateSnip] = useState(false);
  const [snippets, addSnippets] = useSnippets();
  const searchBoxRef = useRef(null);
  const titleFieldRef = useRef(null);

  useEffect(() => {
    ipcRenderer.on(NEW_SNIP, () => {
      titleFieldRef.current?.focus();
      setDoCreateSnip(true);
      setDescription("");
    });
    ipcRenderer.on(SEARCH_SNIP, () => {
      searchBoxRef.current?.focus();
      setDoCreateSnip(false);
    });
  }, []);

  const filteredSnippets = snippets.filter(
    (s) =>
      searchText == "" ||
      s.description.includes(searchText) ||
      s.snip.includes(searchText)
  );

  return doCreateSnip ? (
    <Stack style={{ height: "100vh", width: "100vw" }}>
      <Stack horizontal style={{ width: "100%" }}>
        <Stack.Item>
          <ComboBox
            componentRef={titleFieldRef}
            text={language}
            onChange={(e, o, i) => {
              console.log(o.text);
              setLanguage(o.text);
            }}
            style={{ width: 200 }}
            allowFreeform={true}
            autoComplete={"on"}
            options={languages.map((l) => ({ key: l, text: l }))}
          />
        </Stack.Item>
        <Stack.Item align="stretch" style={{ width: "100%" }}>
          <TextField
            style={{ width: "100%" }}
            placeholder="Snippet Description"
            value={description}
            onChange={(ev) => setDescription(ev.currentTarget.value)}
            onKeyDown={(e) => {
              if (e.key == "Enter") {
                const newSnip = { description, snip, language };
                addSnippets(newSnip);
                ipcRenderer.send("close-window");
              }
            }}
          />
        </Stack.Item>
      </Stack>
      <AceEditor
        style={{
          height: "100%",
          width: "100%",
        }}
        theme="dracula"
        placeholder="Code here"
        mode={language}
        name="basic-code-editor"
        onChange={(currentCode) => setSnip(currentCode)}
        fontSize={13}
        showPrintMargin={true}
        showGutter={true}
        highlightActiveLine={true}
        value={snip}
        setOptions={{
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          enableSnippets: true,
          showLineNumbers: true,
          tabSize: 4,
        }}
      />
    </Stack>
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
            console.log("select snippet");
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
