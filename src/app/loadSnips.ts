import { store } from "../index";
import fs from "fs";
import path from "path";

import { SAVE_PATH_KEY } from "../constants";
import {  BrowserWindow, dialog } from "electron";

export const loadSnips = () => {
  setStorageFolder()
  const savepath = store.get(SAVE_PATH_KEY) as string;
  let allSnippets = []
  if(savepath) {
    const files = fs.readdirSync(savepath);
    allSnippets = files
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
      .filter((s) => s.description && s.snip).reverse();
  
  } 
  
  if(allSnippets.length==0){
    allSnippets= [{language:"markdown", description:"Intro", snip:`
          Howdy boys and girls this is a little intro and will be gone after you created your first Snippet.

          # Insert Snippet 
          Press: Ctrl+O 
          This will open this Window and should work almost everywhere. 
          Enter your searchterm and use TAB and the ARROWKEYs to select your snippet.
          Finally press ENTER to insert it where you were.
        
          # Create Snippet
          Press: Ctrl+M
          If you have any text selected press Ctrl+M to open a window to create a new Snippet.
          Press TAB to select programming language press TAB again to Enter a little description.
          Finally press ENTER to save and close the window.

          # Edit Settings:
          Press: Ctrl+O
          Type "> open settings" into the searchbar. 
          It will open a json file with your default editor to edit the settings

          Have Fun ;-)

    `}]
  }
  console.log(allSnippets);
  return allSnippets;
};
const parseFileContent = (data: string, language: string) => {
  const eol = "\n"
  const snippetsRaw = data.split("___" + eol);
  console.log(language, "snippets:", snippetsRaw.length)
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

export function setStorageFolder() {
  const existingPath = store.get(SAVE_PATH_KEY);
  if (!existingPath) {
    const options: any = {
      properties: ["openDirectory", "createDirectory"],
      filters: [
        { name: "md", extensions: ["md"] },
        { name: "All Files", extensions: ["*"] },
      ],
    };
    dialog.showOpenDialog(BrowserWindow.getAllWindows()[0], options).then((result) => {
      const [fileName] = result.filePaths;
      store.set(SAVE_PATH_KEY, fileName);
    });
  } else {
    console.log("existingpath", existingPath);
  }
}
