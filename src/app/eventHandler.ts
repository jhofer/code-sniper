import { BrowserWindow, clipboard, ipcMain } from "electron";
import fs from "fs";
import path from "path";
import robot from "robotjs";
import {
  CLOSE_WINDOW,
  LOAD_SNIPPETS_REQUESTED,
  LOAD_SNIPPETS_SUCCEEDED,
  PASTE_SNIPPED,
  SAVE_SNIP,
} from "../constants";
import { store, windowContainer } from "../index";
import { loadSnips } from "./loadSnips";

export const registerEventListener = () => {
  ipcMain.on(PASTE_SNIPPED, (event, arg) => {
    console.log(event);
    console.log(arg);
    BrowserWindow.getFocusedWindow().hide();
    setTimeout(() => {
      console.log("type stuff");
      clipboard.writeText(arg);
      // TODO: fix for windows
      robot.keyTap("v", ["command"]);
      console.log("stuff pasted");
    }, 100);
  });
  ipcMain.on(CLOSE_WINDOW, (event, arg) => {
    console.log(event);
    console.log(arg);
    BrowserWindow.getFocusedWindow().hide();
  });
  ipcMain.on(SAVE_SNIP, (event, snippet) => {
    const savepath = store.get("savepath") as string;
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
    windowContainer.win.webContents.send(LOAD_SNIPPETS_SUCCEEDED, snippets);
  });
};
