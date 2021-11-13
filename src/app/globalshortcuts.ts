import { BrowserWindow, globalShortcut } from "electron";
import robot from "robotjs";
import { tryGetValue } from "../store";

import { NEW_SNIPPET, NEW_SNIP_SHORT_CUT, SEARCH_SNIPPET, SEARCH_SNIP_SHORT_CUT } from "../constants";
import { loadSnips } from "./loadSnips";

export const registerGlobalShortCuts = (mainWindow: BrowserWindow) => {
  newSnip(mainWindow);
  searchSnippets(mainWindow);
};

function newSnip(mainWindow: BrowserWindow) {
  
  const shortCutNew = tryGetValue(NEW_SNIP_SHORT_CUT,"CommandOrControl+M");
  globalShortcut.register(shortCutNew, () => {
    if (mainWindow.isVisible()) {
      mainWindow.hide();
      mainWindow.minimize();
    } else {
      loadSnips();
      // copy current selection
      robot.keyTap("c", ["control"]);
      setTimeout(()=>{
       // mainWindow.minimize()
        mainWindow.show();
        mainWindow.restore();
        mainWindow.focus();
        mainWindow.webContents.send(NEW_SNIPPET);
      })
      
    }
    console.log(`${shortCutNew} is pressed`);
  });
}
function searchSnippets(mainWindow: BrowserWindow) {
  const shortCut = tryGetValue(SEARCH_SNIP_SHORT_CUT,"CommandOrControl+O");
  globalShortcut.register(shortCut, () => {
    if (mainWindow.isVisible()) {
      mainWindow.hide();
      mainWindow.minimize();
    } else {
      loadSnips();
      mainWindow.show();
      mainWindow.restore();
      mainWindow.webContents.send(SEARCH_SNIPPET);
    }
    console.log(`${shortCut} is pressed`);
  });
}

