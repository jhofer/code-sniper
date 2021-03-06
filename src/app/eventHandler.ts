import { BrowserWindow, clipboard, ipcMain } from "electron";
import fs from "fs";
import path from "path";
import robot from "robotjs";
import {
  CLOSE_WINDOW,
  LOAD_SNIPPETS_REQUESTED,
  LOAD_SNIPPETS_SUCCEEDED,
  OPEN_SETTINGS_EDITOR,
  PASTE_SNIPPET,
  SAVE_PATH_KEY,
  SAVE_SNIPPET,
} from "../constants";
import { store } from "../store";
import { loadSnips } from "./loadSnips";

export const registerEventListener = (mainWindow: BrowserWindow) => {
  ipcMain.on(PASTE_SNIPPET, (event, arg) => {
    console.log(event);
    console.log(arg);
    mainWindow.minimize();
    mainWindow.hide();
    setTimeout(() => {
      console.log("type stuff");
      clipboard.writeText(arg);
      // TODO: fix for windows
      robot.keyTap("v", ["control"]);
      console.log("stuff pasted");
    }, 100);
  });
  ipcMain.on(CLOSE_WINDOW, (event, arg) => {
    console.log(event);
    console.log(arg);
    mainWindow.hide();
  });
  ipcMain.on(SAVE_SNIPPET, (event, snippet) => {
    const savepath = store.get(SAVE_PATH_KEY) as string;
    const { description, snip, language } = snippet;
    const fileName = language + ".md";
    const filePath = path.join(savepath, fileName);
    console.log("write to", filePath);
    fs.appendFile(
      filePath,
      `___
# ${description}
\`\`\`${language}
${snip}
\`\`\`
`,
      console.error
    );
  });

  ipcMain.on(LOAD_SNIPPETS_REQUESTED, () => {
    const snippets = loadSnips();
    if(snippets){
      mainWindow.webContents.send(LOAD_SNIPPETS_SUCCEEDED, snippets);
    }
  });

  ipcMain.on(OPEN_SETTINGS_EDITOR, () => {
    store.openInEditor();
  });
};
