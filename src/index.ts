import {
  app,
  BrowserWindow,
  clipboard,
  globalShortcut,
  ipcMain,
  dialog,
} from "electron";
import robot from "robotjs";
import fs from "fs";
import Store from "electron-store";

export const store = new Store();
import { registerEventListener } from "./eventHandler";
// This allows TypeScript to pick up the magic constant that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  // eslint-disable-line global-require
  app.quit();
}
export const windowContainer: { win: BrowserWindow } = {
  win: null,
};
const createWindow = (): void => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    frame: false,
    autoHideMenuBar: true,
    movable: false,
    resizable: false,
    fullscreenable: false,
    center: true,
    height: 800,
    width: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  windowContainer.win = mainWindow;
  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  const shortCut = "CommandOrControl+O";
  globalShortcut.register(shortCut, () => {
    if (mainWindow.isVisible()) {
      mainWindow.hide();
      mainWindow.minimize();
    } else {
      mainWindow.show();
      mainWindow.restore();
      mainWindow.webContents.send("search-snip");
    }
    console.log(`${shortCut} is pressed`);
  });

  const shortCutNew = "CommandOrControl+M";
  globalShortcut.register(shortCutNew, () => {
    if (mainWindow.isVisible()) {
      mainWindow.hide();
      mainWindow.minimize();
    } else {
      robot.keyTap("c", ["command"]);
      mainWindow.show();
      mainWindow.restore();
      mainWindow.webContents.send("new-snip");
      getStorageFolder();
    }
    console.log(`${shortCutNew} is pressed`);
  });

  mainWindow.on("blur", () => app.hide());
  mainWindow.on("show", () => {
    setTimeout(() => {
      mainWindow.focus();
    }, 200);
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

registerEventListener();

app.on("will-quit", () => {
  // Unregister all shortcuts.
  globalShortcut.unregisterAll();
});

app.on("before-quit", () => {
  console.log("before-quit");
  windowContainer.win.removeAllListeners("close");
  globalShortcut.unregisterAll();
  windowContainer.win.close();
});

function getStorageFolder() {
  const existingPath = store.get("savepath");
  if (!existingPath) {
    const options: any = {
      properties: ["openDirectory", "createDirectory"],
      filters: [
        { name: "md", extensions: ["md"] },
        { name: "All Files", extensions: ["*"] },
      ],
    };
    return dialog
      .showOpenDialog(windowContainer.win, options)
      .then((result) => {
        const [fileName] = result.filePaths;
        store.set("savepath", fileName);
        return fileName;
      });
  } else {
    console.log("existingpath", existingPath);
    return Promise.resolve(existingPath);
  }
}
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
