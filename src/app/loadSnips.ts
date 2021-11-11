import { store } from "../index";
import fs from "fs";
import path from "path";

import { SAVE_PATH_KEY } from "../constants";
import { BrowserWindow, dialog } from "electron";

export const loadSnips = () => {
  const savepath = store.get(SAVE_PATH_KEY) as string;
  const files = fs.readdirSync(savepath);
  const allSnippets = files
    .reduce((all, fileName) => {
      const extension = path.extname(fileName);
      const language = path.basename(fileName, extension);
      const fullPath = path.join(savepath, fileName);
      console.log("load file", fullPath);
      const data = fs.readFileSync(fullPath, "utf8");
      console.log("filecontent: ",data);
      const snippets = parseFileContent(data, language);
      return [...all, ...snippets];
    }, [])
    .filter((s) => s.description && s.snip);

  console.log(allSnippets);
  return allSnippets;
};
const parseFileContent = (data: string, language: string) => {
  const eol = "\n"
  const snippetsRaw = data.split("___" + eol);
  console.log(language, "snipets:", snippetsRaw.length)
  return snippetsRaw.map((element) => {
    console.log("parse",element)
    const rgx = new RegExp("```.*" + eol);
    const splitted = element.split(rgx);
    const [description, snip] = splitted;
    const el =  {
      language,
      description: description.replace("# ", ""),
      snip,
    };
    console.log(el)
    return el;
  });
};

export function setStorageFolder(mainWindow: BrowserWindow) {
  const existingPath = store.get(SAVE_PATH_KEY);
  if (!existingPath) {
    const options: any = {
      properties: ["openDirectory", "createDirectory"],
      filters: [
        { name: "md", extensions: ["md"] },
        { name: "All Files", extensions: ["*"] },
      ],
    };
    dialog.showOpenDialog(mainWindow, options).then((result) => {
      const [fileName] = result.filePaths;
      store.set(SAVE_PATH_KEY, fileName);
    });
  } else {
    console.log("existingpath", existingPath);
  }
}
