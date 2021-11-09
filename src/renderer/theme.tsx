import { getTheme, mergeStyleSets } from "@fluentui/react";

const theme = getTheme();
export const classNames = mergeStyleSets({
  photoList: {
    display: "inline-block",
    border: "1px solid " + theme.palette.neutralTertiary,
    padding: 10,
    lineHeight: 0,
    overflow: "hidden",
  },
  photoCell: {
    position: "relative",
    display: "inline-block",
    padding: 2,
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
        border: "1px solid " + theme.palette.white,
        outline: "2px solid " + theme.palette.themePrimary,
      },
    },
  },
});
