import { BrowserWindow, globalShortcut } from "electron";
import robot from "robotjs";
import { NEW_SNIP, SEARCH_SNIP } from "../constants";

export const registerGlobalShortCuts = (mainWindow: BrowserWindow) => {
  newSnip(mainWindow);
  searchSnippets(mainWindow);
};

function newSnip(mainWindow: BrowserWindow) {
  const shortCutNew = "CommandOrControl+M";
  globalShortcut.register(shortCutNew, () => {
    if (mainWindow.isVisible()) {
      mainWindow.hide();
      mainWindow.minimize();
    } else {
      // copy current selection
      robot.keyTap("c", ["control"]);
      setTimeout(()=>{
       // mainWindow.minimize()
        mainWindow.show();
        mainWindow.restore();
        mainWindow.focus();
        mainWindow.webContents.send(NEW_SNIP);
      })
      
    }
    console.log(`${shortCutNew} is pressed`);
  });
}
function searchSnippets(mainWindow: BrowserWindow) {
  const shortCut = "CommandOrControl+O";
  globalShortcut.register(shortCut, () => {
    if (mainWindow.isVisible()) {
      mainWindow.hide();
      mainWindow.minimize();
    } else {
      mainWindow.show();
      mainWindow.restore();
      mainWindow.webContents.send(SEARCH_SNIP);
    }
    console.log(`${shortCut} is pressed`);
  });
}
