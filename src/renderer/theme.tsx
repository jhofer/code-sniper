import { getTheme, mergeStyleSets } from "@fluentui/react";

const theme = getTheme();
export const classNames = mergeStyleSets({
  snippetList: {
    display: "inline-block",
    padding: 10,
    lineHeight: 0,
    overflow: "hidden",
  },
  codeSnippet: {
    position: "relative",
    display: "inline-block",
    padding: 10,
    boxSizing: "border-box",
    selectors: {
      "&:focus": {
        outline: "none",
      },
      "&:focus:after": {
        content: '""',
        position: "absolute",
        right: 4,
        left: 4,
        top: 4,
        bottom: 4,
       // border: "1px solid " + theme.palette.white,
        outline: "2px solid " + "#50ecfa"//theme.palette.themePrimary,
      },
    },
  },
});
