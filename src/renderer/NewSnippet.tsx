import { ipcRenderer } from "electron";
import React, { useEffect, useRef, useState } from "react";
import AceEditor from "react-ace";
import { Stack } from "@fluentui/react/lib/Stack";
import { ComboBox, TextField } from "@fluentui/react";
import "ace-builds/src-noconflict/theme-dracula";

import { languages } from "./languages";
import { useSnip } from "./useSnip";
import { NEW_SNIP } from "../constants";
import { Snip } from "./useSnippets";

interface NewSnippetProps {
  onSave: (snip: Snip) => void;
}

export function NewSnippet(props: NewSnippetProps) {
  const { onSave } = props;
  const [snip, setSnip] = useSnip();
  const [description, setDescription] = useState("");
  const [language, setLanguage] = useState("typescript");

  useEffect(() => {
    ipcRenderer.on(NEW_SNIP, () => {
      titleFieldRef.current?.focus();
      setDescription("");
    });
  }, []);

  const titleFieldRef = useRef(null);
  return (
    <Stack
      style={{
        height: "100vh",
        width: "100vw",
      }}
    >
      <Stack
        horizontal
        style={{
          width: "100%",
        }}
      >
        <Stack.Item>
          <ComboBox
            componentRef={titleFieldRef}
            text={language}
            onChange={(e, o, i) => {
              console.log(o.text);
              setLanguage(o.text);
            }}
            style={{
              width: 200,
            }}
            allowFreeform={true}
            autoComplete={"on"}
            options={languages.map((l) => ({
              key: l,
              text: l,
            }))}
          />
        </Stack.Item>
        <Stack.Item
          align="stretch"
          style={{
            width: "100%",
          }}
        >
          <TextField
            style={{
              width: "100%",
            }}
            placeholder="Snippet Description"
            value={description}
            onChange={(ev) => setDescription(ev.currentTarget.value)}
            onKeyDown={(e) => {
              if (e.key == "Enter") {
                const newSnip = {
                  description: description,
                  snip: snip,
                  language: language,
                };
                onSave(newSnip);
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
  );
}
