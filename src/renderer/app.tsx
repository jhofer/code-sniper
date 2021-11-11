import { initializeIcons, createTheme, ThemeProvider } from "@fluentui/react";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { MainWindow } from "./MainWindow";
import "./index.css"

const myTheme = createTheme({
  palette: {
    themePrimary: '#50ecfa',
    themeLighterAlt: '#03090a',
    themeLighter: '#0d2628',
    themeLight: '#18474b',
    themeTertiary: '#308d96',
    themeSecondary: '#46cfdc',
    themeDarkAlt: '#61eefa',
    themeDark: '#79f0fb',
    themeDarker: '#9cf4fc',
    neutralLighterAlt: '#2f313e',
    neutralLighter: '#353846',
    neutralLight: '#404353',
    neutralQuaternaryAlt: '#474a5b',
    neutralQuaternary: '#4d5061',
    neutralTertiaryAlt: '#676a7c',
    neutralTertiary: '#fafaf5',
    neutralSecondary: '#fbfbf7',
    neutralPrimaryAlt: '#fcfcf8',
    neutralPrimary: '#f8f8f0',
    neutralDark: '#fdfdfb',
    black: '#fefefd',
    white: '#282a36',
  }});

function render() {
  initializeIcons();
  ReactDOM.render(
    <ThemeProvider applyTo="body" theme={myTheme}>
      <MainWindow />
    </ThemeProvider>,
    document.body
  );
}
render();
