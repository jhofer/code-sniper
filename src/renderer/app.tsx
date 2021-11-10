import { initializeIcons } from "@fluentui/react";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { MainWindow } from "./mainWindow";
function render() {
  initializeIcons();
  ReactDOM.render(<MainWindow />, document.body);
}
render();
