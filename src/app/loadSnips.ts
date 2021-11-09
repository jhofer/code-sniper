import { store } from "../index";
import fs from "fs";
import path from "path";
import { EOL } from "os";

export const loadSnips = () => {
  const savepath = store.get("savepath") as string;
  const files = fs.readdirSync(savepath);
  const allSnippets = files
    .reduce((all, fileName) => {
      const extension = path.extname(fileName);
      const language = path.basename(fileName, extension);
      const fullPath = path.join(savepath, fileName);
      console.log("load file", fullPath);
      const data = fs.readFileSync(fullPath, "utf8");
      const snippets = parseFileContent(data, language);
      return [...all, ...snippets];
    }, [])
    .filter((s) => s.description && s.snip);

  console.log(allSnippets);
  return allSnippets;
};
const parseFileContent = (data: string, language: string) => {
  return data.split("___" + EOL).map((element) => {
    const rgx = new RegExp("```.*" + EOL);
    const splitted = element.split(rgx);
    const [description, snip] = splitted;
    return {
      language,
      description,
      snip,
    };
  });
};
