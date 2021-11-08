import { BrowserWindow, clipboard, ipcMain } from "electron";
import robot from "robotjs";

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
};
