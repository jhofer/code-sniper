import { clipboard, ipcRenderer } from "electron";
import React, { useEffect, useRef, useState } from "react";
import AceEditor from "react-ace";
import { SearchBox } from "@fluentui/react/lib/SearchBox";
import { Stack, IStackTokens } from "@fluentui/react/lib/Stack";
import { ComboBox, getTheme, mergeStyleSets, TextField } from "@fluentui/react";
import { FocusZone } from "@fluentui/react-focus";
import { CodeBlock, dracula } from "react-code-blocks";
import { languages } from "./languages";

languages.forEach((a) => {
  require(`ace-builds/src-noconflict/mode-${a}`);
});

import "ace-builds/src-noconflict/theme-dracula";

const stackTokens: Partial<IStackTokens> = { childrenGap: 20 };
// import { windowContainer } from "./index";
const theme = getTheme();
const classNames = mergeStyleSets({
  photoList: {
    display: "inline-block",
    border: "1px solid " + theme.palette.neutralTertiary,
    padding: 10,
    lineHeight: 0,
    overflow: "hidden",
  },
  photoCell: {
    position: "relative",
    display: "inline-block",
    padding: 2,
    boxSizing: "border-box",
    selectors: {
      "&:focus": {
        outline: "none",
      },
      "&:focus:after": {
        content: '""',
        position: "absolute",
        right: 4,
        left: 4,
        top: 4,
        bottom: 4,
        border: "1px solid " + theme.palette.white,
        outline: "2px solid " + theme.palette.themePrimary,
      },
    },
  },
});

export const Search = () => {
  const [clipboardText, setClipboard] = useState(clipboard.readText());
  const [snip, setSnip] = useState(clipboardText);
  const [selected, setSelected] = useState(-1);
  const [description, setDescription] = useState("");
  const [searchText, setSearchText] = useState("");
  const [language, setLanguage] = useState("typescript");
  const [newSnip, setNewSnip] = useState(false);
  const [snippets, setSnippets] = useState([
    {
      description: "searchbox",
      language: "typescript",
      snip: `<SearchBox
  ref={searchBoxRef}
  autoFocus
  placeholder="Search Snippet"
  value={searchText}
  onChange={(e) => setSearchText(e.currentTarget.value)}
/>`,
    },
    {
      description: "useRef",
      language: "typescript",
      snip: "const searchBoxRef = useRef(null);",
    },
  ]);
  const searchBoxRef = useRef(null);
  const titleFieldRef = useRef(null);

  setInterval(() => {
    setClipboard(clipboard.readText());
  }, 1000);

  useEffect(() => {
    ipcRenderer.on("new-snip", () => {
      titleFieldRef.current?.focus();
      setNewSnip(true);
      setDescription("");
    });
    ipcRenderer.on("search-snip", () => {
      searchBoxRef.current?.focus();
      setNewSnip(false);
    });
  }, []);

  useEffect(() => {
    setSnip(clipboardText);
  }, [clipboardText]);

  const filteredSnippets = snippets.filter(
    (s) =>
      searchText == "" ||
      s.description.includes(searchText) ||
      s.snip.includes(searchText)
  );

  return newSnip ? (
    <Stack style={{ height: "100vh", width: "100vw" }}>
      <Stack horizontal style={{ width: "100%" }}>
        <Stack.Item>
          <ComboBox
            text={language}
            onChange={(e, o, i) => {
              console.log(o.text);
              setLanguage(o.text);
            }}
            style={{ width: 200 }}
            allowFreeform={false}
            autoComplete={"on"}
            options={languages.map((l) => ({ key: l, text: l }))}
          />
        </Stack.Item>
        <Stack.Item align="stretch" style={{ width: "100%" }}>
          <TextField
            style={{ width: "100%" }}
            componentRef={titleFieldRef}
            placeholder="Snippet Description"
            value={description}
            onChange={(ev) => setDescription(ev.currentTarget.value)}
            onKeyDown={(e) => {
              if (e.key == "Enter") {
                setSnippets([...snippets, { description, snip, language }]);
                ipcRenderer.send("close-window", snip);
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
    <Stack tokens={stackTokens}>
      <SearchBox
        ref={searchBoxRef}
        autoFocus
        placeholder="Search Snippet"
        value={searchText}
        onChange={(e) => setSearchText(e.currentTarget.value)}
      />
      <FocusZone
        as="ul"
        className={classNames.photoList}
        onKeyDown={(e) => {
          if (e.key == "Enter") {
            const selectedSnippets = filteredSnippets[selected];
            ipcRenderer.send("paste-snipped", selectedSnippets.snip);
            console.log("select snippet");
          }
        }}
      >
        {filteredSnippets.map((s, i) => (
          <li
            className={classNames.photoCell}
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
              language={"typescript"}
              showLineNumbers
              theme={dracula}
            />
          </li>
        ))}
      </FocusZone>
    </Stack>
  );
};
