import { BrowserWindow, clipboard, ipcMain } from "electron";
import fs from "fs";
import path from "path";
import robot from "robotjs";
import { store, windowContainer } from "../index";
import { loadSnips } from "./loadSnips";

export const registerEventListener = () => {
  ipcMain.on("paste-snipped", (event, arg) => {
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
  ipcMain.on("close-window", (event, arg) => {
    console.log(event);
    console.log(arg);
    BrowserWindow.getFocusedWindow().hide();
  });
  ipcMain.on("save-snip", (event, snippet) => {
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

  ipcMain.on("load-snippets-requested", () => {
    console.log("load-snippets-requested");
    const snippets = loadSnips();
    windowContainer.win.webContents.send("load-snippets-succeeded", snippets);
  });
};
